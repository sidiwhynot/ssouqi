// Importation des modules nécessaires depuis React et React Native
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';

// Définition du composant ForgotPasswordScreen avec les fonctionnalités de récupération de mot de passe oublié
const ForgotPasswordScreen = ({ navigation }) => {
    // États pour gérer les valeurs du champ email, le chargement, les erreurs et le statut de réinitialisation
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resetSent, setResetSent] = useState(false);

    // Fonction pour gérer le processus de récupération du mot de passe oublié
    const handleForgotPassword = () => {
        setLoading(true);

        // Ajoutez la logique pour envoyer un e-mail de réinitialisation du mot de passe ici

        // Exemple de logique simulée
        setTimeout(() => {
            setLoading(false);
            setResetSent(true);
        }, 2000);
    };

    // Rendu du composant avec la structure, les styles et les fonctionnalités associées
    return (
        <View style={styles.container}>
            {/* Logo de l'application */}
            <Image source={require('../assets/logo/logo.jpeg')} style={styles.logo} />
            {/* Titre de la page */}
            <Text style={styles.title}>Mot de passe oublié</Text>
            {/* Condition pour afficher le formulaire de récupération ou le succès de la réinitialisation */}
            {!resetSent ? (
                <>
                    {/* Description et champ de saisie de l'e-mail */}
                    <Text style={styles.description}>
                        Entrez votre adresse e-mail pour recevoir un lien de réinitialisation du mot de passe.
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#757575"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                    />
                    {/* Affichage de l'erreur, le cas échéant */}
                    {error !== '' && <Text style={styles.errorText}>{error}</Text>}
                    {/* Bouton pour déclencher la récupération du mot de passe */}
                    <TouchableOpacity style={styles.resetButton} onPress={handleForgotPassword} disabled={loading}>
                        {loading ? <ActivityIndicator size="small" color="#ffffff" /> : <Text style={styles.resetText}>Réinitialiser le mot de passe</Text>}
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    {/* Affichage du succès de la réinitialisation et bouton pour retourner à la page de connexion */}
                    <Text style={styles.successText}>Un e-mail de réinitialisation du mot de passe a été envoyé à {email}.</Text>
                    <TouchableOpacity style={styles.backToLoginButton} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.backToLoginText}>Retour à la page de connexion</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    logo: {
        width: 200,
        height: 150,
        marginTop: 32,
        marginBottom: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        color: '#333333',
    },
    description: {
        fontSize: 16,
        marginBottom: 16,
        color: '#757575',
    },
    input: {
        height: 40,
        borderColor: '#BDBDBD',
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        width: '100%',
        color: '#333333',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 14,
        marginBottom: 16,
    },
    resetButton: {
        backgroundColor: '#2ecc71',
        padding: 12,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginTop: 16,
    },
    resetText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    successText: {
        fontSize: 16,
        color: '#2ecc71',
        textAlign: 'center',
    },
    backToLoginButton: {
        marginTop: 16,
    },
    backToLoginText: {
        color: '#3498db',
        textDecorationLine: 'underline',
    },
});

export default ForgotPasswordScreen;
