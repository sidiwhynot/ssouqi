import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, FlatList, ScrollView } from 'react-native';

const ProductDetailScreen = ({ route }) => {
  const { productName, image, price, productDescription, sellerName, sellerPhoneNumber } = route.params.product;

  const handleCallSeller = () => {
    if (sellerPhoneNumber) {
      Linking.openURL(`tel:${sellerPhoneNumber}`)
        .catch((error) => console.error('Erreur lors de l\'ouverture de l\'application téléphone', error));
    }
  };

  const productDetails = [
    { label: 'Nom :', value: productName },
    { label: 'Prix :', value: `RMU ${price}` },
    { label: 'Vendeur :', value: sellerName },
  ];

  return (
      <ScrollView style={styles.container}>
      <Image source={{ uri: image }} style={styles.productImage} />
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Nom :</Text>
          <Text style={styles.detailValue}>{productName}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Prix :</Text>
          <Text style={styles.detailValue}>{`RMU ${price}`}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Vendeur :</Text>
          <Text style={styles.detailValue}>{sellerName}</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Description :</Text>
          <Text style={styles.descriptionValue}>{productDescription}</Text>
        </View>
        {sellerPhoneNumber && (
          <TouchableOpacity onPress={handleCallSeller} style={styles.callSellerButton}>
            <Text style={styles.callSellerButtonText}>{`Contacter le vendeur: ${sellerPhoneNumber}`}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  productImage: {
    width: '100%',
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
  },
  detailsContainer: {
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
  },

  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  detailValue: {
    fontSize: 18,
    color: '#333',
  },
  descriptionContainer: {
    marginTop: 16,
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
  },
  descriptionValue: {
    fontSize: 16,
    color: '#333',
  },
  callSellerButton: {
    marginTop: 24,
    backgroundColor: '#008e97',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  callSellerButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;
