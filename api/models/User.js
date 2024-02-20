// Importation du module Mongoose
const mongoose = require('mongoose');

// Définition du schéma d'utilisateur avec Mongoose
const userSchema = new mongoose.Schema({
    // Champs du schéma
    name: {
        type: String,

    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },

    verificationToken:String,
    addresses: [{
        name: String,
        mobileNo: String,
        houseNo: String,
        street: String,
        landmark: String,
        city: String,
        country: String,
        postalCode: String,
    }],
    orders:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"orders"
       
    },
    ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
});

// Création d'un modèle d'utilisateur à partir du schéma
const User = mongoose.model('User', userSchema);

// Exportation du modèle d'utilisateur
module.exports = User;
