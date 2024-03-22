import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const UserProducts = () => {
  const navigation = useNavigation();
  const [userProducts, setUserProducts] = useState([]);

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        const response = await axios.get('http://192.168.1.134:8081/api/user/products', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
  
        console.log('Réponse de la récupération des produits de l\'utilisateur :', response);
  
        if (response.status === 200) {
          console.log('Liste des produits récupérée :', response.data);
          setUserProducts(response.data);
        } else {
          console.error('Erreur lors de la récupération des produits de l\'utilisateur', response);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des produits de l\'utilisateur :', error);
      }
    };
  
    fetchUserProducts();
  }, []);
  
  

  const handleEditProduct = (productId) => {
    // Naviguer vers l'écran de modification avec l'ID du produit
    navigation.navigate('EditProductScreen', { productId });
  };

  return (
    <View>
      <Text>Liste de vos produits :</Text>
      {userProducts.length === 0 ? (
        <Text>Aucun produit trouvé.</Text>
      ) : (
        <FlatList
          data={userProducts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEditProduct(item._id)}>
              <View>
                <Text>Nom du produit: {item.productName}</Text>
                <Text>Description: {item.productDescription}</Text>
                {/* ... Ajoutez d'autres détails selon vos besoins */}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
  
};

export default UserProducts;
