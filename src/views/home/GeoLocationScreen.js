import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const GeoLocationScreen = () => {
  const [region, setRegion] = useState(null);
  //Enable billing issues so not show current address not found beacuase enable blling issue on google otherwise map its working and integrate this.
  const [address, setAddress] = useState('');

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return;
        }
      }

      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const location = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setRegion(location);
          getAddressFromCoords(latitude, longitude); // 🔄 address fetch
        },
        error => {
          console.log(error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };

    requestLocationPermission();
  }, []);

  // 🔄 Get address from coordinates using Google Maps API
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const apiKey = 'AIzaSyAMly5aaO7PYOSHs3Saib2ZAw0PyXr51f4'; // 🔑 Replace with your key
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
      );
      const data = await response.json();

      if (data.status === 'OK') {
        const formattedAddress = data.results[0].formatted_address;
        setAddress(formattedAddress);
      } else {
        setAddress('No address found');
      }
    } catch (error) {
      console.log(error);
      setAddress('Failed to get address');
    }
  };

  const zoomIn = () => {
    if (!region) return;
    setRegion(prev => ({
      ...prev,
      latitudeDelta: prev.latitudeDelta / 2,
      longitudeDelta: prev.longitudeDelta / 2,
    }));
  };

  const zoomOut = () => {
    if (!region) return;
    setRegion(prev => ({
      ...prev,
      latitudeDelta: prev.latitudeDelta * 2,
      longitudeDelta: prev.longitudeDelta * 2,
    }));
  };

  return (
    <View style={styles.container}>
      {region ? (
        <>
          <View style={styles.map}>
            <MapView
              style={StyleSheet.absoluteFillObject}
              region={region}
              showsUserLocation={true}
              showsMyLocationButton={true}>
              <Marker
                coordinate={region}
                title="You are here"
                description={address}
              />
            </MapView>
          </View>

          <Text style={styles.addressText}>{address}</Text>

          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
              <Text style={styles.zoomText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
              <Text style={styles.zoomText}>-</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.loadingText}>Getting location...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  loadingText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
  },
  zoomControls: {
    position: 'absolute',
    right: 10,
    bottom: 400,
    flexDirection: 'column',
    gap: 10,
  },
  zoomButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    elevation: 5,
  },
  zoomText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: 500,
  },
  addressText: {
    textAlign: 'center',
    padding: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default GeoLocationScreen;
