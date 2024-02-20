// Importations nécessaires depuis React et React Native
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

// Fonction principale de l'écran d'accueil
const NotificationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur l'écran  NotificationScreen</Text>
     
    </View>
  );
}

// Styles pour la mise en forme de l'écran d'accueil
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default NotificationScreen;
