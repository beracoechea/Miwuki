import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { obtenerUbicacion, mostrarDialogoPermisos, buscarVeterinariasCercanas } from './MapaFuncional';
import { VistaError } from './VistaError';

export default class Mapa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      veterinarias: [],
      latitude: null,
      longitude: null,
      permisoConcedido: false,
      ubicacionAutorizada: false,
    };
  }

  async componentDidMount() {
    mostrarDialogoPermisos(this.actualizarEstadoPermisos);
    this.interval = setInterval(() => {
      if (this.state.permisoConcedido && !this.state.ubicacionAutorizada) {
        obtenerUbicacion(this.actualizarEstadoUbicacion);
      }
    }, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  actualizarEstadoPermisos = (permisoConcedido) => {
    this.setState({ permisoConcedido }, () => {
      if (this.state.permisoConcedido) {
        obtenerUbicacion(this.actualizarEstadoUbicacion);
      }
    });
  };

  actualizarEstadoUbicacion = (estado) => {
    this.setState(estado, () => {
      if (this.state.ubicacionAutorizada) {
        buscarVeterinariasCercanas(this.state.latitude, this.state.longitude, this.actualizarVeterinarias);
      }
    });
  };

  actualizarVeterinarias = (estado) => {
    this.setState(estado);
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.permisoConcedido ? (
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
                <MaterialIcons name="pets" size={30} color="red" style={styles.icon} />
              </Marker>
            ))}
          </MapView>
        ) : (
          <VistaError onPress={() => mostrarDialogoPermisos(this.actualizarEstadoPermisos)} />
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
});
