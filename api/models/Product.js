const mongoose = require('mongoose');

// Référence au modèle de données pour la catégorie
const Category = require('./Category');  // Assurez-vous que le chemin est correct

// Définissez le schéma du produit
const productSchema = new mongoose.Schema({
  productName: String,
  productDescription: String,
  price: Number,
  sellerName: String,
  sellerPhoneNumber: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },  // Référence à la catégorie
  image: String,
});

// Créez le modèle du produit
const Product = mongoose.model('Product', productSchema);

module.exports = Product;

