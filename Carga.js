import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet, ImageBackground, TouchableOpacity, AsyncStorage } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/Ionicons';
import Alerts from './Componets/Alerts/Alerts'; // Importar componente Alerts

class Carga extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: null,
      loading: true,
      alertMessage: '', // Nuevo estado para almacenar el mensaje de alerta
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.checkInternetConnection(); // Llamar a la función de verificación después de 3 segundos
    }, 3000);
  }

  checkInternetConnection = () => {
    this.setState({ loading: true }); // Mostrar la rueda de carga mientras se verifica la conexión

    NetInfo.fetch().then(state => {
      this.setState({ isConnected: state.isConnected, loading: false });

      if (!state.isConnected) {
        // Establecer el mensaje de alerta si no hay conexión
        this.setState({ alertMessage: 'No hay conexión a Internet.  ' });
      } else {
          // Si no hay un usuario autenticado, navegar a 'SalaRegistro'
          this.navigateToRegistro();
        
      }
    }).catch(error => {
      this.setState({ isConnected: false, loading: false });
      // Mostrar mensaje de error si falla la verificación de conexión
      this.setState({ alertMessage: 'Error al verificar la conexión.   ' });
    });
  };

  handleRetry = () => {
    this.checkInternetConnection(); // Volver a intentar la conexión
  };

  navigateToMenu = () => {
    // Navegar a la pantalla 'Menu'
    this.props.navigation.navigate('Registro');
  };

  navigateToRegistro = () => {
    // Navegar a la pantalla 'SalaRegistro'
    this.props.navigation.navigate('Registro');
  };

  storeSessionState = async (loggedIn) => {
    try {
      await AsyncStorage.setItem('isLoggedIn', loggedIn.toString());
    } catch (error) {
      console.log('Error storing session state:', error.message);
    }
  };

  retrieveSessionState = async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        // Si hay sesión activa guardada, navegar directamente a 'Menu'
        this.navigateToMenu();
      } else {
        // Si no hay sesión activa guardada, continuar a 'SalaRegistro'
        this.navigateToSalaRegistro();
      }
    } catch (error) {
      console.log('Error retrieving session state:', error.message);
    }
  };

  render() {
    const { isConnected, loading, alertMessage } = this.state;

    if (loading) {
      return (
        <ImageBackground source={require('./images/Carga.jpeg')} style={styles.backgroundImage}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={70} color="#000000" />
          </View>
        </ImageBackground>
      );
    }

    return (
      <ImageBackground source={require('./images/Carga.jpeg')} style={styles.backgroundImage}>
        <View style={styles.container}>
          {!isConnected && (
            <View style={styles.disconnectedContainer}>
              <TouchableOpacity onPress={this.handleRetry}>
                <Icon.Button
                  name="reload"
                  backgroundColor="#8B4513"
                  onPress={this.handleRetry}
                  style={styles.retryButton}
                  iconStyle={styles.iconStyle}
                  size={30}
                >
                  Retry
                </Icon.Button>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Renderizar Alerts solo si no hay conexión o hay un error */}
        {(!isConnected || alertMessage !== '') && <Alerts type={(!isConnected ? 'error' : 'info')} message={alertMessage} />}
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
    marginTop: '50%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disconnectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '170%',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iconStyle: {
    marginRight: 10,
    color: '#fff',
  },
});

export default Carga;
