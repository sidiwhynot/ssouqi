import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductPubScreen = ({ navigation }) => {
  const [userProducts, setUserProducts] = useState([]);

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        // Récupérer l'identifiant de l'utilisateur depuis le stockage local
        const userId = await AsyncStorage.getItem("userId");

        // Effectuer une requête vers le backend pour récupérer les produits de l'utilisateur
        const response = await axios.get(`http://192.168.1.134:8081/api/user-products/${userId}`);

        // Mettre à jour l'état userProducts avec les données récupérées
        setUserProducts(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits de l\'utilisateur:', error.message);
      }
    };

    fetchUserProducts();
  }, []);

  const handleEditProduct = (productId) => {
    // Naviguer vers l'écran d'édition du produit avec l'ID du produit
    navigation.navigate('EditProductScreen', { productId });
  };

  const handleDeleteProduct = async (productId) => {
    try {
      // Effectuer une requête vers le backend pour supprimer le produit
      await axios.delete(`http://192.168.1.134:8081/api/products/${productId}`);

      // Mettre à jour l'état userProducts en excluant le produit supprimé
      setUserProducts((prevProducts) => prevProducts.filter((product) => product.productId !== productId));

      // Afficher une alerte pour informer que le produit a été supprimé
      Alert.alert('Produit supprimé', 'Le produit a été supprimé avec succès.');
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error.message);
    }
  };

  return (
    <View>
      <Text>Liste des Produits Publiés</Text>
      <FlatList
        data={userProducts}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={({ item }) => (
          <View>
            {/* Afficher les détails du produit */}
            <Text>{item.productName}</Text>
            <Text>{item.productDescription}</Text>

            {/* Boutons pour modifier et supprimer le produit */}
            <TouchableOpacity onPress={() => handleEditProduct(item.productId)}>
              <Text>Modifier</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleDeleteProduct(item.productId)}>
              <Text>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default ProductPubScreen;


