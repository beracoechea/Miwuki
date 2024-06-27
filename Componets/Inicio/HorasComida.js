import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { actualizarComidaPerro, obtenerDatosUsuario } from '../Firebase/ConsultasFirebase';
import { ALERT_TYPES } from '../Alerts/Alerts';

export default class HorasComida extends Component {
  state = {
    desayunoComio: false,
    almuerzoComio: false,
    cenaComio: false,
  };

  componentDidMount() {
    // Cargar estado inicial desde Firebase al montar el componente
    this.loadInitialData();
  }

  // Función para cargar los datos iniciales del usuario desde Firebase
  loadInitialData = async () => {
    const { emailUsuario } = this.props;

    try {
      // Obtener datos de Firebase para el usuario dado
      const userData = await obtenerDatosUsuario(emailUsuario);

      if (userData) {
        // Comparar y marcar la última comida registrada
        const { ultimaComida } = userData;

        this.setState({
          desayunoComio: ultimaComida === 'desayuno',
          almuerzoComio: ultimaComida === 'almuerzo',
          cenaComio: ultimaComida === 'cena',
        });
      } else {
        console.log('No se encontraron datos de comida para el usuario');
      }
    } catch (error) {
      console.error('Error al obtener datos de comida del usuario:', error);
    }
  };

  handleComidaConsumida = async (tipoComida) => {
    const { emailUsuario, showAlert } = this.props;

    // Verificar si el botón ya está en estado true
    if (this.state[`${tipoComida}Comio`]) {
      // El botón ya está marcado como consumido, no hacer nada
      return;
    }

    try {
      // Inicializar variables para determinar cuál es el próximo tipo de comida
      let nextComida = '';
      let nextState = {};

      switch (tipoComida) {
        case 'desayuno':
          nextComida = 'almuerzo';
          nextState = { desayunoComio: true, almuerzoComio: false, cenaComio: false };
          break;
        case 'almuerzo':
          nextComida = 'cena';
          nextState = { desayunoComio: false, almuerzoComio: true, cenaComio: false };
          break;
        case 'cena':
          nextComida = 'desayuno';
          nextState = { desayunoComio: false, almuerzoComio: false, cenaComio: true };
          break;
        default:
          break;
      }

      this.setState(nextState, async () => {
        await actualizarComidaPerro(emailUsuario, tipoComida);
        showAlert(ALERT_TYPES.EXIT, `Se ha registrado la comida para ${tipoComida}`);
      });

    } catch (error) {
      showAlert(ALERT_TYPES.ERROR, 'Hubo un problema al registrar la comida');
    }
  };

  render() {
    const { desayunoComio, almuerzoComio, cenaComio } = this.state;

    return (
      <View>
        <Text style={styles.title}>Horarios Recomendados Para Que Coma Tu Mascota</Text>

        <View style={styles.infoRow}>
          <TouchableOpacity style={styles.infoField}>
            <View style={styles.buttonRow}>
              <View style={styles.dot} />
              <Text style={styles.horarioRecomendado}>Rango recomendado: 7:00 AM - 9:00 AM</Text>
              <TouchableOpacity
                style={[styles.button, desayunoComio && styles.buttonComido]}
                onPress={() => this.handleComidaConsumida('desayuno')}
                disabled={desayunoComio}
              >
                {desayunoComio ? (
                  <MaterialCommunityIcons name="check" size={20} color="#FFF" />
                ) : (
                  <FontAwesome5 name="check" size={20} color="#000" />
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <TouchableOpacity style={styles.infoField}>
            <View style={styles.buttonRow}>
              <View style={styles.dot} />
              <Text style={styles.horarioRecomendado}>Rango recomendado: 12:00 PM - 2:00 PM</Text>
              <TouchableOpacity
                style={[styles.button, almuerzoComio && styles.buttonComido]}
                onPress={() => this.handleComidaConsumida('almuerzo')}
                disabled={almuerzoComio}
              >
                {almuerzoComio ? (
                  <MaterialCommunityIcons name="check" size={20} color="#FFF" />
                ) : (
                  <FontAwesome5 name="check" size={20} color="#000" />
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <TouchableOpacity style={styles.infoField}>
            <View style={styles.buttonRow}>
              <View style={styles.dot} />
              <Text style={styles.horarioRecomendado}>Rango recomendado: 6:00 PM - 8:00 PM</Text>
              <TouchableOpacity
                style={[styles.button, cenaComio && styles.buttonComido]}
                onPress={() => this.handleComidaConsumida('cena')}
                disabled={cenaComio}
              >
                {cenaComio ? (
                  <MaterialCommunityIcons name="check" size={20} color="#FFF" />
                ) : (
                  <FontAwesome5 name="check" size={20} color="#000" />
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 30,
  },
  infoRow: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  infoField: {
    backgroundColor: '#ADD8E6',
    borderRadius: 10,
    padding: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    marginRight: 10,
  },
  buttonText: {
    flex: 1,
    fontSize: 16,
  },
  horarioRecomendado: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 'auto',
  },
  buttonComido: {
    backgroundColor: '#8B4513',
  },
});
