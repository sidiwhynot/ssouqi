const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Product = require('./models/Product');
const Category = require('./models/Category'); 
const path = require('path');
const cors = require('cors');


const app = express();
const port = 8081;
const jwtSecret = 'sidi290319';





// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ message: 'Token d\'authentification manquant' });
  }

  const token = authToken.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token d\'authentification invalide' });
  }

  try {
    const decodedToken = jwt.verify(token, jwtSecret);
    req.user = {
      userId: decodedToken.userId,
    };
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification du token :', error);
    return res.status(401).json({ message: 'Token d\'authentification invalide', error: error.message });
  }
};



app.use(cors({
  origin: 'http://192.168.1.50:8081', // Remplacez par l'origine de votre frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Autorise les cookies et les informations d'authentification
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sidiwhynot@gmail.com', // Remplacez par votre adresse e-mail
        pass: 'spmp oqti zhrc xonc' // Remplacez par votre mot de passe
    },
});

mongoose.set('debug', true);

mongoose.connect('mongodb+srv://ssouqi:ssouqi@cluster0.mwbmbep.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,

})
    .then(() => {
        console.log("Connexion à MongoDB réussie");
    })
    .catch((err) => {
        console.log("Erreur lors de la connexion à MongoDB", err);
    });
// Écouter les requêtes sur le port spécifié
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${8081}`);
});
const User = require("./models/User");




const sendVerificationEmail = async (email, verificationToken) => {
    const mailOptions = {
        from: 'sidiismailba@gmail.com',
        to: email,
        subject: 'Vérification de l\'adresse e-mail',
        text: `Cliquez sur le lien suivant pour vérifier votre adresse e-mail: http://192.168.1.50:8081/verification?token=${verificationToken}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail de vérification envoyé avec succès.');
    } catch (error) {
        console.error(`Erreur lors de l'envoi de l'e-mail de vérification : ${error}`);
    }
};

app.post('/register', async (req, res, next) => {
    console.log('Requête reçue :', req.body);
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet e-mail est déjà utilisé.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        newUser.verificationToken = crypto.randomBytes(20).toString("hex");

        await newUser.save();

        sendVerificationEmail(newUser.email, newUser.verificationToken);

        res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'utilisateur', error);
        next(error);
    }
});



app.get('/verification', async (req, res) => {
    try {
        const { token } = req.query;
        console.log('Token de vérification reçu :', token);

        if (!token) {
            return res.status(400).json({ message: 'Token de vérification manquant.' });
        }

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            console.log('Utilisateur non trouvé avec ce token de vérification :', token);
            return res.status(404).json({ message: 'Utilisateur non trouvé avec ce token de vérification.' });
        }

        console.log('Utilisateur trouvé avec succès :', user);

        user.verified = true;
        user.verificationToken = null;

        await user.save();

        console.log('Utilisateur marqué comme vérifié avec succès.');

        res.status(200).json({ message: 'Adresse e-mail vérifiée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'e-mail', error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la vérification de l\'e-mail.' });
    }
});


app.post('/login', async (req, res, next) => {
    try {

        const { email, password } = req.body;
        console.log('Requête de connexion reçue. Email:', email);
        
        const user = await User.findOne({ email: { $regex: new RegExp("^" + email + "$", "i") } });
        console.log('Utilisateur trouvé dans la base de données :', user);
        

        if (!user) {
            console.log('Aucun utilisateur trouvé avec cet e-mail.');
            return res.status(404).json({ message: 'Utilisateur non trouvé avec cet e-mail.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('Mot de passe incorrect.');
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }

        console.log('Connexion réussie. Utilisateur ID:', user._id);

        const token = jwt.sign({ userId: user._id }, jwtSecret);
        console.log('Token généré :', token);

        return res.status(200).json({ message: 'Connexion réussie.', token });
    } catch (error) {
        console.error('Erreur lors de la connexion de l\'utilisateur', error);
        return next(error);
    }
});






app.get('/api/user', async (req, res) => {
    try {
        const authToken = req.headers.authorization;

        if (!authToken) {
            return res.status(401).json({ message: 'Token d\'authentification manquant' });
        }

        const token = authToken.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token d\'authentification invalide' });
        }

        try {
            console.log('Token reçu :', authToken);
            console.log('Clé secrète utilisée pour la vérification du token :', jwtSecret);

            const decodedToken = jwt.verify(token, jwtSecret);
            console.log('Token décrypté :', decodedToken);

            const userId = decodedToken.userId;

            const user = await User.findById(userId);

            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
        } catch (error) {
            console.error('Erreur lors de la vérification du token :', error);
            res.status(401).json({ message: 'Token d\'authentification invalide' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});





app.put('/api/user', async (req, res) => {
    try {
        const authToken = req.headers.authorization;

        if (!authToken) {
            return res.status(401).json({ message: 'Token d\'authentification manquant' });
        }

        const token = authToken.split(' ')[1];

        try {
            const decodedToken = jwt.verify(token, jwtSecret);
            const userId = decodedToken.userId;

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            // Mettez à jour les informations de l'utilisateur ici
            const { newName, newEmail, newPassword } = req.body;
            user.name = newName;
            user.email = newEmail;

            if (newPassword) {
                user.password = await bcrypt.hash(newPassword, 10);
            }

            await user.save();

            res.status(200).json(user);
        } catch (error) {
            console.error('Erreur lors de la vérification du token :', error);
            res.status(401).json({ message: 'Token d\'authentification invalide' });
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour des informations utilisateur :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour créer un nouveau produit
app.post('/api/products', async (req, res) => {
    try {
      // Extraction des données du corps de la requête
      const { productName, productDescription, price, sellerName, sellerPhoneNumber, category, image } = req.body;
  
      // Vérification de l'existence de la catégorie spécifiée
      let existingCategory = await Category.findById(category);
  
      // Si la catégorie n'existe pas, la créer
      if (!existingCategory) {
        const newCategory = new Category({ _id: category, label: "Nouvelle Catégorie" });
        existingCategory = await newCategory.save();
      }
  
      // Création d'une nouvelle instance de produit
      const newProduct = new Product({
        productName,
        productDescription,
        price,
        sellerName,
        sellerPhoneNumber,
        category,
        image,
      });
  
      // Enregistrement du nouveau produit dans la base de données
      const savedProduct = await newProduct.save();
  
      // Ajout du nouveau produit à la liste des produits de la catégorie correspondante
      existingCategory.products.push(savedProduct._id);
      await existingCategory.save();
  
      // Réponse avec le produit créé
      res.status(201).json(savedProduct);
    } catch (error) {
      console.error('Erreur lors de la création du produit :', error);
      res.status(500).json({ error: 'Erreur lors de la création du produit' });
    }
  });
  

  

  //une route pour récupérer les détails d'un produit 
  app.get('/api/products', async (req, res) => {
    try {
      // Récupération de tous les produits
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
  });
  
//Récupération d'un produit spécifique
app.get('/api/products/:productId', async (req, res) => {
    try {
      console.log('Demande de produit avec ID :', req.params.productId);
      const product = await Product.findById(req.params.productId);
  
      if (!product) {
        console.error('Produit non trouvé');
        return res.status(404).json({ error: 'Produit non trouvé' });
      }
  
      console.log('Produit trouvé :', product);
      res.json(product);
    } catch (error) {
      console.error('Erreur lors de la récupération du produit :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
    }
  });
  



// Mise à jour d'un produit
app.put('/api/products/:productId', async (req, res) => {
    try {
      // Extraction des données du corps de la requête
      const { productName, productDescription, price, sellerName, sellerPhoneNumber, category } = req.body;
  
      // Mise à jour d'un produit par son ID
      const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, {
        productName,
        productDescription,
        price,
        sellerName,
        sellerPhoneNumber,
        category,
      }, { new: true });
  
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Produit non trouvé' });
      }
  
      // Réponse avec le produit mis à jour
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
    }
  });
  


// Suppression d'un produit
app.delete('/api/products/:productId', async (req, res) => {
    try {
      // Suppression d'un produit par son ID
      const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Produit non trouvé' });
      }
  
      // Réponse avec un message de succès
      res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
    }
  });



// Récupération de toutes les catégories avec produits
app.get('/api/categories', async (req, res) => {
  try {
    console.log('Fetching categories...');

    // Récupération de toutes les catégories avec les produits associés
    const categories = await Category.find().populate('products');
    console.log('Categories with products:', categories); // Ajout de ce journal

    // Transformation des URL d'images
    const categoriesWithCorrectImages = categories.map(category => ({
      _id: category._id,
      label: category.label,
      image: `/images/${category.image}`,
      products: category.products,
    }));

    // Réponse avec les catégories et les produits associés
    res.json(categoriesWithCorrectImages);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Error fetching categories' });
  }
});



//  une route pour récupérer les produits d'une catégorie spécifique
app.get('/api/categories/:categoryId/products', async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
  
      // Récupération de la catégorie spécifique avec les produits associés
      const category = await Category.findById(categoryId);
  
      if (!category) {
        return res.status(404).json({ error: 'Catégorie non trouvée' });
      }
  
      // Transformation des URL d'images
      const categoryWithCorrectImages = {
        _id: category._id,
        label: category.label,
        image: `/images/${category.image}`,
        products: category.products,
      };
  
      // Réponse avec la catégorie et les produits associés
      res.json(categoryWithCorrectImages);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits de la catégorie :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des produits de la catégorie' });
    }
});



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue sur le serveur.', error: err.message });
});


// Utilisation du middleware d'authentification
app.use(authenticateToken);