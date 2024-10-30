import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform, PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // ใช้ Google Maps API Key ของคุณ

const MapDirection = ({ route }) => {
  const { location } = route.params; // รับพิกัดปลายทางจาก route params
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to provide navigation features.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission denied');
          return;
        }
      }

      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ latitude, longitude });
        },
        error => console.log('Error getting location:', error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    requestLocationPermission();
  }, []);

  if (!currentPosition) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Getting current location...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }}
    >
      <Marker
        coordinate={currentPosition}
        title="My Location"
      />

      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        title={location.name}
        description={location.address}
      />

      <MapViewDirections
        origin={currentPosition}
        destination={{ latitude: location.latitude, longitude: location.longitude }}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={5}
        strokeColor="blue"
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapDirection;
