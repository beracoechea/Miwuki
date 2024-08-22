import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid } from 'react-native';
import { GOOGLE_MAPS_APIKEY } from './config';

export const obtenerUbicacion = (callback) => {
  Geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      callback({ latitude, longitude, ubicacionAutorizada: true });
    },
    error => {
      console.warn(error.message);
      callback({ permisoConcedido: false });
    },
    { enableHighAccuracy: true, timeout: 50000, maximumAge: 1000 },
  );
};

export const mostrarDialogoPermisos = async (callback) => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Requerimos permisos de localización',
        message: 'Para funcionar requerimos permisos de localización',
      },
    );
    callback(granted === PermissionsAndroid.RESULTS.GRANTED);
  } catch (err) {
    console.warn(err);
  }
};

export const buscarVeterinariasCercanas = async (latitude, longitude, callback) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1000&type=veterinary_care&key=${GOOGLE_MAPS_APIKEY}`,
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      callback({ veterinarias: data.results });
    } else {
      callback({ veterinarias: [] });
    }
  } catch (error) {
    console.warn(error);
  }
};
