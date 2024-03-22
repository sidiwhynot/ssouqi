import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ProductListScreen = ({ route, navigation }) => {
  const { selectedCategory } = route.params;
  const [numColumns, setNumColumns] = useState(2);
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      // Mettre à jour refreshing à true pour indiquer le début du rafraîchissement
      setRefreshing(true);
  
      const response = await axios.get(`http://192.168.1.134:8081/api/categories/${selectedCategory._id}/products`);
    //  console.log('Produits récupérés depuis le backend :', response.data);
  
      // Charger les détails complets des produits
      const productsWithDetails = await Promise.all(
        response.data.products.map(async (productId) => {
          const productDetails = await axios.get(`http://192.168.1.134:8081/api/products/${productId}`);
          return productDetails.data;
        })
      );
  
      // Mettre à jour la liste des produits avec les données récupérées
      setProducts(productsWithDetails);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
  
      if (error.response) {
       // console.error('Réponse du serveur:', error.response.data);
       // console.error('Statut du serveur:', error.response.status);
      } else if (error.request) {
        console.error('La requête n\'a pas reçu de réponse');
      } else {
        console.error('Erreur lors de la configuration de la requête', error.message);
      }
    } finally {
      // Mettre à jour refreshing à false pour indiquer la fin du rafraîchissement
      setRefreshing(false);
    }
  };

  const updateProductList = async () => {
    // Charger à nouveau les produits après la publication d'un nouveau produit
    await fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, [route.params?.selectedCategory]);

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetailScreen', { product });
  };

  if (!selectedCategory) {
    console.warn('Selected category is undefined');
    return null;
  }

  return (
<View style={styles.container}>
  <Text style={styles.categoryText}>{`Catégorie ${selectedCategory.label}`}</Text>
  <FlatList
    data={products}
    numColumns={numColumns}
    renderItem={({ item }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleProductPress(item)}>
        <View style={styles.productItem}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <Text style={styles.productText}>{item.productName}</Text>
          <Text style={styles.productText}>{`Prix: RMU ${item.price}`}</Text>
        </View>
      </TouchableOpacity>
    )}
    keyExtractor={(product) => product._id ? product._id.toString() : product.productName}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={fetchProducts}
      />
    }
  />
</View>

  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f0f0f0',
  },
  categoryText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#008e97',
    textAlign: 'center',
  },
  productItem: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 12,
    padding: 20,
    margin: 5,
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  productText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 8,
    color: 'black',
  },
});

export default ProductListScreen;
