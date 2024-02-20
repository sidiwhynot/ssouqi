import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';  // Importez le hook useNavigation


const InformationScreen = () => {
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [user, setUser] = useState(null);

    const navigation = useNavigation();  // Utilisez useNavigation pour obtenir la propriété navigation

    useEffect(() => {
        const fetchAuthenticatedUser = async () => {
            try {
                const authToken = await AsyncStorage.getItem('authToken');
                const response = await axios.get('http://192.168.1.50:8081/api/user', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    setUser(response.data);
                    setNewName(response.data.name);
                    setNewEmail(response.data.email);
                } else {
                    console.error('Erreur lors de la récupération des données utilisateur');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur :', error);
            }
        };

        fetchAuthenticatedUser();
    }, []);

    const handleUpdateInformation = async () => {
        try {
            const authToken = await AsyncStorage.getItem('authToken');

            const response = await axios.put(
                'http://192.168.1.50:8081/api/user',
                {
                    newName,
                    newEmail,
                    newPassword,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Réponse du serveur :', response.data);
            // Afficher une alerte de succès
            Alert.alert('Succès', 'Informations mises à jour avec succès.', [
                {
                    text: 'OK',
                    onPress: () => {
                        // Rediriger vers le ProfileScreen après avoir appuyé sur OK
                        navigation.navigate('home');
                    },
                },
            ]);
        } catch (error) {
            console.error('Erreur lors de la mise à jour des informations :', error);
            if (error.response) {
                console.log('Détails de l\'erreur Axios :', error.response);
            } else {
                console.log('Erreur Axios sans réponse :', error.message);
            }
        }
    };



    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/logo/logo.jpeg')}
                style={styles.logo}
            />
            <Text style={styles.title}>Modifier les informations</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Nom actuel:</Text>
                <Text style={styles.infoText}>{user?.name}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Email actuel:</Text>
                <Text style={styles.infoText}>{user?.email}</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Nouveau nom"
                value={newName}
                onChangeText={(text) => setNewName(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Nouvel email"
                value={newEmail}
                onChangeText={(text) => setNewEmail(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Nouveau mot de passe"
                secureTextEntry
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateInformation}>
                <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
            </TouchableOpacity>
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
        marginTop: 5,
        marginBottom: 5,
    },
    title: {
        fontSize: 24,
        marginBottom: 32,
        color: '#333333',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: '#757575',
        marginRight: 8,
    },
    infoText: {
        fontSize: 16,
        color: '#333333',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#BDBDBD',
        borderWidth: 2,
        borderRadius: 5,
        padding: 8,
        marginBottom: 16,
    },
    saveButton: {
        backgroundColor: '#2ecc71',
        padding: 12,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default InformationScreen;
