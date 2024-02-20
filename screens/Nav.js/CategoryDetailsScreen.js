// CategoryDetailsScreen.js
import React from 'react';
import { View, Text } from 'react-native';

const CategoryDetailsScreen = ({ route }) => {
  const { category } = route.params;

  return (
    <View>
      <Text>Catégorie sélectionnée: {category.label}</Text>
      {/* Afficher les détails de la catégorie et ses produits ici */}
    </View>
  );
};

export default CategoryDetailsScreen;
