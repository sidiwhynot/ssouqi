import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';
import { decode as base64Decode } from 'base-64';
import { decode as decodeToken } from 'jwt-lite';




import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';

const PostScreen = ({ route , navigation }) => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [price, setPrice] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhoneNumber, setSellerPhoneNumber] = useState('');
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [categories, setCategories] = useState([]);
  const updateProductList = route.params?.updateProductList ?? (() => {});
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    // Vérifiez si l'utilisateur est connecté au chargement de la page
    checkUserAuthentication();
    fetchCategories();
  }, []);

  const checkUserAuthentication = async () => {
    try {
      const userToken = await AsyncStorage.getItem('authToken');
      console.log('Valeur du jeton dans checkUserAuthentication :', userToken);
  
      if (userToken) {
        console.log('Utilisateur connecté. Mise à jour du state.');
        setUser(userToken);
  
        // Ajouter ces lignes pour extraire l'ID de l'utilisateur du jeton
        const decodedToken = decodeToken(userToken);

        
        if (decodedToken && decodedToken.userId) {
          console.log('ID de l\'utilisateur extrait du jeton :', decodedToken.userId);
           // Assurez-vous que la clé "userId" est correctement stockée dans AsyncStorage
          await AsyncStorage.setItem("userId", decodedToken.userId);
        } else {
          console.error('Le jeton n\'est pas valide ou ne contient pas d\'ID utilisateur.');
          // Gérer l'erreur selon vos besoins
        }
      } else {
        console.log('Aucun utilisateur connecté. Le state user sera mis à null.');
        setUser(null);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification :', error);
    }
  };
  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(base64Decode(payload));
      return decoded;
    } catch (error) {
      console.error('Erreur lors du décodage du jeton :', error);
      return null;
    }
  };
  
  
  
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://192.168.1.50:8081/api/categories');
        console.log('Catégories récupérées depuis le backend :', response.data);
        setCategories(response.data); // Utiliser setCategories pour mettre à jour le state
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error.message);
    }
  }





  const handlePostProduct = async () => {
    const userToken = await AsyncStorage.getItem('authToken');
  
    console.log('Valeur de userToken:', userToken);
    if (userToken) {
    //  const decodedToken = JWT.decode(userToken);
    //  console.log('Décodage du jeton JWT :', decodedToken);
    //  const userId = decodedToken.userId;
    //  console.log('ID de l\'utilisateur extrait du jeton :', userId);

  
      // Continuez ici avec le reste de votre logique pour publier le produit
    } else {
      console.log('Aucun jeton JWT trouvé.');
  
      Alert.alert(
        'Alerte',
        'Vous devez être connecté pour publier un produit.',
        [
          { text: 'OK', onPress: () => console.log('Alerte fermée') }
        ],
        { cancelable: false }
      );
      return;
    }
  

    
    try {
      
      console.log('Entrée dans handlePostProduct');
  
      // Validation des champs
      if (!productName || !productDescription || !selectedCategory || !price || !sellerName || !sellerPhoneNumber || !imageUri) {
        alert('Veuillez remplir tous les champs avant de publier le produit.');
        return;
      }
  
      console.log('Validation des champs réussie');
  
      // Récupérer l'utilisateur actuel depuis le stockage local
      const userId = await AsyncStorage.getItem("userId");
  
      console.log('ID de l\'utilisateur :', userId);
  
      // Construire l'objet de données à envoyer au serveur
      const productData = {
        productName,
        productDescription,
        price,
        sellerName,
        sellerPhoneNumber,
        category: selectedCategory._id, // Utilisez _id de la catégorie
       categoryId: selectedCategory._id,
        image: imageUri,
        userId: userId,
      };
  
      console.log('Données du produit :', productData);
  
      // Effectuer une requête POST avec Axios
      const response = await axios.post('http://192.168.1.50:8081/api/products', productData, {
        timeout: 0,
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Vérifier la réponse du serveur
      if (response.status === 201) {
        console.log('Produit publié avec succès !');
  
        // Réinitialiser les champs après la publication réussie
        setProductName('');
        setProductDescription('');
        setPrice('');
        setSellerName('');
        setSellerPhoneNumber('');
        setSelectedCategory(null);
        setImageUri('');
  
        console.log('Affichage de l\'alerte');
  
        updateProductList();
        // Afficher une alerte
        Alert.alert(
          'Produit publié',
          'Votre produit a été publié avec succès.',
          [
            {
              text: 'OK',
              onPress: async () => {
                console.log('Alerte fermée');
  
                // Navigation vers la page d'accueil après avoir fermé l'alerte
                // navigation.navigate('CategoryScreen', { selectedCategory });
              },
            },
          ],
          { cancelable: false }
        );
  
      } else {
        console.error('Erreur lors de la publication du produit. Réponse du serveur :', response.data);
        // Gérer l'erreur selon vos besoins
      }
    } catch (error) {
      console.error('Erreur dans handlePostProduct :', error);
    }
  };
  
  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.assets && result.assets.length > 0) {
      console.log(result.assets[0].uri);  // Déboguer l'URI de l'image
      setImageUri(result.assets[0].uri);
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      key={item._id}
      style={[
        styles.categoryItem,
        selectedCategory === item._id && styles.categoryItemSelected, 
      ]}
      onPress={() => handleCategorySelection(item)}>
      <Text style={styles.categoryItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const handleCategorySelection = (category) => {
    console.log('Handling category selection. Category selected:', category.label);
    setSelectedCategory(category);
    setShowCategoryList(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Publier une Annonce</Text>

      {/* Composant de sélection d'image */}
      <TouchableOpacity onPress={handleImagePicker} style={styles.imagePickerButton}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.selectedImage} />
        ) : (
          <View style={styles.iconContainer}>
            <Icon name="plus-circle" size={50} color="white" />
          </View>
        )}
      </TouchableOpacity>

      {/* Champ de saisie pour le nom du produit */}
      <TextInput
        style={styles.input}
        placeholder="Nom du produit"
        value={productName}
        onChangeText={(text) => setProductName(text)}
      />

      {/* Liste déroulante pour la catégorie */}
      <TouchableOpacity
          style={styles.categoryPickerButton}
          onPress={() => setShowCategoryList(true)}>
          <Text style={styles.categoryPickerButtonText}>
            {selectedCategory ? selectedCategory.label : 'Sélectionnez une catégorie'}
          </Text>
     </TouchableOpacity>
      {/* Modal pour afficher la liste des catégories */}
          <Modal
      animationType="slide"
      transparent={true}
      visible={showCategoryList}
      onRequestClose={() => setShowCategoryList(false)}>
      <View style={styles.modalContainer}>
        <ScrollView style={styles.categoryList}>
          {categories.map((item) => (
            <TouchableOpacity
              key={item._id}
              activeOpacity={0.8}
              onPress={() => handleCategorySelection(item)}>
              <View
                style={[
                  styles.categoryItem,
                  selectedCategory && selectedCategory._id === item._id && styles.categoryItemSelected,
                ]}
              >
                <Image source={{ uri: `http://192.168.1.50:8081${item.image}` }} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>

      {/* Champ de saisie pour la description du produit */}
      <TextInput
        style={styles.input}
        placeholder="Description du produit"
        value={productDescription}
        onChangeText={(text) => setProductDescription(text)}
        multiline
      />

      {/* Champ de saisie pour le prix */}
      <TextInput
        style={styles.input}
        placeholder="Prix"
        value={price}
        onChangeText={(text) => setPrice(text)}
        keyboardType="numeric"
      />

      {/* Champ de saisie pour le nom du vendeur */}
      <TextInput
        style={styles.input}
        placeholder="Nom du vendeur"
        value={sellerName}
        onChangeText={(text) => setSellerName(text)}
      />

      {/* Champ de saisie pour le numéro de téléphone du vendeur */}
      <TextInput
        style={styles.input}
        placeholder="Numéro de téléphone du vendeur"
        value={sellerPhoneNumber}
        onChangeText={(text) => setSellerPhoneNumber(text)}
        keyboardType="phone-pad"
      />

      {/* Bouton pour publier le produit */}
      <TouchableOpacity onPress={handlePostProduct} style={styles.postButton}>
        <Text style={styles.postButtonText}>Publier le produit</Text>
      </TouchableOpacity>

    </ScrollView>
    );
 };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  categoryList: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  categoryItemSelected: {
    backgroundColor: '#008e97',
    color: 'white',
  },
  categoryItemText: {
    fontSize: 16,
  },
  categoryPickerButton: {
    backgroundColor: '#008e97',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryPickerButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  imagePickerButton: {
    backgroundColor: '#008e97',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    height: 150, // Ajuster la hauteur selon vos besoins
    overflow: 'hidden', // Pour éviter que l'image ne dépasse la hauteur spécifiée
    position: 'relative', // Ajouter cette propriété pour permettre le positionnement relatif
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    position: 'absolute',
    zIndex: 1,
  },
  postButton: {
    backgroundColor: '#008e97',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  postButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PostScreen;
