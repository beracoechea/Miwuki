import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Modal, StyleSheet, Image, ScrollView, TextInput, Alert } from 'react-native';
import { getFirestore, doc, getDocs, collection, addDoc,getDoc,updateDoc } from 'firebase/firestore';


import appFirebase from './Componets/Firebase/credenciales';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';


import avatarMap from './ImagenesPerros';

// Inicializa Firestore


const firestore = getFirestore(appFirebase);

export default class Cartilla extends Component {
  state = {
    perro: {
      nombrePerro: '',
      edadPerro: '',
      razaPerro: '',
      pesoPerro: '',
      avatar: 'Aleatorio.jpg',
    },
    vacunas: [],
    cirugias: [], 
    modalVisible: false, // <- Aquí se establece inicialmente en false
    nuevaVacuna: {
      nombre: '',
      fechaAplicacion: '',
      proximaAplicacion: '',
      dosis: '',
    },
    nuevaCirugia: {
      nombre: '',
      fecha: '',
      detalle: ''
    },
    vacunaEditId: null,
    modalEditarVisible: false,
    nombreVacunaEdit: '',
    fechaAplicacionEdit: '',
    proximaAplicacionEdit: '',
    dosisEdit: '',
    
    cirugiaEditId: null,
    modalEditarCirugiaVisible: false, // <- Aquí se establece inicialmente en false
    nombreCirugiaEdit: '',
    fechaCirugiaEdit: '',
    detalleCirugiaEdit: '',
    modalCirugiaVisible:false,
  };

  

 
  editarVacuna = async () => {
    const { vacunaEditId, fechaAplicacionEdit, proximaAplicacionEdit, dosisEdit } = this.state;
    const { email } = this.props.route.params;
  
    // Validar que vacunaEditId esté definido
    if (!vacunaEditId) {
      console.error('Error: vacunaEditId is undefined');
      return;
    }
  
    // Validar que los campos no estén vacíos
    if (!fechaAplicacionEdit || !proximaAplicacionEdit || !dosisEdit) {
      Alert.alert('Error', 'Por favor complete todos los campos.');
      return;
    }
  
    // Validar que las fechas tengan exactamente 8 caracteres
    if (fechaAplicacionEdit.length !== 8 || proximaAplicacionEdit.length !== 8) {
      Alert.alert('Error', 'Las fechas deben contener exactamente 8 caracteres.');
      return;
    }
  
    // Validar que no se agreguen caracteres especiales en las fechas y dosis
    const regex = /^[a-zA-Z0-9]*$/;
    if (!regex.test(fechaAplicacionEdit) || !regex.test(proximaAplicacionEdit) || !regex.test(dosisEdit)) {
      Alert.alert('Error', 'No se permiten caracteres especiales en las fechas y dosis.');
      return;
    }
  
    try {
      const db = getFirestore(appFirebase);
      const vacunaRef = doc(db, `Perros/${email}/Vacunas/${vacunaEditId}`);
      await updateDoc(vacunaRef, {
        fechaAplicacion: fechaAplicacionEdit,
        proximaAplicacion: proximaAplicacionEdit,
        dosis: dosisEdit,
      });
      // Actualizar la lista de vacunas
      this.actualizarVacunas();
      // Cerrar el modal de edición
      this.setState({ modalEditarVisible: false });
    } catch (error) {
      console.error('Error al editar la vacuna: ', error);
      Alert.alert('Error', 'Hubo un problema al editar la vacuna. Por favor, inténtalo de nuevo.');
    }
  };
  
  handleEditarVacuna = (vacuna) => {
    this.setState({
      vacunaEditId: vacuna.id,
      fechaAplicacionEdit: vacuna.fechaAplicacion,
      proximaAplicacionEdit: vacuna.proximaAplicacion,
      dosisEdit: vacuna.dosis,
      modalEditarVisible: true
    });
  };
  
  registrarVacuna = async () => {
    const { nuevaVacuna } = this.state;
    const { email } = this.props.route.params;
  
    // Validar campos vacíos
    for (const key in nuevaVacuna) {
      if (!nuevaVacuna[key]) {
        Alert.alert('Error', 'Por favor complete todos los campos.');
        return;
      }
    }
  
    // Validar caracteres especiales en todos los campos
    for (const key in nuevaVacuna) {
      if (/[^\w\s]/.test(nuevaVacuna[key])) {
        Alert.alert('Error', `El campo "${key}" contiene caracteres especiales no permitidos.`);
        return;
      }
    }
  
    // Validar longitud exacta de la fecha
    if (nuevaVacuna.fechaAplicacion.length !== 8 || nuevaVacuna.proximaAplicacion.length !== 8) {
      Alert.alert('Error', 'La fecha debe tener exactamente 8 caracteres (DD/MM/YYYY).');
      return;
    }
  
    try {
      const db = getFirestore(appFirebase);
      const vacunasRef = collection(db, `Perros/${email}/Vacunas`);
      await addDoc(vacunasRef, nuevaVacuna);
  
      // Actualizamos la lista de vacunas
      this.actualizarVacunas();
  
      // Limpiamos el estado
      this.setState({
        nuevaVacuna: {
          nombre: '',
          fechaAplicacion: '',
          proximaAplicacion: '',
          dosis: ''
        },
        modalVisible: false
      });
    } catch (error) {
      console.error('Error al agregar la vacuna: ', error);
      Alert.alert('Error', 'Hubo un problema al agregar la vacuna. Por favor, inténtalo de nuevo.');
    }
  };

  actualizarVacunas = async () => {
    try {
      const { email } = this.props.route.params;
      const db = getFirestore(appFirebase);
      const vacunasRef = collection(db, `Perros/${email}/Vacunas`);
      const querySnapshot = await getDocs(vacunasRef);
      const vacunas = [];
      querySnapshot.forEach(doc => {
        vacunas.push({ ...doc.data(), id: doc.id }); // Se corrigió el acceso a los datos del documento
      });
      this.setState({ vacunas });
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al obtener las vacunas. Por favor, inténtalo de nuevo.');
    }
  };
  
  registrarCirugia = async () => {
    const { nuevaCirugia } = this.state;
    const { email } = this.props.route.params;
  
    // Validar que ningún campo esté vacío
    for (const key in nuevaCirugia) {
      if (!nuevaCirugia[key]) {
        Alert.alert('Error', 'Por favor complete todos los campos.');
        return;
      }
    }
  
    // Validar caracteres especiales en el campo de detalle
    if (/[^\w\s]/.test(nuevaCirugia.detalle)) {
      Alert.alert('Error', 'El campo de detalle contiene caracteres especiales no permitidos.');
      return;
    }
  
    try {
      const db = getFirestore(appFirebase);
      const cirugiasRef = collection(db, `Perros/${email}/Cirugias`);
      await addDoc(cirugiasRef, nuevaCirugia);
  
      // Actualizamos la lista de cirugías/operaciones
      this.actualizarCirugias();
  
      // Limpiamos el estado
      this.setState({
        nuevaCirugia: {
          nombre: '',
          fecha: '',
          detalle: ''
        },
        modalCirugiaVisible: false
      });
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al agregar la cirugía. Por favor, inténtalo de nuevo.');
    }
  };

  
  
  actualizarCirugias = async () => {
    try {
      const { email } = this.props.route.params;
      const db = getFirestore(appFirebase);
      const cirugiasRef = collection(db, `Perros/${email}/Cirugias`);
      const querySnapshot = await getDocs(cirugiasRef);
      const cirugias = [];
      querySnapshot.forEach(doc => {
        cirugias.push({ ...doc.data(), id: doc.id });
      });
      this.setState({ cirugias });
    } catch (error) {
      console.error('Error obteniendo los documentos de cirugías/operaciones: ', error);
      Alert.alert('Error', 'Hubo un problema al obtener las cirugías/operaciones. Por favor, inténtalo de nuevo.');
    }
  };
  handleEditarCirugia = (cirugia) => {
    this.setState({
      cirugiaEditId: cirugia.id,
      nombreCirugiaEdit: cirugia.nombre,
      fechaCirugiaEdit: cirugia.fecha,
      detalleCirugiaEdit: cirugia.detalle,
      modalEditarCirugiaVisible: true
    });
  };
  editarCirugia = async () => {
    const { cirugiaEditId, nombreCirugiaEdit, fechaCirugiaEdit, detalleCirugiaEdit } = this.state;
    const { email } = this.props.route.params;
  
    // Validar que cirugiaEditId esté definido
    if (!cirugiaEditId) {
      console.error('Error: cirugiaEditId is undefined');
      return;
    }
  
    // Validar que los campos no estén vacíos
    if (!nombreCirugiaEdit || !fechaCirugiaEdit || !detalleCirugiaEdit) {
      Alert.alert('Error', 'Por favor complete todos los campos.');
      return;
    }
  
    // Validar que la fecha tenga exactamente 8 caracteres
    if (fechaCirugiaEdit.length !== 8) {
      Alert.alert('Error', 'La fecha debe contener exactamente 8 caracteres.');
      return;
    }
  
    // Validar que no se agreguen caracteres especiales en el nombre, fecha y detalle
    const regex = /^[a-zA-Z0-9\s]*$/;
    if (!regex.test(nombreCirugiaEdit) || !regex.test(fechaCirugiaEdit) || !regex.test(detalleCirugiaEdit)) {
      Alert.alert('Error', 'No se permiten caracteres especiales en el nombre, fecha y detalle.');
      return;
    }
  
    try {
      const db = getFirestore(appFirebase);
      const cirugiaRef = doc(db, `Perros/${email}/Cirugias/${cirugiaEditId}`);
      await updateDoc(cirugiaRef, {
        nombre: nombreCirugiaEdit,
        fecha: fechaCirugiaEdit,
        detalle: detalleCirugiaEdit
      });
      // Actualizar la lista de cirugías
      this.actualizarCirugias();
      // Cerrar el modal de edición
      this.setState({ modalEditarCirugiaVisible: false });
    } catch (error) {
      console.error('Error al editar la cirugía: ', error);
      Alert.alert('Error', 'Hubo un problema al editar la cirugía. Por favor, inténtalo de nuevo.');
    }
  };

  componentDidMount() {
    this.getPerroData();
    this.actualizarVacunas();
    this.actualizarCirugias();
  }
// Método para mostrar el modal de registro de cirugías
showModalCirugia = () => {
  this.setState({ modalCirugiaVisible: true });
};

  // Método para obtener los datos del perro
  getPerroData = async () => {
    const { email } = this.props.route.params;
    try {
      const perroDoc = await getDoc(doc(firestore, `Perros/${email}`)); // Cambiar doc(firestore, ...) a getDoc(doc(firestore, ...))
      if (perroDoc.exists()) {
        const data = perroDoc.data();
        this.setState({ perro: data }); // Actualizar el estado del perro
      }
    } catch (error) {
      console.error('Error al obtener los datos del perro:', error);
    }
  };

  onChangeDate = (selectedDate) => {
    const currentDate = selectedDate || this.state.nuevaVacuna.fechaAplicacion;
    this.setState({ nuevaVacuna: { ...this.state.nuevaVacuna, fechaAplicacion: currentDate } });
  };

  onChangeDateProxima = (selectedDate) => {
    const currentDate = selectedDate || this.state.nuevaVacuna.proximaAplicacion;
    this.setState({ nuevaVacuna: { ...this.state.nuevaVacuna, proximaAplicacion: currentDate } });
  };

  render() {
    const { perro, vacunas, cirugias } = this.state;

    
   
  
    return (
      <ScrollView style={styles.container}>
        {/* Perfil del perro */}
        <LinearGradient
          colors={['#8B4513', '#FFFFFF', '#ADD8E6']}
          style={styles.gradient}
        >
          <View style={styles.avatarContainer}>
            <Image source={avatarMap[perro.avatar || 'Aleatorio.jpg']} style={styles.avatar} />
            <View style={styles.infoContainer}>
              <View style={styles.editableField}>
                <Text style={styles.infoTextName}>{perro.nombrePerro}</Text>
                {perro.sexo === 'masculino' ? (
                  <FontAwesome5 name="mars" size={20} color="blue" style={styles.genderIcon} />
                ) : (
                  <FontAwesome5 name="venus" size={20} color="pink" style={styles.genderIcon} />
                )}
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.editableFieldText}>{perro.razaPerro}</Text>
                <Text style={styles.editableFieldText}>{perro.edadPerro} años</Text>
                <Text style={styles.editableFieldText}>{perro.pesoPerro} kg</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
  
        {/* Agregar vacuna */}
        <TouchableOpacity style={styles.agregarButton} onPress={() => this.setState({ modalVisible: true })}>
          <MaterialCommunityIcons name="book" size={24} color="#654321" />
          <Text style={styles.agregarButtonText}>Agregar Vacuna</Text>
        </TouchableOpacity>

        {/* Agregar Operacion*/}
        <TouchableOpacity style={styles.agregarButton} onPress={this.showModalCirugia}>
          <MaterialCommunityIcons name="hospital" size={24} color="#654321" />
          <Text style={styles.agregarButtonText}>Agregar Cirugía/Operación</Text>
        </TouchableOpacity>
  
        {/* Lista de vacunas */}
        <Text style={styles.subtitulo}>Vacunas Registradas:</Text>
        <ScrollView style={styles.scrollContainer}>
          {vacunas.map((vacuna) => (
            <TouchableOpacity
              key={vacuna.id}
              style={styles.vacunaContainer}
              onPress={() => this.handleEditarVacuna(vacuna)}
            >
              <Text style={styles.vacunaNombre}>Nombre: {vacuna.nombre}</Text>
              <View style={styles.fechaProximaContainer}>
                <Text style={styles.fechaProxima}>Próxima Fecha: {moment(vacuna.proximaAplicacion, 'DD/MM/YYYY').format('DD/MM/YYYY')}</Text>
              </View>
              <View style={styles.fechaAdminContainer}>
                <Text style={styles.fechaAdmin}>Fecha de Administración: {moment(vacuna.fechaAplicacion, 'DD/MM/YYYY').format('DD/MM/YYYY')}</Text>
              </View>
              <View style={styles.fechaAdminContainer}>
                <Text style={styles.fechaAdmin}>Dosis: {vacuna.dosis} ml</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Lista de cirugías */}
        <Text style={styles.subtitulo}>Cirugías/Operaciones Registradas:</Text>
        <ScrollView style={styles.scrollContainer}>
      {cirugias.map((cirugia) => (
        <TouchableOpacity
          key={cirugia.id}
          style={styles.vacunaContainer}
          onPress={() => this.handleEditarCirugia(cirugia)} // Activar la edición de la cirugía
        >
          <Text style={styles.vacunaNombre}>Nombre: {cirugia.nombre}</Text>
          <Text style={styles.fechaAdmin}>Fecha: {moment(cirugia.fecha, 'DD/MM/YYYY').format('DD/MM/YYYY')}</Text>
          <Text style={styles.fechaAdmin}>Detalle: {cirugia.detalle}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  
        {/* Modal para agregar vacuna */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false });
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Título del modal */}
              <Text style={styles.modalTitle}>Registrar Vacuna</Text>
  
              <TextInput
                style={styles.input}
                placeholder="Nombre de la vacuna"
                onChangeText={(text) => this.setState({ nuevaVacuna: { ...this.state.nuevaVacuna, nombre: text } })}
              />
  
                <TextInput
                style={styles.input}
                placeholder="Aplicación (DD/MM/YYYY)"
                keyboardType="numeric"
                onChangeText={(text) => this.setState({ nuevaVacuna: { ...this.state.nuevaVacuna, fechaAplicacion: text.substring(0, 8) } })}
                value={this.state.nuevaVacuna.fechaAplicacion}
                maxLength={8} // Esto limita el máximo de caracteres que se pueden ingresar
              />
  
                <TextInput
                style={styles.input}
                placeholder="PróximaAplicación(DD/MM/YYYY)"
                keyboardType="numeric"
                onChangeText={(text) => this.setState({ nuevaVacuna: { ...this.state.nuevaVacuna, proximaAplicacion: text.substring(0, 8) } })}
                value={this.state.nuevaVacuna.proximaAplicacion}
                maxLength={8} // Esto limita el máximo de caracteres que se pueden ingresar
              />
              <TextInput
                style={styles.input}
                placeholder="Dosis (ml)"
                keyboardType="numeric"
                onChangeText={(text) => this.setState({ nuevaVacuna: { ...this.state.nuevaVacuna, dosis: text } })}
              />
  
              {/* Botones de acción */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => this.setState({ modalVisible: false })}>
                  <MaterialCommunityIcons name="archive-cancel" size={30} color="#FF0000" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={this.registrarVacuna}>
                  <FontAwesome5 name="save" size={30} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal para agregar operacion */}
        <Modal
        
  animationType="slide"
  transparent={true}
  visible={this.state.modalCirugiaVisible}
  onRequestClose={() => {
    this.setState({ modalCirugiaVisible: false });
  }}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Agregar Cirugía/Operación</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de la cirugía"
        onChangeText={(text) => this.setState({ nuevaCirugia: { ...this.state.nuevaCirugia, nombre: text } })}
      />

      <TextInput
        style={styles.input}
        placeholder="Fecha de la cirugía (DD/MM/YYYY)"
        keyboardType="numeric" // Agrega esta línea para permitir solo caracteres numéricos
        onChangeText={(text) => this.setState({ nuevaCirugia: { ...this.state.nuevaCirugia, fecha: text.substring(0, 8) } })}
        maxLength={8}
      />
      <TextInput
        style={styles.input}
        placeholder="Detalle de la cirugía"
        onChangeText={(text) => this.setState({ nuevaCirugia: { ...this.state.nuevaCirugia, detalle: text } })}
      />

      {/* Botones de acción */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => this.setState({ modalCirugiaVisible: false })}>
          <MaterialCommunityIcons name="archive-cancel" size={30} color="#FF0000" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={this.registrarCirugia}>
          <FontAwesome5 name="save" size={30} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
        </Modal>
  
        {/* Modal para editar vacuna */}
        <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalEditarVisible}
              onRequestClose={() => {
                this.setState({ modalEditarVisible: false });
              }}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Editar Vacuna</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nueva fecha de aplicación (DD/MM/YYYY)"
                    keyboardType="numeric"
                    onChangeText={(text) => this.setState({ fechaAplicacionEdit: text.substring(0,8) })}
                    value={this.state.fechaAplicacionEdit}
                    maxLength={8}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Nueva próxima aplicación (DD/MM/YYYY)"
                    keyboardType="numeric"
                    onChangeText={(text) => this.setState({ proximaAplicacionEdit: text.substring(0,8) })}
                    value={this.state.proximaAplicacionEdit}
                    maxLength={8}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Nueva dosis (ml)"
                    keyboardType="numeric"
                    onChangeText={(text) => this.setState({ dosisEdit: text })}
                    value={this.state.dosisEdit}
                  />

                  {/* Botones de acción */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => this.setState({ modalEditarVisible: false })}>
                      <MaterialCommunityIcons name="archive-cancel" size={30} color="#FF0000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={this.editarVacuna}>
                      <FontAwesome5 name="save" size={30} color="#4CAF50" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
        </Modal>
            {/* Modal para editar operacion */}
                    <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalEditarCirugiaVisible}
              onRequestClose={() => {
                this.setState({ modalEditarCirugiaVisible: false });
              }}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Editar Cirugía/Operación</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Nuevo nombre de la cirugía"
                    onChangeText={(text) => this.setState({ nombreCirugiaEdit: text })}
                    value={this.state.nombreCirugiaEdit}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Nueva fecha de la cirugía (DD/MM/YYYY)"
                    keyboardType="numeric" // Agrega esta línea para permitir solo caracteres numéricos
                    onChangeText={(text) => this.setState({ fechaCirugiaEdit: text.substring(0,8) })}
                    value={this.state.fechaCirugiaEdit}
                    maxLength={8}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Nuevo detalle de la cirugía"
                    onChangeText={(text) => this.setState({ detalleCirugiaEdit: text })}
                    value={this.state.detalleCirugiaEdit}
                  />

                  {/* Botones de acción */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => this.setState({ modalEditarCirugiaVisible: false })}>
                      <MaterialCommunityIcons name="archive-cancel" size={30} color="#FF0000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={this.editarCirugia}>
                      <FontAwesome5 name="save" size={30} color="#4CAF50" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
      
      </ScrollView>
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
paddingVertical: 10,
},
avatarContainer: {
flexDirection: 'row',
alignItems: 'center',
},
avatar: {
width: 100,
height: 100,
borderRadius: 50,
borderWidth: 2,
borderColor: '#000',
},
infoContainer: {
flex: 1,
marginLeft: 20,
height: 150,
},
editableField: {
borderBottomWidth: 1,
borderColor:'#ccc',
    paddingVertical: 10,
    marginBottom: 3,
  },
  editableFieldText: {
    fontSize: 12,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoTextName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  genderIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginRight: 10,
  },
  infoField: {
    marginRight: 10,
  },

  agregarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE4B5',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  agregarButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#654321',
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#654321',
    marginTop: 10,
    marginLeft: 10,
  },
  scrollContainer: {
    margin: 10,
  },
  vacunaContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  vacunaNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  fechaProxima: {
    fontSize: 14,
    color: '#333',
  },
  fechaAdmin: {
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#F5F5DC',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#654321',
  },
  input: {
    backgroundColor: '#D2B48C',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  datePickerText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#654321',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButton: {
    backgroundColor: '#654321',
  },
  saveButton: {
    backgroundColor: '#654321',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});