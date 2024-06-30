import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Alerts, { ALERT_TYPES } from '../../Alerts/Alerts';
import { obtenerMascotasUsuario, suscribirACambiosMascotas } from '../../Firebase/ConsultasFirebase';
import AsyncStorageManager from '../../AsyncStorage/AsyncStorageManager';
import LoadingModal from '../../Screens/LoadingModal';

import avatarMapPerros from '../../TiposMascotas/ImagenesPerros';
import avatarMapGatos from '../../TiposMascotas/ImagenesGatos';
import avatarMapAves from '../../TiposMascotas/ImagenesAves';
import avatarMapMamiferos from '../../TiposMascotas/ImagenesMamiferos';

export default class ModalPet extends Component {
  state = {
    mascotas: [],
    loading: true,
    error: null,
    showAlert: false,
    alertType: '',
    alertMessage: '',
    ultimaMascotaRegistrada: '',
    usuarioId: '', // asegúrate de inicializar usuarioId si lo estás utilizando directamente
  };

  componentDidMount() {
    const { email } = this.props;
    this.setState({ usuarioId: email }, () => {
      this.loadMascotas();
      this.subscribeToChanges();
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  loadMascotas = async () => {
    const { usuarioId } = this.state;

    try {
      let mascotasFromStorage = await AsyncStorageManager.getMascotas(usuarioId);

      if (mascotasFromStorage && mascotasFromStorage.length > 0) {
        this.setState({ mascotas: mascotasFromStorage, loading: false, error: null });
      } else {
        const mascotas = await obtenerMascotasUsuario(usuarioId);
        this.setState({ mascotas, loading: false, error: null });
        await AsyncStorageManager.setMascotas(usuarioId, mascotas);
      }
    } catch (error) {
      console.error('Error al obtener las mascotas:', error);
      this.setState({ loading: false, error });
      this.showAlert(ALERT_TYPES.ERROR, 'Error al cargar las mascotas. Intenta de nuevo más tarde.');
    }
  };

  subscribeToChanges = () => {
    const { usuarioId } = this.state;
    this.unsubscribe = suscribirACambiosMascotas(usuarioId, this.handleMascotaChange);
  };

  handleMascotaChange = async (change) => {
    const { usuarioId, mascotas } = this.state;

    switch (change.type) {
      case 'added':
        if (!mascotas.some(mascota => mascota.id === change.doc.id)) {
          const nuevaMascota = { id: change.doc.id, ...change.doc.data() };
          mascotas.push(nuevaMascota);
          this.setState({
            mascotas,
            ultimaMascotaRegistrada: nuevaMascota.nombreMascota,
          });
          await AsyncStorageManager.setMascotas(usuarioId, mascotas);
        }
        break;
      case 'modified':
        const modifiedIndex = mascotas.findIndex((mascota) => mascota.id === change.doc.id);
        if (modifiedIndex !== -1) {
          mascotas[modifiedIndex] = { id: change.doc.id, ...change.doc.data() };
          this.setState({ mascotas });
          await AsyncStorageManager.setMascotas(usuarioId, mascotas);
        }
        break;
      case 'removed':
        const removedIndex = mascotas.findIndex((mascota) => mascota.id === change.doc.id);
        if (removedIndex !== -1) {
          mascotas.splice(removedIndex, 1);
          this.setState({ mascotas });
          await AsyncStorageManager.setMascotas(usuarioId, mascotas);
        }
        break;
      default:
        break;
    }
  };

  showAlert = (type, message) => {
    this.setState({
      showAlert: true,
      alertType: type,
      alertMessage: message,
    });
  };

  handleAvatarPress = () => {
    const { navigation, email } = this.props;
    navigation.navigate('PerfilMascotas', { email });
      this.props.onClose();
   
  };

  getAvatarMap = (tipoMascota) => {
    switch (tipoMascota) {
      case 'Perro':
        return avatarMapPerros;
      case 'Gato':
        return avatarMapGatos;
      case 'Ave':
        return avatarMapAves;
      case 'Mamifero':
        return avatarMapMamiferos;
      default:
        return {};
    }
  };

  render() {
    const { visible, onClose } = this.props;
    const { mascotas, loading, showAlert, alertType, alertMessage, ultimaMascotaRegistrada } = this.state;

    return (
      <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.scrollContainer} horizontal showsHorizontalScrollIndicator={false}>
            {mascotas.map((mascota) => {
              const avatarMap = this.getAvatarMap(mascota.tipoMascota);
              return (
                <TouchableOpacity key={mascota.id} style={styles.card}>
                  <Image source={avatarMap[mascota.avatar]} style={styles.avatar} />
                  <Text style={styles.cardText}>{mascota.nombreMascota} </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity style={styles.addButton} onPress={this.handleAvatarPress}>
              <MaterialIcons name="add-circle-outline" size={50} color="#007bff" />
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Última mascota registrada: {ultimaMascotaRegistrada}</Text>
        </View>
        {loading && <LoadingModal visible={loading} onClose={() => {}} />}
        {showAlert && <Alerts type={alertType} message={alertMessage} onClose={() => this.setState({ showAlert: false })} />}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  closeButton: {
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 25,
    borderRadius: 50,
    borderColor: '#007bff',
  },
  infoContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
