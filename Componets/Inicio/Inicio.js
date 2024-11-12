import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import ModalEdit from './Modals/ModalEdit';
import ModalPet from './Modals/ModalPet';
import LoadingModal from '../Screens/LoadingModal';


import HorasComida from './HorasComida';
import Alerts from '../Alerts/Alerts';

import { obtenerDatosUsuario } from '../Firebase/ConsultasFirebase';

import AsyncStorageManager from '../AsyncStorage/AsyncStorageManager';

export default class Inicio extends Component {
  state = {
    user: {
      nombre: '',
      apellidos: '',
      telefono: '',
      email: '',
    },
    modalEdit: false,
    modalPet: false,
    alertType: null,
    alertMessage: null,
    loadingUser: true,
    refreshing: false,
  };

  componentDidMount() {
    this.props.navigation.setOptions({
      title: 'Perfil de Usuario',
    });
    this.loadUserData();
  }

  loadUserData = async () => {
    try {
      const userData = await AsyncStorageManager.getUserData();
      if (userData) {
        this.setState({ user: userData, loadingUser: false });
      } else {
        this.getUserDataFromFirebase(); // Si no hay datos en AsyncStorage, obtenemos desde Firebase
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      this.getUserDataFromFirebase(); // En caso de error, intentamos obtener desde Firebase
    }
  };

  getUserDataFromFirebase = async () => {
    const { email } = this.props.route.params;
    try {
      const userData = await obtenerDatosUsuario(email);
      if (userData) {
        await AsyncStorageManager.setUserData(userData); // Guardamos los datos en AsyncStorage
        this.setState({ user: userData, loadingUser: false });
      } else {
        this.setState({ loadingUser: false });
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      this.setState({ loadingUser: false });
    }
  };

  handleUpdateSuccess = async (newData) => {
    try {
      this.setState({ user: newData, modalEdit: false });
      await AsyncStorageManager.setUserData(newData); // Actualizamos los datos en AsyncStorage
      this.showAlert('success', 'Datos actualizados correctamente.');
    } catch (error) {
      console.error('Error updating user data:', error);
      this.showAlert('error', 'Hubo un error al actualizar los datos.');
    }
  };

  handleLogout = async () => {
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
              await AsyncStorageManager.removeUserData();
              this.props.navigation.navigate('Registro');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  showAlert = (type, message) => {
    this.setState({ alertType: type, alertMessage: message });
    setTimeout(() => {
      this.setState({ alertType: null, alertMessage: null });
    }, 3000);
  };

  handlePetProfileNavigation = () => {
    this.props.navigation.navigate('PerfilMascotas', { email: this.state.user.email });
  };

  Ia = () => {
    const { navigation } = this.props;
    navigation.navigate('Chatbot'); // Reemplaza 'Chatbot' con el nombre de tu pantalla de chatbot
  };

  render() {
    const { modalEdit, modalPet, user, alertType, alertMessage, loadingUser } = this.state;

    if (loadingUser) {
      return <LoadingModal visible={true} />;
    }

    return (
      <View style={styles.container}>
        <LinearGradient colors={['#8B4513', '#FFFFFF', '#ADD8E6']} style={styles.gradient}>
          <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
              <Text style={styles.headerText}>{user.nombre}</Text>
              <Text style={styles.headerText}>{user.apellidos}</Text>
              <Text style={styles.subheaderText}>Teléfono: {user.telefono}</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton} onPress={() => this.setState({ modalEdit: true })}>
                <FontAwesome5 name="user-edit" size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={this.handleLogout}>
                <Ionicons name="log-out" size={30} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={() => this.setState({ modalPet: true })}>
                <MaterialIcons name="pets" size={26} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.scroll}>
          <HorasComida emailUsuario={user.email} showAlert={this.showAlert} />
          <View style={styles.containerIA}>
            <Image source={require('../../images/Perritos.png')} style={styles.perrito1}></Image>
            <TouchableOpacity style={styles.iaButton} onPress={this.Ia}>
              <SimpleLineIcons name="magic-wand" size={24} style={styles.iaButtonIcon} />
              <Text style={styles.iaButtonText}>   Pregúntale algo a la IA </Text>
            </TouchableOpacity>
          </View>

          {/* Otro contenido de la aplicación */}
          {/* Aquí puedes agregar más componentes y contenido según sea necesario */}

          <ModalEdit
            visible={modalEdit}
            onClose={() => this.setState({ modalEdit: false })}
            user={user}
            onUpdateSuccess={this.handleUpdateSuccess}
          />
          
          <ModalPet
            visible={modalPet}
            onClose={() => this.setState({ modalPet: false })}
            email={user.email}
            navigation={this.props.navigation} // Pasar la navegación como prop
          />

        </ScrollView>

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
    flexDirection: 'column',
    alignItems: 'center',
    margin: 10,
  },
  headerButton: {
    paddingVertical: 8,
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
