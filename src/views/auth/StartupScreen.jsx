import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function StartupScreen() {
    const navigation= useNavigation()
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Login');
    }, 2000); // 2 seconds splash
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/svg/logo.jpg')} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
  },
});
