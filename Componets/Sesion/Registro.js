import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Registro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, // Estado de carga inicial
    };
  }

  async componentDidMount() {
    try {
      // Verificar si hay una sesión existente
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.email) {
          // Log para verificar el email
          // Navegar a 'Menu' con el email del usuario
          this.props.navigation.navigate('Menu', { email: user.email });
          return;
        }
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    } finally {
      this.setState({ loading: false }); // Finalizar la carga si no hay sesión
    }
  }

  handleInternalRegister = () => {
    console.log('Registro: handleInternalRegister');
    this.props.navigation.navigate('Signup');
  };

  handleInternalIniciar = () => {
    console.log('Registro: handleInternalIniciar');
    this.props.navigation.navigate('Ingresar');
  };

  render() {
    if (this.state.loading) {
      return (
        <ImageBackground source={require('../../images/Fondo.jpeg')} style={styles.backgroundImage}>
          <View style={styles.overlay}>
            <Text style={styles.title}>Cargando...</Text>
          </View>
        </ImageBackground>
      );
    }

    return (
      <ImageBackground source={require('../../images/Fondo.jpeg')} style={styles.backgroundImage}>
        <View style={styles.overlay}>
          <Text style={styles.title}>¡Bienvenido a MIWUKI!</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonGoogle} onPress={this.handleInternalIniciar}>
              <AntDesign name="login" color="#FFF" size={25} style={styles.icon} />
              <Text style={styles.buttonText}>Iniciar sesión </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSignup} onPress={this.handleInternalRegister}>
              <AntDesign name="user" color="#FFF" size={25} style={styles.icon} />
              <Text style={styles.buttonText}>Crear cuenta </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 0.7,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFF',
  },
  buttonContainer: {
    width: '70%',
    flex: 0.7,
    justifyContent: 'center',
  },
  buttonGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 30,
    borderRadius: 5,
    elevation: 2,
  },
  buttonSignup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 30,
    borderRadius: 5,
    elevation: 2,
  },
  buttonText: {
    color: '#FFF',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
});
