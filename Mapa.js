import React, { Component } from 'react';
import { Text, View, StyleSheet, PermissionsAndroid, Button, Alert, ImageBackground } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Importa los iconos de MaterialIcons

const GOOGLE_MAPS_APIKEY = 'AIzaSyBSPqvjXWfZvFhv76goTe2aTYqAQaVFPa8';

export default class Mapa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      veterinarias: [],
      latitude: null,
      longitude: null,
      permisoConcedido: false,
      ubicacionAutorizada: false, // Bandera para controlar si la ubicación ha sido autorizada
    };
  }

  async componentDidMount() {
    this.mostrarDialogoPermisos();
    this.interval = setInterval(() => {
      if (this.state.permisoConcedido && !this.state.ubicacionAutorizada) {
        this.obtenerUbicacion();
      }
    }, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async mostrarDialogoPermisos() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Requerimos permisos de localización',
          message: 'Para funcionar requerimos permisos de localización',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({ permisoConcedido: true });
        this.obtenerUbicacion();
      } else {
        const canAskAgain = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (!canAskAgain) {
          Alert.alert(
            'Permisos no concedidos',
            'Para utilizar esta función, habilite los permisos de ubicación manualmente en la configuración de su dispositivo.',
          );
        }
        this.setState({ permisoConcedido: false });
      }
    } catch (err) {
      console.warn(err);
    }
  }

  obtenerUbicacion() {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        this.setState({ latitude, longitude, ubicacionAutorizada: true }, () => {
          this.buscarVeterinariasCercanas();
        });
      },
      error => {
        console.warn(error.message);
        this.setState({ permisoConcedido: false }); // Actualizar estado si hay error de ubicación
      },
      { enableHighAccuracy: true, timeout: 50000, maximumAge: 1000 },
    );
  }

  async buscarVeterinariasCercanas() {
    const { latitude, longitude } = this.state;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1000&type=veterinary_care&key=${GOOGLE_MAPS_APIKEY}`,
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      this.setState({ veterinarias: data.results });
    } else {
      Alert.alert('No se encontraron veterinarias cercanas', 'No se encontraron veterinarias en un radio de 1 km.');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.permisoConcedido && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: this.state.latitude || 20.65505,
              longitude: this.state.longitude || -103.3251304836227,
              latitudeDelta: 0.09,
              longitudeDelta: 0.04,
            }}
            showsUserLocation={true}
          >
            {this.state.veterinarias.map((veterinaria, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: veterinaria.geometry.location.lat,
                  longitude: veterinaria.geometry.location.lng,
                }}
                title={veterinaria.name}
                description={veterinaria.vicinity}
              >
                {/* Usa el icono de MaterialIcons como marcador */}
                <MaterialIcons name="pets" size={30} color="red" style={styles.icon} />
              </Marker>
            ))}
          </MapView>
        )}
        {!this.state.permisoConcedido && (
          <ImageBackground
            source={require('./images/mapa.jpg')} // Ruta de la imagen de fondo
            style={styles.imageBackground}
          >
            <View style={styles.permisosContainer}>
              <Text style={styles.denegado}>Recuerda encender tu ubicacion.</Text>
              <Button title="Conceder Permiso" onPress={() => this.mostrarDialogoPermisos()} />
            </View>
          </ImageBackground>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  denegado: {
    color: 'black',
    fontSize: 20,
    marginBottom: 20,
  },
  permisosContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});