import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/Ionicons';
import Alerts from '../Alerts/Alerts'; // Importar componente Alerts

class Carga extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: null,
      loading: true,
      alertMessage: '', // Estado para almacenar el mensaje de alerta
    };
  }

  componentDidMount() {
    this.checkInternetConnection(); // Verificar la conexión a Internet al montar el componente
  }

  checkInternetConnection = () => {
    this.setState({ loading: true }); // Mostrar la rueda de carga mientras se verifica la conexión

    NetInfo.fetch().then(state => {
      this.setState({ isConnected: state.isConnected });

      if (!state.isConnected) {
        // Establecer el mensaje de alerta si no hay conexión
        this.setState({ alertMessage: 'No hay conexión a Internet.  ', loading: false });
      } else {
        // Simular tiempo de espera antes de continuar
        setTimeout(() => {
          this.setState({ loading: false });
          this.navigateToNextScreen();
        }, 3000); // Aquí esperamos 3 segundos antes de continuar
      }
    }).catch(error => {
      this.setState({ isConnected: false, loading: false });
      // Mostrar mensaje de error si falla la verificación de conexión
      this.setState({ alertMessage: 'Error al verificar la conexión.' });
    });
  };

  handleRetry = () => {
    this.checkInternetConnection(); // Volver a intentar la conexión
  };

  navigateToNextScreen = () => {
    this.props.navigation.reset({
      index: 0, // El índice de la nueva pantalla en la pila
      routes: [{ name: 'Registro' }], // Reemplaza la pila con la pantalla 'Registro'
    });
  };

  render() {
    const { isConnected, loading, alertMessage } = this.state;

    if (loading) {
      return (
        <ImageBackground source={require('../../images/Carga.jpeg')} style={styles.backgroundImage}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000000" />
          </View>
        </ImageBackground>
      );
    }

    return (
      <ImageBackground source={require('../../images/Carga.jpeg')} style={styles.backgroundImage}>
        <View style={styles.container}>
          {!isConnected && (
            <View style={styles.disconnectedContainer}>
              <TouchableOpacity onPress={this.handleRetry}>
                <Icon name="reload" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Renderizar Alerts solo si no hay conexión o hay un error */}
        {(!isConnected || alertMessage !== '') && (
          <Alerts type={!isConnected ? 'error' : 'info'} message={alertMessage} onClose={() => this.setState({ alertMessage: '' })} />
        )}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disconnectedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: -250,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
  },
});

export default Carga;
