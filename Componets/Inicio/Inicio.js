import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import ModalEdit from './Modals/ModalEdit'; // Ajusta la ruta según la estructura de tu proyecto
import HorasComida from './HorasComida'; // Componente separado para horas de comida
import { obtenerDatosUsuario } from '../Firebase/ConsultasFirebase';
import Alerts from '../Alerts/Alerts'; // Ajusta la ruta según donde esté ubicado Alerts
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Inicio extends Component {
  state = {
    user: {
      nombre: '',
      apellidos: '',
      telefono: '',
      email: '', // Agregar el email como parte del estado
    },
    modalVisible: false,
    alertType: null,
    alertMessage: null,
    loadingUser: true, // Nuevo estado para indicar la carga de datos del usuario
    refreshing: false, // Para indicar cuando se está actualizando los datos del usuario
  };

  componentDidMount() {
    this.props.navigation.setOptions({
      title: 'Perfil de Usuario',
    });
    this.loadUserData(); // Cargar los datos del usuario
  }

  // Función para cargar los datos del usuario desde AsyncStorage si están almacenados
  loadUserData = async () => {
    try {
      // Intentar obtener los datos del usuario desde AsyncStorage
      const userDataJson = await AsyncStorage.getItem('userData');
      if (userDataJson) {
        // Si se encuentran datos, convertirlos a objeto y establecerlos en el estado
        const userData = JSON.parse(userDataJson);
        this.setState({ user: userData, loadingUser: false });
      } else {
        // Si no hay datos en AsyncStorage, cargarlos desde Firebase
        this.getUserData();
      }
    } catch (error) {
      // En caso de error al cargar desde AsyncStorage, cargar desde Firebase
      this.getUserData();
    }
  };

  // Función para obtener los datos del usuario desde Firebase
  getUserData = async () => {
    const { email } = this.props.route.params;
    try {
      const userData = await obtenerDatosUsuario(email);
      if (userData) {
        // Almacenar los datos del usuario en AsyncStorage para futuras cargas
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        this.setState({ user: userData, loadingUser: false });
      } else {
        this.setState({ loadingUser: false });
      }
    } catch (error) {
      this.setState({ loadingUser: false });
    }
  };

  handleUpdateSuccess = (newData) => {
    this.setState({ user: newData, modalVisible: false });
  };

  handleLogout = async () => {
    // Mostrar una alerta de confirmación antes de proceder con el cierre de sesión
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          onPress: async () => {
            try {
              // Limpiar los datos de sesión
              await AsyncStorage.removeItem('userData');
              // Navegar al componente de registro ('Registro')
              this.props.navigation.navigate('Registro');
            } catch (error) {
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  showAlert = (type, message) => {
    this.setState({ alertType: type, alertMessage: message });
    // Limpia la alerta después de 3 segundos
    setTimeout(() => {
      this.setState({ alertType: null, alertMessage: null });
    }, 3000);
  };

  render() {
    const { modalVisible, user, alertType, alertMessage, loadingUser } = this.state;

    // Mostrar un indicador de carga mientras se obtienen los datos del usuario
    if (loadingUser) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {/* Header con linear gradient */}
        <LinearGradient colors={['#8B4513', '#FFFFFF', '#ADD8E6']} style={styles.gradient}>
          <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
              <Text style={styles.headerText}>{user.nombre}</Text>
              <Text style={styles.headerText}>{user.apellidos}</Text>
              <Text style={styles.subheaderText}>Email: {user.email}</Text>
              <Text style={styles.subheaderText}>Teléfono: {user.telefono}</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton} onPress={() => this.setState({ modalVisible: true })}>
                <SimpleLineIcons name="settings" size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={this.handleLogout}>
                <SimpleLineIcons name="logout" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Contenido principal */}
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Componente de Horas de Comida */}
          <HorasComida emailUsuario={user.email} showAlert={this.showAlert} />

          {/* Modal para editar datos */}
          <ModalEdit
            visible={modalVisible}
            onClose={() => this.setState({ modalVisible: false })}
            user={user}
            onUpdateSuccess={this.handleUpdateSuccess}
          />

        </ScrollView>

        {/* Mostrar alerta si existe */}
        {alertType && alertMessage && (
          <Alerts type={alertType} message={alertMessage} onClose={() => this.setState({ alertType: null, alertMessage: null })} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  subheaderText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    paddingHorizontal: 10,
  },
  scroll: {
    flexGrow: 1,
  },

  containerIA: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iaButton: {
    backgroundColor: '#D2B48C',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -45,
  },
  iaButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginRight: 10,
  },
  iaButtonIcon: {
    color: 'blue',
  },
  perrito1: {
    width: 300,
    height: 140,
    zIndex: -1,
  },
});
