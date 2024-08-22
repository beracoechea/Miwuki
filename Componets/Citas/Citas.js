import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import {guardarCita, suscribirACambiosCitas, eliminarCita } from '../Firebase/ConsultasFirebase';
import ModalCitas from './ModalCitas';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Swipeable } from 'react-native-gesture-handler';
import Alerts, { ALERT_TYPES } from '../Alerts/Alerts';
import LinearGradient from 'react-native-linear-gradient';

export default class Citas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      citas: [],
      modalVisible: false,
      nuevaCita: {
        fecha: '',
        hora: '',
        veterinariaId: '',
        motivo: '',
        estado: 'pendiente',
      },
      alertVisible: false,
      alertType: ALERT_TYPES.INFO,
      alertMessage: '',
    };
  }

  componentDidMount() {
    const { email } = this.props;
    this.suscripcion = suscribirACambiosCitas(email, this.handleCitaChange);
  }

  componentWillUnmount() {
    if (this.suscripcion) {
      this.suscripcion();
    }
  }

  handleCitaChange = (change) => {
    const { fecha, id } = change.doc.data();
    const citaDate = new Date(fecha);
    const currentDate = new Date();

    if (citaDate < currentDate) {
      eliminarCita(change.doc.id);
      return;
    }

    if (change.type === 'added') {
      this.setState((prevState) => ({
        citas: [...prevState.citas, { id: change.doc.id, ...change.doc.data() }],
      }));
    } else if (change.type === 'modified') {
      this.setState((prevState) => ({
        citas: prevState.citas.map(cita =>
          cita.id === change.doc.id ? { id: change.doc.id, ...change.doc.data() } : cita
        ),
      }));
    } else if (change.type === 'removed') {
      this.setState((prevState) => ({
        citas: prevState.citas.filter(cita => cita.id !== change.doc.id),
      }));
    }
  };

  async guardarCita() {
    const { email } = this.props;
    const { nuevaCita } = this.state;
    try {
      await guardarCita(email, nuevaCita);
      this.setState({
        modalVisible: false,
        nuevaCita: { fecha: '', hora: '', veterinariaId: '', motivo: '', estado: 'pendiente' },
      });
    } catch (error) {
      console.error('Error al guardar la cita:', error);
    }
  }

  formatFecha = (fecha) => {
    if (typeof fecha === 'string' && fecha.length === 8) {
      const dia = parseInt(fecha.substring(0, 2), 10);
      const mes = parseInt(fecha.substring(2, 4), 10) - 1;
      const año = parseInt(fecha.substring(4, 8), 10);
      const date = new Date(año, mes, dia);

      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${day}/${month}/${año}`;
    }

    let date;
    if (typeof fecha === 'number') {
      date = new Date(fecha);
    } else {
      date = fecha;
    }

    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  handleDeleteCita = async (id) => {
    const { email } = this.props;
    try {
      await eliminarCita(email, id);
      this.setState({
        alertVisible: true,
        alertType: ALERT_TYPES.EXIT,
        alertMessage: 'Cita eliminada correctamente         ',
      });
    } catch (error) {
      this.setState({
        alertVisible: true,
        alertType: ALERT_TYPES.ERROR,
        alertMessage: 'Error al eliminar la cita seleccionada         ',
      });
    }
  };

  renderCita = ({ item }) => {
    let iconColor = 'gray';
    let iconName = 'clock';
    let borderColor = '#000';
    switch (item.estado) {
      case 'aceptada':
        iconColor = 'green';
        iconName = 'check-circle';
        borderColor = 'green';
        break;
      case 'rechazada':
        iconColor = 'red';
        iconName = 'times-circle';
        borderColor = 'red';
        break;
      case 'pendiente':
        iconColor = 'orange';
        iconName = 'exclamation-circle';
        borderColor = 'orange';
        break;
    }

    const renderRightActions = () => {
      if (item.estado === 'rechazada') {
        return (
          <TouchableOpacity
            style={styles.botonEliminar}
            onPress={() => this.handleDeleteCita(item.id)}
          >
            <FontAwesome5 name="trash-alt" size={24} color={'#fff'} style={styles.icon} />
          </TouchableOpacity>
        );
      }
      return null;
    };

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.Container}>
        <View style={[styles.citaContainer, { borderColor: borderColor }]}>
          <View style={styles.infoContainer}>
            <Text style={styles.citaTextoPrincipal}>Fecha: {this.formatFecha(item.fecha)}</Text>
            <Text style={styles.citaTextoPrincipal}>Hora: {item.hora}</Text>
            <Text style={styles.citaTexto}>Veterinaria: {item.veterinariaId}</Text>
            <Text style={styles.citaTexto}>Motivo: {item.motivo}</Text>
          
          </View>
          <FontAwesome5 name={iconName} size={24} color={iconColor} style={styles.icon} />
        </View>
        </View>
      </Swipeable>
    );
  };

  render() {
    const { modalVisible, nuevaCita, alertVisible, alertType, alertMessage } = this.state;
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#8B4513', '#FFFFFF', '#ADD8E6']} style={styles.gradient}>
          <Text style={styles.titulo}>Mis Citas</Text>
        </LinearGradient>
        <FlatList
          data={this.state.citas}
          renderItem={this.renderCita}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={styles.noCitas}>No tienes citas programadas</Text>}
        />
        <TouchableOpacity style={styles.botonCita} onPress={() => this.setState({ modalVisible: true })}>
          <Text style={styles.botonTexto}>Solicitar Cita</Text>
        </TouchableOpacity>

        <ModalCitas
          visible={modalVisible}
          onClose={() => this.setState({ modalVisible: false })}
          onGuardarCita={() => this.guardarCita()}
          nuevaCita={nuevaCita}
          setNuevaCita={(nuevaCita) => this.setState({ nuevaCita })}
        />

        {alertVisible && (
          <Alerts 
            type={alertType} 
            message={alertMessage} 
            onClose={() => this.setState({ alertVisible: false })} 
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  Container:{
    padding:20,

  },
  gradient: {
    paddingHorizontal: 20,
    paddingVertical: 17,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  citaContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 4, // Añadido para definir el borde
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  citaTextoPrincipal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  citaTexto: {
    fontSize: 14,
    color: '#666',
  },
  icon: {
    alignSelf: 'center',
  },
  botonCita: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  botonEliminar: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCitas: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});
