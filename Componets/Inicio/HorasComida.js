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
    loading: true, // Agregar estado de carga
  };

  componentDidMount() {
    // No cargar datos iniciales hasta asegurarse de que el componente esté montado
    this.loadInitialData();
  }

  // Función para cargar los datos iniciales del usuario desde Firebase
  loadInitialData = async () => {
    const { emailUsuario } = this.props;

    try {
      // Obtener datos de Firebase para el usuario dado
      const userData = await obtenerDatosUsuario(emailUsuario);

      if (userData && userData.ultimaComida) {
        // Comparar y marcar la última comida registrada
        const { ultimaComida } = userData;

        this.setState({
          desayunoComio: ultimaComida === 'desayuno',
          almuerzoComio: ultimaComida === 'almuerzo',
          cenaComio: ultimaComida === 'cena',
          loading: false, // Indicar que la carga ha terminado correctamente
        });
      } else {
        // Manejar caso donde no hay datos de comida o ultimaComida está ausente
        this.setState({ loading: false });
      }
    } catch (error) {
      this.setState({ loading: false });
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
      let nextState = {};

      switch (tipoComida) {
        case 'desayuno':
          nextState = { desayunoComio: true, almuerzoComio: false, cenaComio: false };
          break;
        case 'almuerzo':
          nextState = { desayunoComio: false, almuerzoComio: true, cenaComio: false };
          break;
        case 'cena':
          nextState = { desayunoComio: false, almuerzoComio: false, cenaComio: true };
          break;
        default:
          break;
      }

      this.setState(nextState, async () => {
        await actualizarComidaPerro(emailUsuario, tipoComida);
        showAlert(ALERT_TYPES.EXIT, `Se ha registrado la comida para ${tipoComida}    `);
      });

    } catch (error) {
      showAlert(ALERT_TYPES.ERROR, 'Hubo un problema al registrar la comida    ');
    }
  };

  render() {
    const { desayunoComio, almuerzoComio, cenaComio, loading } = this.state;

    // Mostrar un indicador de carga mientras se obtienen los datos iniciales
    if (loading) {
      return (
        <View style={styles.container}>
          <Text>Cargando datos...</Text>
        </View>
      );
    }

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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  horarioRecomendado: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#D2B48C',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonComido: {
    backgroundColor: '#D2B48C',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D2B48C',
    marginRight: 10,
  },
});
