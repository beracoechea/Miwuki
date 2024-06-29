import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Image, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { obtenerMascotasUsuario } from '../../Firebase/ConsultasFirebase';

// Importa todos los avatarMaps que necesites
import avatarMapPerros from '../../TiposMascotas/ImagenesPerros';
import avatarMapGatos from '../../TiposMascotas/ImagenesGatos';
import avatarMapAves from '../../TiposMascotas/ImagenesAves';
import avatarMapMamiferos from '../../TiposMascotas/ImagenesMamiferos';

export default class ModalPet extends Component {
  state = {
    mascotas: [],
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.loadMascotas();
  }

  loadMascotas = async () => {
    const { email } = this.props;
    try {
      // Inicializar las listas vacías
      let mascotas = [];
      
      // Obtener todas las mascotas del usuario de cada tipo
      const mascotasPerros = await obtenerMascotasUsuario(email, 'perros');
      const mascotasGatos = await obtenerMascotasUsuario(email, 'gatos');
      const mascotasAves = await obtenerMascotasUsuario(email, 'aves');
      const mascotasMamiferos = await obtenerMascotasUsuario(email, 'mamiferos');
  
      // Filtrar y agregar solo las mascotas que el usuario tiene y que se están mostrando
      mascotasPerros.forEach(mascota => {
        if (mascota.tipoMascota === 'Perro') {
          mascotas.push(mascota);
        }
      });
  
      mascotasGatos.forEach(mascota => {
        if (mascota.tipoMascota === 'Gato') {
          mascotas.push(mascota);
        }
      });
  
      mascotasAves.forEach(mascota => {
        if (mascota.tipoMascota === 'Ave') {
          mascotas.push(mascota);
        }
      });
  
      mascotasMamiferos.forEach(mascota => {
        if (mascota.tipoMascota === 'Mamifero') {
          mascotas.push(mascota);
        }
      });
  
      // Asignar claves únicas basadas en el id de cada mascota
      const mascotasConClavesUnicas = mascotas.map((mascota) => ({
        ...mascota,
        key: mascota.id.toString(), // Usar id como clave única (convertido a string)
      }));
  
      // Verificar cambios antes de actualizar el estado
      if (mascotasConClavesUnicas.length !== this.state.mascotas.length) {
        this.setState({ mascotas: mascotasConClavesUnicas, loading: false, error: null });
      } else {
        this.setState({ loading: false, error: null });
      }
    } catch (error) {
      console.error('Error al obtener las mascotas:', error);
      this.setState({ loading: false, error });
    }
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
        return {}; // Retorna un objeto vacío si no se encuentra el tipo de mascota
    }
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
            {mascotas.map((mascota) => {
              const avatarMap = this.getAvatarMap(mascota.tipoMascota);
              return (
                <TouchableOpacity key={mascota.key} style={styles.card}>
                  <Image source={avatarMap[mascota.avatar]} style={styles.avatar} />
                  <Text style={styles.cardText}>{mascota.nombreMascota}  </Text>
                </TouchableOpacity>
              );
            })}
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
