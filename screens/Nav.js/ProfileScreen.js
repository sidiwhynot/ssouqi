
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Switch,
    SafeAreaView,
    Image,
    Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FeatherIcon from 'react-native-vector-icons/Feather';


const SECTIONS = [
    {
        header: 'Préférences',
        items: [
            { icon: 'info', label: 'information', type: 'link' },
            { icon: 'Produits', label: 'Vos Produits', type: 'link' },
            { icon: 'globe', label: 'Langue', value: 'Anglais', type: 'input' },
            { icon: 'moon', label: 'Mode sombre', value: false, type: 'boolean' },
        ],
    },
    {
        header: 'Aide',
        items: [
            { icon: 'flag', label: 'Signaler un bug', type: 'link' },
            { icon: 'mail', label: 'Contactez-nous', type: 'link' },
        ],
    },
];

const ProfileScreen = ({ navigation }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchAuthenticatedUser = async () => {
            try {
                const authToken = await AsyncStorage.getItem('authToken');
    
                // Ajoutez une condition pour effectuer la requête uniquement si l'utilisateur est connecté
                if (authToken) {
                    const response = await axios.get('http://192.168.1.134:8081/api/user', {
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
    
                    if (response.status === 200) {
                        const userData = response.data;
                        setUser(userData);
                        setName(userData.name);
                        setEmail(userData.email);
                    } else {
                        console.error('Erreur lors de la récupération des données utilisateur');
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur :', error);
            }
        };
    
        fetchAuthenticatedUser();
    }, []);
    
    


    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('authToken');
            navigation.reset({
                index: 0,
                routes: [{ name: 'home' }],
            });
        } catch (error) {
            console.error('Erreur lors de la déconnexion :', error);
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <SafeAreaView style={[styles.container, darkMode && styles.darkContainer]}>
            {/* Afficher le composant avec les informations de base */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>Compte</Text>
                </View>
                <View style={styles.profile}>
                    <Image
                        alt=""
                        source={{
                            uri: 'https://static.vecteezy.com/system/resources/thumbnails/002/387/693/small/user-profile-icon-free-vector.jpg',
                        }}
                        style={styles.profileAvatar}
                    />
                    <View style={styles.profileBody}>
                        {/* Afficher les informations de l'utilisateur s'il est connecté */}
                        {user ? (
                            <>
                                <Text style={styles.profileName}>Nom: {user.name}</Text>
                                <Text style={styles.profileHandle}>Email: {user.email}</Text>
                            </>
                        ) : (
                            // Afficher des informations par défaut si l'utilisateur n'est pas connecté
                            <>
                                <Text style={styles.profileName}>Nom: exemple </Text>
                                <Text style={styles.profileHandle}>Email: exemple@gmail.com</Text>
                            </>
                        )}
                    </View>
                </View>
            </View>




            {SECTIONS.map(({ header, items }) => (
                <View style={styles.section} key={header}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>{header}</Text>
                    </View>
                    <View style={styles.sectionBody}>
                        {items.map(({ label, type, value }, index) => {
                            // Vérifier si l'utilisateur est connecté et si l'élément est "information"
                            if (!user && type === 'link' && label === 'information') {
                                return null; // Ne pas rendre l'élément si l'utilisateur n'est pas connecté
                            }

                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        if (type === 'boolean' && label === 'Mode sombre') {
                                            toggleDarkMode();
                                        } else if (type === 'link' && label === 'information') {
                                            navigation.navigate('Information');
                                        } else if (type === 'link' && label === 'Vos Produits') {
                                            navigation.navigate('UserProducts');
                                        } else {
                                            // Gérer d'autres actions si nécessaire
                                        }
                                    }}>
                                    <View
                                        style={[
                                            styles.row,
                                            index === 0 && styles.rowFirst,
                                            index === items.length - 1 && styles.rowLast,
                                        ]}>
                                        <Text style={styles.rowLabel}>{label}</Text>
                                        <View style={styles.rowSpacer} />
                                        {type === 'input' && (
                                            <Text style={styles.rowValue}>{value}</Text>
                                        )}
                                        {type === 'boolean' && (
                                            <Switch value={darkMode} onValueChange={toggleDarkMode} />
                                        )}
                                        {(type === 'input' || type === 'link') && (
                                            <FeatherIcon
                                                color="#ababab"
                                                name="chevron-right"
                                                size={22}
                                            />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            ))}
            
            {/* Boutons de connexion et d'inscription si l'utilisateur n'est pas connecté */}
                        {/* Boutons de connexion et d'inscription si l'utilisateur n'est pas connecté */}
                        {!user && (
                            <View style={styles.authLinks}>
                                <TouchableOpacity
                                    style={styles.authLinkButton}
                                    onPress={() => navigation.navigate('login')}>
                                    <Text style={styles.authLinkText}>Se connecter</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.authLinkButton}
                                    onPress={() => navigation.navigate('register')}>
                                    <Text style={styles.authLinkText}>S'inscrire</Text>
                                    
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Bouton de déconnexion si l'utilisateur est connecté */}
                        {user && (
                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={handleLogout}>
                                <Text style={styles.logoutButtonText}>Se déconnecter</Text>
                            </TouchableOpacity>
                        )}
                    </SafeAreaView>
                    );
        };

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f8f8f8',
        flex: 1,
    },
    darkContainer: {
        backgroundColor: '#333',
    },
    section: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    sectionHeader: {
        padding: 8,
        paddingLeft: 12,
    },
    sectionHeaderText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#adadad',
        textTransform: 'uppercase',
    },
    sectionBody: {
        borderRadius: 12,
        shadowColor: 'rgba(0,0,0,0.25)',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    profile: {
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    profileAvatar: {
        width: 60,
        height: 60,
        borderRadius: 9999,
        marginRight: 12,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#292929',
    },
    profileHandle: {
        marginTop: 2,
        fontSize: 16,
        fontWeight: '400',
        color: '#858585',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 12,
        paddingRight: 12,
        paddingBottom: 12,
        paddingLeft: 0,
    },
    rowFirst: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    rowLast: {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    rowLabel: {
        fontSize: 17,
        color: '#000',
    },
    rowValue: {
        fontSize: 17,
        color: '#ababab',
    },
    rowSpacer: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    authLinks: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20,
    },
    authLinkButton: {
        backgroundColor: '#2ecc71',
        padding: 12,
        borderRadius: 5,
        width: '98%',
        alignItems: 'center',
        marginTop: 16,
    },
    authLinkText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#e74c3c',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButtonText:{
        color: '#ffffff',
        fontWeight: 'bold',
    }
});
export default ProfileScreen;
