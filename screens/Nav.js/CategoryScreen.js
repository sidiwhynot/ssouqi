import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import axios from 'axios';

class CategoryScreen extends PureComponent {
  state = {
    selectedCategoryIndex: null,
    categories: [],
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchCategories();
  
    // Ajouter un écouteur focus pour mettre à jour les catégories lorsque le composant obtient le focus
    this.focusListener = this.props.navigation.addListener('focus', () => {
      const updatedProducts = this.props.route?.params?.updatedProducts;
      if (updatedProducts) {
        this.fetchCategories();
      }
    });
  }
  componentWillUnmount() {
    // Nettoyer l'écouteur focus lorsque le composant est démonté
    if (this.focusListener) {
      this.focusListener();
    }
  }

  fetchCategories = () => {
    console.log('Fetching categories...');
    axios.get('http://192.168.1.50:8081/api/categories')
      .then(response => {
        console.log('Categories received:', response.data);
        this.setState(prevState => ({
          categories: response.data,
          loading: false,
          error: null,
        }));
      })
      .catch(error => {
        console.error('Error fetching categories:', error.message);
        console.error('Error details:', error.response); // Affichez les détails de l'erreur
        this.setState({ error: 'Error fetching categories', loading: false });
      });
  };
  
  

  handleCategoryPress = (index) => {
    const { navigation } = this.props;
    const { categories } = this.state;
  
    if (index >= 0 && index < categories.length) {
      console.log('Navigating to ProductListScreen with category:', categories[index]);
      navigation.navigate('ProductListScreen', { selectedCategory: categories[index] });
    } else {
      console.warn('Invalid category index:', index);
    }
  };
  
  


  handleProductPress = (product) => {
    console.log('Product selected:', product);
  };

  renderProductItem = ({ item, index }) => (
    <TouchableOpacity
      key={index}  
      activeOpacity={0.8}
      onPress={() => this.handleProductPress(item)}>
      <View style={styles.productItem}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <Text style={styles.productText}>{item.label}</Text>
        {console.log('Product item:', item)}
      </View>
    </TouchableOpacity>
  );
  

  render() {
    const { showAllCategories } = this.props;
    const { selectedCategoryIndex, categories, loading, error } = this.state;
  
    console.log('Render method called.');
  
    console.log('Categories:', categories);
    console.log('Selected Category Index:', selectedCategoryIndex);
  
    if (loading) {
      return <Text>Loading...</Text>;
    }
  
    if (error) {
      return <Text>Error: {error}</Text>;
    }
  
    const displayedCategories = showAllCategories ? categories : categories.slice(0, 8);
    const selectedCategory = selectedCategoryIndex !== null ? displayedCategories[selectedCategoryIndex] : null;
  
    console.log('Selected Category:', selectedCategory);
    console.log('End of render method.');
  
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          <View style={styles.categoryListContainer}>
            <FlatList
              data={displayedCategories}
              numColumns={4}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => this.handleCategoryPress(index)}>
                  <View
                    key={item._id + index}
                    style={[
                      styles.categoryItem,
                      selectedCategoryIndex === index && styles.categoryItemSelected,
                    ]}
                  >
                    <Image source={{ uri: `http://192.168.1.50:8081${item.image}` }} style={styles.categoryImage} />
                    <Text style={styles.categoryText}>{item.label}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => item._id + index.toString()}
            />
          </View>
          {selectedCategory && (
            <View style={styles.productListContainer}>
              <FlatList
                data={selectedCategory.products}
                numColumns={2}
                renderItem={this.renderProductItem}
                keyExtractor={(product, index) => index.toString()}
              />
            </View>
          )}
        </View>
      </ScrollView>
    );    
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 5,
  },
  categoryItem: {
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    margin: 5,
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryImage: {
    width: 70,
    height: 70,
    borderRadius: 40,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 8,
    color: 'black',
  },
  categoryItemSelected: {
    borderColor: '#008e97',
    borderWidth: 2,
  },
  productItem: {
    // Styles spécifiques au produit
    alignItems: 'center',
    margin: 8,
  },
  productImage: {
    // Styles spécifiques au produit
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  productText: {
    // Styles spécifiques au produit
    marginTop: 8,
    color: 'black',
  },
});

export default CategoryScreen;
