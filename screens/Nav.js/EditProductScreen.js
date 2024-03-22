import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProductScreen = ({ route }) => {
  const { productId } = route.params;
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [price, setPrice] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhoneNumber, setSellerPhoneNumber] = useState('');

  useEffect(() => {
    // Chargez les détails du produit en fonction de l'ID ici
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    try {
      // Effectuez une requête pour obtenir les détails du produit en fonction de l'ID
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`http://localhost:8081/api/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const productDetails = response.data;
        setProductName(productDetails.productName);
        setProductDescription(productDetails.productDescription);
        setPrice(productDetails.price.toString());
        setSellerName(productDetails.sellerName);
        setSellerPhoneNumber(productDetails.sellerPhoneNumber);
      } else {
        console.error('Erreur lors de la récupération des détails du produit');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du produit :', error);
    }
  };

  const handleUpdateProduct = async () => {
    // Effectuez une requête PUT pour mettre à jour les détails du produit
    // Utilisez l'ID du produit et les nouvelles valeurs des champs
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await axios.put(
        `http://192.168.1.134:8081/api/products/${productId}`,
        {
          productName,
          productDescription,
          price: parseFloat(price),
          sellerName,
          sellerPhoneNumber,
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        console.log('Produit mis à jour avec succès !');
        // Ajoutez ici la logique de redirection ou d'affichage d'une confirmation
      } else {
        console.error('Erreur lors de la mise à jour du produit');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit :', error);
    }
  };

  return (
    <View>
      <Text>Edit Product</Text>
      <TextInput
        placeholder="Product Name"
        value={productName}
        onChangeText={(text) => setProductName(text)}
      />
      <TextInput
        placeholder="Product Description"
        value={productDescription}
        onChangeText={(text) => setProductDescription(text)}
        multiline
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={(text) => setPrice(text)}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Seller Name"
        value={sellerName}
        onChangeText={(text) => setSellerName(text)}
      />
      <TextInput
        placeholder="Seller Phone Number"
        value={sellerPhoneNumber}
        onChangeText={(text) => setSellerPhoneNumber(text)}
        keyboardType="phone-pad"
      />
      <TouchableOpacity onPress={handleUpdateProduct}>
        <Text>Update Product</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProductScreen;
