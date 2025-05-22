import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const onPressLearnMore = () => {
    navigation.navigate('GeoLocationScreen');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Travel Mate!</Text>
      <Button
        onPress={onPressLearnMore}
        title="Go to geoloaction page"
        // color="#841584"
        accessibilityLabel="Learn more about this purple button"
        style={styles.button}
      />

      <TouchableOpacity style={styles.buttoncamera}>
        <Button
          onPress={() => navigation.navigate('CameraScreen')}
          title="Open camera feature"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttoncamera}>
        <Button
          onPress={() => navigation.navigate('NotificationScreen')}
          title="Open Notification screen"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  buttoncamera: {
    marginTop: 20,
  },
});
