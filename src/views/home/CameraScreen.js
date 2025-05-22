import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {launchCamera} from 'react-native-image-picker';

const CameraScreen = () => {
  const navigation = useNavigation();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true); // for showing "Opening camera..."

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera',
            buttonPositive: 'OK',
          },
        );
        console.log('Camera permission status:', granted);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };
  

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required.');
      navigation.goBack();
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        saveToPhotos: true,
        includeBase64: false,
      },
      response => {
        console.log('Camera Response:', response); // DEBUG LOG

        setLoading(false); // Stop "Opening camera..." state

        if (response.didCancel) {
          console.log('User cancelled camera');
          navigation.goBack();
        } else if (response.errorCode) {
          Alert.alert('Camera error', response.errorMessage);
          navigation.goBack();
        } else if (response.assets && response.assets.length > 0) {
          setPhoto(response.assets[0].uri);
        } else {
          Alert.alert('Error', 'Something went wrong.');
          navigation.goBack();
        }
      },
    );
  };

  useEffect(() => {
    openCamera();
  }, []);

  return (
    <View style={styles.container}>
      {photo ? (
        <>
          <Image source={{uri: photo}} style={styles.image} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </>
      ) : loading ? (
        <Text style={styles.text}>Opening camera...</Text>
      ) : (
        <Text style={styles.text}>No photo captured.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {fontSize: 16},
  button: {
    marginTop: 20,
    backgroundColor: '#38b6ff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  image: {width: 300, height: 400, borderRadius: 10, marginTop: 20},
});

export default CameraScreen;
