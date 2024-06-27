import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity ,Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import ModalEdit from './Modals/ModalEdit'; // Ajusta la ruta según la estructura de tu proyecto
import HorasComida from './HorasComida'; // Componente separado para horas de comida
import { obtenerDatosUsuario } from '../Firebase/ConsultasFirebase';
import Alerts from '../Alerts/Alerts'; // Ajusta la ruta según donde esté ubicado Alerts

export default class Inicio extends Component {
  state = {
    user: {
      nombre: '',
      apellidos: '',
      telefono: '',
    },
    modalVisible: false,
    alertType: null,
    alertMessage: null,
  };
  Ia=() =>{
    this.props.navigation.navigate('Chatbot');
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: 'Perfil de Usuario',
    });
    this.getUserData();
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  getUserData = async () => {
    const { email } = this.props.route.params;
    try {
      const userData = await obtenerDatosUsuario(email);
      if (userData) {
        this.setState({ user: userData });
      } else {
        console.log('No se encontraron datos para el usuario');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };

  handleUpdateSuccess = (newData) => {
    this.setState({ user: newData, modalVisible: false });
  };

  showAlert = (type, message) => {
    this.setState({ alertType: type, alertMessage: message });
    // Limpia la alerta después de 3 segundos
    setTimeout(() => {
      this.setState({ alertType: null, alertMessage: null });
    }, 3000);
  };

  render() {
    const { modalVisible, user, alertType, alertMessage } = this.state;

    return (
      <View style={styles.container}>
        {/* Header con linear gradient */}
        <LinearGradient colors={['#8B4513', '#FFFFFF', '#ADD8E6']} style={styles.gradient}>
          <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
              <Text style={styles.headerText}>{user.nombre}</Text>
              <Text style={styles.subheaderText}>Email: {user.email}</Text>
              <Text style={styles.subheaderText}>Teléfono: {user.telefono}</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton} onPress={() => this.setState({ modalVisible: true })}>
                <SimpleLineIcons name="settings" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Contenido principal */}
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Componente de Horas de Comida */}
          <HorasComida emailUsuario={user.email} showAlert={this.showAlert} />

           {/* Botón IA */}
            <View style={styles.containerIA}>
            <Image source={require('../../images/Perritos.png')} style={styles.perrito1}></Image>
            <TouchableOpacity style={styles.iaButton} onPress={this.Ia}>
              <SimpleLineIcons name="magic-wand" size={24} style={styles.iaButtonIcon} />
              <Text style={styles.iaButtonText}>   Pregúntale algo a la IA  </Text>
            </TouchableOpacity>
            </View>
          
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
    zIndex:-1,
  },
});
