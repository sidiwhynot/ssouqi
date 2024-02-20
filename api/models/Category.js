// Modèle de données pour les catégories (models/Category.js)
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  label: { type: String, required: true },
  image: { type: String, required: true },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
