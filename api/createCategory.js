const mongoose = require('mongoose');
const Category = require('./models/Category');

// Ajoutez la configuration de connexion à MongoDB ici
mongoose.connect('mongodb+srv://ssouqi:ssouqi@cluster0.mwbmbep.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
});

// Gestion des événements de la connexion
mongoose.connection.on('connected', () => {
    console.log('Connexion à MongoDB établie avec succès');

    // Créez une nouvelle instance de la catégorie avec les détails appropriés
    const categories = [
        { label: "Informatique", image: "Informatique.png" },
        { label: "Electroménager", image: "Electroménager.jpg" },
        { label: "Téléphonie", image: "Téléphonie.jpeg" },
        { label: "Jeux Vidéo", image: "Jeux.jpg" },
        { label: "Meuble", image: "Meuble.jpg" },
        { label: "Bricolage", image: "Bricolage.jpg" },
        { label: "Mode", image: "Mode.jpg" },
        { label: "Parfum", image: "Parfum.jpeg" },
        { label: "Beauté", image: "Beauté.jpg" },
        { label: "Voiture", image: "Voiture.jpg" },
        { label: "Sport", image: "Sport.jpg" }
    ];

    // Sauvegardez chaque nouvelle catégorie dans la base de données
    Promise.all(categories.map(categoryData => new Category(categoryData).save()))
        .then(savedCategories => {
            savedCategories.forEach(savedCategory => {
                console.log('Nouvelle catégorie enregistrée avec succès :', savedCategory);
            });
            // Fermer la connexion après avoir effectué les opérations nécessaires
            mongoose.connection.close();
        })
        .catch(error => {
            console.error('Erreur lors de l\'enregistrement des nouvelles catégories :', error);

            console.log('Erreur détaillée lors de l\'enregistrement des nouvelles catégories :', error);

            // Fermer la connexion en cas d'erreur
            mongoose.connection.close();
        });
});

mongoose.connection.on('error', (err) => {
    console.error('Erreur de connexion à MongoDB :', err);
});
