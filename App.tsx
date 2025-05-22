import React, {createContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StartupScreen from './src/views/auth/StartupScreen';
import LoginScreen from './src/views/auth/LoginScreen';
import HomeScreen from './src/views/home/HomeScreen';
import GeoLocationScreen from './src/views/home/GeoLocationScreen';
import CameraScreen from './src/views/home/CameraScreen';
import messaging from '@react-native-firebase/messaging';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import NotificationScreen from './src/views/home/NotificationScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

// Context to share notifications globally
export const NotificationContext = createContext();


export default function App() {
  const [notifications, setNotifications] = useState([]);
  console.log("notifications list===", notifications)
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission status:', authStatus);
      getFcmToken();
    } else {
      Alert.alert('Push Notification permission denied');
    }

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }
  };
  const getFcmToken = async () => {
    try {
      const fcmToken = await messaging().getToken();

      if (fcmToken) {
        console.log('Fcm Token', fcmToken);
      } else {
        console.log('Failed to get Fcm token');
      }
    } catch (error) {
      console.error('Error fetching FCM token:', error);
    }
  };

  // Load saved notifications on app start
  const loadNotifications = async () => {
    try {
      const saved = await AsyncStorage.getItem('notifications');
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    } catch (e) {
      console.log('Error loading notifications:', e);
    }
  };

  // Save updated notifications to storage
  const saveNotifications = async updated => {
    try {
      await AsyncStorage.setItem('notifications', JSON.stringify(updated));
    } catch (e) {
      console.log('Error saving notifications:', e);
    }
  };

  useEffect(() => {
    requestUserPermission();
    loadNotifications();
  
    // Foreground notification
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const newNotification = {
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        time: new Date().toLocaleTimeString(),
      };
  
      const updated = [newNotification, ...notifications];
      setNotifications(updated);
      saveNotifications(updated);
    });
  
    // Background to foreground
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage?.notification) {
        const newNotification = {
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          time: new Date().toLocaleTimeString(),
        };
  
        setNotifications(prev => {
          const updated = [newNotification, ...prev];
          saveNotifications(updated);
          return updated;
        });
      }
    });
  
    // App completely closed and opened by notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.notification) {
          const newNotification = {
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            time: new Date().toLocaleTimeString(),
          };
  
          setNotifications(prev => {
            const updated = [newNotification, ...prev];
            saveNotifications(updated);
            return updated;
          });
        }
      });
  
    return unsubscribe;
  }, []);
  
  return (
    <NotificationContext.Provider value={{notifications, setNotifications}}>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Startup"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Startup" component={StartupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="GeoLocationScreen" component={GeoLocationScreen} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </NotificationContext.Provider>
  );
}
