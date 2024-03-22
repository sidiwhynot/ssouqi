import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

  const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          navigation.replace("home");
        }
      } catch (err) {
        console.log("error message", err);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };

    setLoading(true);

    axios
    .post("http://192.168.1.134:8081/login", user)
    .then((response) => {
      console.log(response);
      const token = response.data.token;
      AsyncStorage.setItem("authToken", token);
      navigation.replace("home");
    })
    .catch((error) => {
      console.log("Erreur de requête :", error.response);
      // Autres actions en cas d'erreur
      if (error.response) {
        // La requête a été effectuée, mais le serveur a répondu avec un code d'erreur
        console.log("Statut de la réponse du serveur :", error.response.status);
        console.log("Données de la réponse du serveur :", error.response.data);
      } else if (error.request) {
        // La requête a été effectuée, mais aucune réponse n'a été reçue
        console.log("Aucune réponse reçue du serveur");
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.log("Erreur de configuration de la requête :", error.message);
      }
      console.log("Erreur complète :", error);
      // Affichez l'alerte appropriée ou effectuez d'autres actions en conséquence
      Alert.alert("Erreur de connexion", "Une erreur s'est produite lors de la connexion.");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const handleForgotPassword = () => {
    navigation.navigate('forgotPassword');
  };

  const handleSignUp = () => {
    navigation.navigate('register');
  };

  const handleGoogleLogin = () => {
    console.log('Connexion avec Google');
  };

  const handleFacebookLogin = () => {logilo
    console.log('Connexion avec Facebook');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo/logo.jpeg')} style={styles.logo} />
      <Text style={styles.title}>Connectez-vous</Text>
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Feather name="mail" size={20} color="#757575" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#757575"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
        </View>
        <View style={styles.passwordContainer}>
          <Feather name="lock" size={20} color="#757575" style={styles.icon} />
          <TextInput
            style={styles.passwordInput}
            placeholder="Mot de passe"
            placeholderTextColor="#757575"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordVisibilityButton}>
            <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#757575" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
        {error !== '' && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.loginButtonText}>Se connecter</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignUp} style={styles.signupButton}>
          <Text style={styles.signupText}>Pas encore de compte ? S'inscrire</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>Ou connectez-vous avec</Text>
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity onPress={handleGoogleLogin} style={styles.socialButton}>
            <FontAwesome name="google" size={20} color="#4285F4" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFacebookLogin} style={styles.socialButton}>
            <FontAwesome name="facebook" size={20} color="#3b5998" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 200,
    height: 150,
    marginTop: 10,
    marginBottom: 50,
  },
  content: {
    width: '100%',
  },
  title: {
    
    fontSize: 24,
    marginBottom: 32,
    color: '#333333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderColor: '#BDBDBD',
    borderWidth: 2,
    borderRadius: 5,
    overflow: 'hidden',
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 8,
    color: '#333333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderColor: '#BDBDBD',
    borderWidth: 2,
    borderRadius: 5,
    overflow: 'hidden',
  },
  passwordInput: {
    flex: 1,
    height: 40,
    padding: 8,
    color: '#333333',
  },
  passwordVisibilityButton: {
    padding: 8,
  },
  loginButton: {
    backgroundColor: '#2ecc71',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#3498db',
    textDecorationLine: 'underline',
  },
  signupButton: {
    alignItems: 'flex-start',
    marginTop: 10,
  },
  signupText: {
    color: '#2ecc71',
    textDecorationLine: 'underline',
  },
  orText: {
    color: '#757575',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 5,
    margin: 8,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    alignItems: 'center',
    width: 60,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
});

export default LoginScreen;