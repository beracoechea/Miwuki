import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert,Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ModalEdit from './Modals/ModalEdit'; 
import ModalPet from './Modals/ModalPet'; 
import HorasComida from './HorasComida';
import { obtenerDatosUsuario } from '../Firebase/ConsultasFirebase';
import Alerts from '../Alerts/Alerts'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  Ia=() =>{
    this.props.navigation.navigate('Chatbot');
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: 'Perfil de Usuario',
    });
    this.loadUserData(); 
  }

  loadUserData = async () => {
    try {
      const userDataJson = await AsyncStorage.getItem('userData');
      if (userDataJson) {
        const userData = JSON.parse(userDataJson);
        this.setState({ user: userData, loadingUser: false });
      } else {
        this.getUserData();
      }
    } catch (error) {
      this.getUserData();
    }
  };

  getUserData = async () => {
    const { email } = this.props.route.params;
    try {
      const userData = await obtenerDatosUsuario(email);
      if (userData) {
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
    this.setState({ user: newData, modalEdit: false });
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
              await AsyncStorage.removeItem('userData');
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
    setTimeout(() => {
      this.setState({ alertType: null, alertMessage: null });
    }, 3000);
  };

  handlePetProfileNavigation = () => {
    this.props.navigation.navigate('PerfilMascotas', { email: this.state.user.email });
  };

  render() {
    const { modalEdit, modalPet, user, alertType, alertMessage, loadingUser } = this.state;

    if (loadingUser) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <LinearGradient colors={['#8B4513', '#FFFFFF', '#ADD8E6']} style={styles.gradient}>
          <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
              <Text style={styles.headerText}>{user.nombre}</Text>
              <Text style={styles.headerText}>{user.apellidos}</Text>
              <Text style={styles.subheaderText}>Email: {user.email}</Text>
              <Text style={styles.subheaderText}>Teléfono: {user.telefono}</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton} onPress={() => this.setState({ modalEdit: true })}>
                <SimpleLineIcons name="settings" size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={this.handleLogout}>
                <SimpleLineIcons name="logout" size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={() => this.setState({ modalPet: true })}>
                <MaterialIcons name="pets" size={24} color="#000" />
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
    zIndex:-1,
  },
});
