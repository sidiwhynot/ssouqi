
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/Nav.js/HomeScreen';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from '../screens/Nav.js/ProfileScreen';
import PostScreen from '../screens/Nav.js/PostScreen';
import InformationScreen from '../screens/Nav.js/InformationScreen.js';
import ProductDetailScreen from '../screens/Nav.js/ProductDetailScreen.js';
import ProductListScreen from '../screens/Nav.js/ProductListScreen.js'
import { Platform } from 'react-native';
import UserProducts from '../screens/Nav.js/UserProductsScreen.js';
import HomeTabScreen from '../screens/Nav.js/HomeTabScreen';



const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

//function BottomTabs() {
   // return (
   //     <Tab.Navigator
  //      screenOptions={({ route }) => ({
   //         tabBarActiveTintColor: '#008e97',
   //         tabBarInactiveTintColor: 'black',
  //          tabBarLabelStyle: {
   //             fontSize: 14,
   //             fontWeight: 'bold',
               
   //         },
   //         tabBarStyle: {
    //            backgroundColor: 'white',
    //            borderTopColor: 'lightgray',
    //            paddingBottom: 13,
    //            ...Platform.select({
    //                ios: {
     //                   height: 60, // Ajustez la hauteur pour iOS si nécessaire
     //               },
     //               android: {
      //                  height: 60, // Ajoutez des styles spécifiques à Android si nécessaire
     //               },
     //           }),
     //       },
      //      tabBarIcon: ({ focused, color, size }) => {
      //          let iconName;

        //        if (route.name === 'Accueil') {
        //            iconName = 'home';
        //        } else if (route.name === 'Annonce') {
       //             iconName = 'add-circle-outline';
        //        } else if (route.name === 'Profil') {
       //             iconName = 'person-outline';
        //        }

       //         return <Ionicons name={iconName} size={size - 2} color={color} style={{ marginBottom: focused ? -3 : 0 }} />;
      //      },
     //   })}
    //>
       // <Tab.Screen
       //     name="Accueil"
       //     component={HomeScreen}
       //     options={{ tabBarLabel: 'Accueil' }}
      //  />
      //  <Tab.Screen
     //       name="Annonce"
      //      component={PostScreen}
     //       options={{ tabBarLabel: 'Annonce' }}
    //    />
    //    <Tab.Screen
    //        name="Profil"
    //        component={ProfileScreen}
     //       options={{ tabBarLabel: 'Profil' }}
     //   />
   // </Tab.Navigator>
   // );
//}

//const StackNavigator = () => {
 //   const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

 //  useEffect(() => {
 //      const checkLoginStatus = async () => {
 //           try {
 //              const token = await AsyncStorage.getItem("authToken");
 //               setIsUserLoggedIn(!!token);
  //          } catch (err) {
   //             console.log("Error while checking login status:", err);
   //         }
  //      };

  //      checkLoginStatus();
  //  }, []);

    return (
        <NavigationContainer>
 //<Stack.Navigator
  //initialRouteName={isUserLoggedIn ? "HomeTabScreen" : "Login"}
  //  screenOptions={{
   //     headerTitle: null, // Masque le titre de l'en-tête pour tous les écrans
   //     headerStyle: {
   //         backgroundColor: '#3498db',
   //     },
   //     headerTintColor: '#fff',
   //     headerTitleStyle: {
  //          fontWeight: 'bold',
 //       },
  //  }}
>
                <Stack.Screen name="HomeTabScreen" component={HomeTabScreen} options={{headerTitle: null }} />

                <Stack.Screen name="home" component={HomeScreen} options={{ headerTitle: null, headerShown: false }} />

                <Stack.Screen name="login" component={LoginScreen} />
                <Stack.Screen name="Information" component={InformationScreen} />
                <Stack.Screen name="register" component={RegisterScreen} />
                <Stack.Screen name="forgotPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
                <Stack.Screen name="ProductListScreen" component={ProductListScreen} />
                <Stack.Screen name="UserProducts" component={UserProducts} />

              


        //    </Stack.Navigator>
        </NavigationContainer>
    );
//};

export default StackNavigator;



