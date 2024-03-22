import React, { useState } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image,  } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


  const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  
  const handleRegister = () => {
    // Ajoutez des validations côté client
    if (!name || !email || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
  

    setError(null);
  
    const user = {
      name: name,
      email: email,
      password: password,
    };
    
    axios
      .post("http://192.168.1.134:8081/register", user, { timeout: 10000 })
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Inscription réussie",
          "Vous avez été enregistré avec succès"
        );

        navigation.navigate('login');

        setName("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        if (error.response) {
          // Erreur avec réponse du serveur
          console.error("Erreur du serveur:", error.response.data);
          Alert.alert("Erreur d'inscription", "Une erreur s'est produite lors de l'inscription");
        } else if (error.request) {
          // Requête a été faite mais pas de réponse reçue
          console.error("Pas de réponse du serveur:", error.request);
          Alert.alert("Erreur d'inscription", "Aucune réponse du serveur");
        } else {
          // Erreur pendant la configuration de la requête
          console.error("Erreur pendant la configuration de la requête:", error.message);
          Alert.alert("Erreur d'inscription", "Une erreur s'est produite lors de l'inscription");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  

  const handleGoogleSignUp = () => {
    // Ajoutez la logique pour l'inscription avec Google ici
    console.log('Inscription avec Google');
  };

  const handleFacebookSignUp = () => {
    // Ajoutez la logique pour l'inscription avec Facebook ici
    console.log('Inscription avec Facebook');
  };

  return (
    
    <View style={styles.container}>
      <Image source={require('../assets/logo/logo.jpeg')} style={styles.logo} />
      <Text style={styles.title}>Inscription</Text>
      <View style={styles.inputContainer}>
        <Feather name="user" size={20} color="#757575" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nom utilisateur"
          placeholderTextColor="#757575"
          onChangeText={(text) => setName(text)}
          value={name}
        />
      </View>
      <Text style={styles.errorText}>{usernameError}</Text>

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
      <Text style={styles.errorText}>{emailError}</Text>

      <View style={styles.inputContainer}>
        <Feather name="lock" size={20} color="#757575" style={styles.icon} />
        <TextInput
          style={styles.input}
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
      <Text style={styles.errorText}>{passwordError}</Text>
      <View style={styles.inputContainer}>
        <Feather name="lock" size={20} color="#757575" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirmer le mot de passe"
          placeholderTextColor="#757575"
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordVisibilityButton}>
          <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#757575" />
        </TouchableOpacity>
      </View>
      <Text style={styles.errorText}>{confirmPasswordError}</Text>
      {error !== '' && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity style={styles.signupButton} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.signupText}>S'inscrire</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.orText}>Ou inscrivez-vous avec</Text>
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity onPress={handleGoogleSignUp} style={styles.socialButton}>
          <FontAwesome name="google" size={20} color="#4285F4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFacebookSignUp} style={styles.socialButton}>
          <FontAwesome name="facebook" size={20} color="#3b5998" />
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    marginBottom: 32,
    color: '#333333',
  },
  logo: {
    width: 200,
    height: 150,
    marginTop: 5,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  passwordVisibilityButton: {
    padding: 8,
  },
  signupButton: {
    backgroundColor: '#2ecc71',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  signupText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 10,
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
});

export default RegisterScreen;