import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Image, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import avatarMap from '../../../ImagenesPerros'; // Ajusta la ruta según sea necesario
import { obtenerMascotasUsuario } from '../../Firebase/ConsultasFirebase';

export default class ModalPet extends Component {
  state = {
    mascotas: [],
    loading: true,
    error: null, // Agregamos un estado para manejar errores
  };

  componentDidMount() {
    this.loadMascotas();
  }

  loadMascotas = async () => {
    const { email } = this.props;
    try {
      const mascotas = await obtenerMascotasUsuario(email);
      this.setState({ mascotas, loading: false, error: null });
    } catch (error) {
      console.error('Error al obtener las mascotas:', error);
      this.setState({ loading: false, error });
    }
  };

  handleAvatarPress = () => {
    const { navigation, email } = this.props;
    navigation.navigate('PerfilMascotas', { email });
  };

  render() {
    const { visible, onClose } = this.props;
    const { mascotas, loading, error } = this.state;

    if (loading) {
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={onClose}
        >
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#0000ff" alignItems="center" />
          </View>
        </Modal>
      );
    }

    if (error) {
      return (
        <Modal
          animationType="slide"
          transparent={false}
          visible={visible}
          onRequestClose={onClose}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.errorText}>Error al cargar las mascotas</Text>
            <TouchableOpacity style={styles.reloadButton} onPress={this.loadMascotas}>
              <MaterialIcons name="refresh" size={24} color="#007bff" />
              <Text style={styles.reloadText}>Intentar de nuevo</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      );
    }

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {mascotas.map((mascota) => (
              <TouchableOpacity key={mascota.id} style={styles.card}>
                <Image source={avatarMap[mascota.avatar]} style={styles.avatar} />
                <Text style={styles.cardText}>{mascota.nombreMascota}  </Text>
              </TouchableOpacity>
            ))}
             <TouchableOpacity style={styles.addButton} onPress={this.handleAvatarPress}>
              <MaterialIcons name="add-circle-outline" size={50} color="#007bff" />
            </TouchableOpacity>
          </ScrollView>
        </View>
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
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  reloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  reloadText: {
    fontSize: 16,
    color: '#007bff',
    marginLeft: 10,
  },
});
