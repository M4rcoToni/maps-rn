import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy
} from 'expo-location';
import { styles } from './styles';

export function Home() {
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<LocationObject | null>(null);
  async function requestLocalPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentLocation = await getCurrentPositionAsync();
      setLocation(currentLocation);
      console.log("Localização", currentLocation);

    }
  }

  useEffect(() => {
    requestLocalPermissions();
  }, []);

  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 5000,
      distanceInterval: 1,
    }, (reponse) => {
      console.log("nova Localização", reponse);
      setLocation(reponse);
      mapRef.current?.animateCamera({
        pitch: 50,
        center: reponse.coords
      })
    })
  }, []);

  return (
    <View style={styles.container}>

      {
        location &&

        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
        </MapView>
      }
    </View>
  );
}