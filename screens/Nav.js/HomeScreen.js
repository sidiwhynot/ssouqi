// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { ScrollView, View, TextInput, Pressable, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { AntDesign, Feather as FeatherIcon } from '@expo/vector-icons';
import Carousel from '../../components/Carousel';
import CategoryScreen from '../Nav.js/CategoryScreen';
import axios from 'axios';

const HomeScreen = ({ route ,navigation }) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [categories, setCategories] = useState([]);

  const updateProductList = async () => {
    try {
      const response = await axios.get('http://192.168.1.134:8081/api/categories');
      console.log('Catégories mises à jour avec succès :', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des catégories :', error.message);
      // Ajoutez une logique pour afficher l'erreur à l'utilisateur, par exemple, un message d'alerte
      // Vous pouvez également renvoyer une réponse avec un code d'erreur ici
    }
  };
  
  useEffect(() => {
    // Mettez à jour les catégories lorsqu'il y a un changement
    updateProductList();
  }, [route.params?.selectedCategory]); 

  const handleVoirToutPress = () => {
    setShowAllCategories(!showAllCategories);
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <Pressable style={styles.searchInputContainer}>
          <AntDesign name="search1" size={30} color="black" />
          <TextInput placeholder="Recherche" style={styles.searchInput} />
        </Pressable>
      </View>
      <Carousel />
      <View style={styles.categories}>
        <View style={styles.categoriesHeader}>
          <Text style={styles.categoriesTitle}>Catégories</Text>
          <TouchableOpacity onPress={handleVoirToutPress} style={styles.categoriesAction}>
            <Text style={styles.categoriesActionText}>
              {showAllCategories ? 'Voir moins' : 'Voir tout'}
            </Text>
            <FeatherIcon color="#706F7B" name="chevron-right" size={16} />
          </TouchableOpacity>
        </View>
        <CategoryScreen categories={categories} showAllCategories={showAllCategories} navigation={navigation} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    paddingTop: Platform.OS === 'android' ? 0 : 0,
    backgroundColor: '#008e97',
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 10,
    marginTop: 10,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 38,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
  },
  categories: {
    marginTop: 20,
  },
  categoriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  categoriesTitle: {
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 28,
    color: '#323142',
  },
  categoriesAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  categoriesActionText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#706f7b',
    marginRight: 2,
  },
});

export default HomeScreen;
