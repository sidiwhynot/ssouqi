import React, { useRef } from 'react';
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import HomeScreen from './HomeScreen'
import PostScreen from './PostScreen';
import NotificationScreen from './NotificationScreen';
import SearchScreen from './SearchScreen';
import ProfileScreen from './ProfileScreen';

// Plus...
import plus from '../../assets/plus.png';

const getWidth = () => {
  let width = Dimensions.get("window").width;
  width = width - 80;
  return width / 5;
};

const Tab = createBottomTabNavigator();

const HomeTabScreen = () => {
  const tabOffsetValue = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const handleActionButtonPress = () => {
    // Utilisez la navigation pour aller vers PostScreen
    // Vous pouvez spécifier d'autres paramètres ou options ici si nécessaire
    navigation.navigate('PostScreen');
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          showLabel: false,
          style: {
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 40,
            marginHorizontal: 20,
            height: 60,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowOffset: {
              width: 10,
              height: 10
            },
            paddingHorizontal: 20,
          }
        }}
      >
        <Tab.Screen
          name={"HomeScreen"}
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ position: 'absolute', top: 20 }}>
                <FontAwesome5
                  name="home"
                  size={20}
                  color={focused ? '#228B22' : 'gray'}
                ></FontAwesome5>
              </View>
            ),
            tabBarLabel: '',
          }}
          listeners={({ navigation, route }) => ({
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: 0,
                useNativeDriver: true
              }).start();
            }
          })}
        ></Tab.Screen>

        <Tab.Screen
          name={"Search"}
          component={SearchScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ position: 'absolute', top: 20 }}>
                <FontAwesome5
                  name="search"
                  size={20}
                  color={focused ? '#228B22' : 'gray'}
                ></FontAwesome5>
              </View>
            ),
            tabBarLabel: '',
          }}
          listeners={({ navigation, route }) => ({
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth(),
                useNativeDriver: true
              }).start();
            }
          })}
        ></Tab.Screen>

        <Tab.Screen
          name={"PostScreen"}
          component={PostScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TouchableOpacity onPress={() => handleActionButtonPress()}>
                <View style={{
                  width: 55,
                  height: 55,
                  backgroundColor: 'red',
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: Platform.OS == "android" ? 50 : 30
                }}>
                  <Image
                    source={plus}
                    style={{
                      width: 22,
                      height: 22,
                      tintColor: 'white',
                    }}
                  />
                </View>
              </TouchableOpacity>
            ),
            tabBarLabel: '',
          }}
        ></Tab.Screen>

        <Tab.Screen
          name={"Notifications"}
          component={NotificationScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ position: 'absolute', top: 20 }}>
                <FontAwesome5
                  name="bell"
                  size={20}
                  color={focused ? '#228B22' : 'gray'}
                ></FontAwesome5>
              </View>
            ),
            tabBarLabel: '',
          }}
          listeners={({ navigation, route }) => ({
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 3,
                useNativeDriver: true
              }).start();
            }
          })}
        ></Tab.Screen>

        <Tab.Screen
          name={"ProfileScreen"}
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ position: 'absolute', top: 20 }}>
                <FontAwesome5
                  name="user-alt"
                  size={20}
                  color={focused ? '#228B22' : 'gray'}
                ></FontAwesome5>
              </View>
            ),
            tabBarLabel: '',
          }}
          listeners={({ navigation, route }) => ({
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 4,
                useNativeDriver: true
              }).start();
            }
          })}
        ></Tab.Screen>
      </Tab.Navigator>

      <Animated.View
        style={{
          width: getWidth() - 20,
          height: 2,
          backgroundColor: 'red',
          position: 'absolute',
          bottom: 98,
          left: 50,
          borderRadius: 20,
          transform: [
            { translateX: tabOffsetValue }
          ]
        }}
      ></Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeTabScreen;
