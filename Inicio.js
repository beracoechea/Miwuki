import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Modal, StyleSheet, Image, TextInput,ScrollView, Alert } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc, serverTimestamp} from 'firebase/firestore';
import appFirebase from './Componets/Firebase/credenciales';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import LinearGradient from 'react-native-linear-gradient';

import avatarMap from './ImagenesPerros';
// Inicializa Firestore
const firestore = getFirestore(appFirebase);

export default class Inicio extends Component {
  state = {
    desayunoComio: false,
    almuerzoComio: false,
    cenaComio: false,
    modalVisible: false,
    perro: {
      nombre: '',
      edad: '',
      raza: '',
      peso: '',
    },
    editedParam: '',
    editedValue: '',
  };


  componentDidMount() {
    // Configurar opciones de navegación
    this.props.navigation.setOptions({
      title: 'Perfil del Perro',
    });
    this.getPerroData();
  }

  componentWillUnmount() {
    // Limpiar el intervalo al desmontar el componente
    clearInterval(this.updateInterval);
  }

  getPerroData = async () => {
    const { email } = this.props.route.params;
    try {
      const perroDoc = await getDoc(doc(firestore, 'Perros', email));
      if (perroDoc.exists()) {
        const data = perroDoc.data();
        this.setState({ perro: data }); // Actualizar el estado del perro
      } else {
      }
    } catch (error) {
      console.error('Error al obtener los datos del perro:', error);
    }
  };

  handleEditParam = (param) => {
    this.setState({ editedParam: param, editedValue: this.state.perro[param], modalVisible: true });
  };
  
  saveChanges = async () => {
    const { email } = this.props.route.params;
    const { editedParam, editedValue, perro } = this.state;
  
    const currentValue = perro[editedParam];
  
    if (editedValue !== currentValue) {
      try {
        await updateDoc(doc(firestore, 'Perros', email), { [editedParam]: editedValue });
        // Actualizar el estado del perro solo si se realizó un cambio
        await this.getPerroData();
        this.setState({ modalVisible: false });
      } catch (error) {
        console.error('Error al actualizar los datos del perro:', error);
      }
    } else {
      this.setState({ modalVisible: false });
    }
  };
  


  handleChange = (value) => {
    // Verificar si el valor ingresado es válido
    if (!/^[a-zA-Z0-9\s]*$/.test(value)) {
      Alert.alert("Por favor ingresa caracteres validos");
        return;
    }
  
    // Si es válido, actualizar el estado con el nuevo valor
    this.setState({ editedValue: value });
  };
  

  saveChanges = async () => {
    const { email } = this.props.route.params;
    const { editedParam, editedValue, perro } = this.state;

    const currentValue = perro[editedParam];

    if (editedValue !== currentValue) {
      try {
        await updateDoc(doc(firestore, 'Perros', email), { [editedParam]: editedValue });
        await this.getPerroData();
        this.setState({ modalVisible: false });
      } catch (error) {
        console.error('Error al actualizar los datos del perro:', error);
      }
    } else {
      this.setState({ modalVisible: false });
    }
  };

  handleComidaConsumida = async (tipoComida) => {
    // Lógica para actualizar la base de datos
    const { email } = this.props.route.params;
  
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
  
      // Crear el objeto con las actualizaciones
      const updates = {
        [tipoComida]: true,
        lastFeedTime: serverTimestamp() // Marca el tiempo en que se alimentó al perro
      };
  
      // Actualizar el documento del perro en la base de datos
      await updateDoc(doc(firestore, 'Perros', email), updates);
  
      // Marca como falso el estado de la próxima comida
      await updateDoc(doc(firestore, 'Perros', email), {
        [nextComida]: false
      });
  
      await this.getPerroData(); // Actualiza los datos del perro después de guardar los cambios
  
      // Actualiza el estado correspondiente al botón presionado y al siguiente botón
      this.setState({ ...nextState });
    } catch (error) {
      console.error('Error al actualizar los datos del perro:', error);
    }
  };

  calcularTiempoDePaseo = (pesoPerro) => {
   
    return pesoPerro * 5; 
  }
  Ia=() =>{
    this.props.navigation.navigate('Chatbot');
  }
  render() {
    const { desayuno, almuerzo, cena } = this.state.perro;

    const { perro, modalVisible, editedParam, editedValue } = this.state;

    // Calcula la cantidad óptima de comida según el peso del perro
    let factorDeAlimentacion = 0;

    // Determinar el factor de alimentación basado en la edad del perro
    if (perro.edadPerro <= 1) {
        // Cachorro: factor de alimentación más alto
        factorDeAlimentacion = 5; // Porcentaje del peso corporal
    } else if (perro.edadPerro <= 7) {
        // Adulto joven: factor de alimentación medio
        factorDeAlimentacion = 3; // Porcentaje del peso corporal
    } else {
        // Adulto: factor de alimentación más bajo
        factorDeAlimentacion = 2; // Porcentaje del peso corporal
    }
    const cantidadOptima = (perro.pesoPerro * (factorDeAlimentacion / 100)).toFixed(3); 
    const cantidadOptimaPorComida = (cantidadOptima / 3).toFixed(3);


        // Calcula la cantidad óptima de paseo según el peso del perro
    calcularTiempoDePaseo = (pesoPerro, edadPerro) => {
          let factorDeAlimentacion = 0;
          if (edadPerro <= 1) {
            factorDeAlimentacion = 5; 
          } else if (edadPerro <= 7) {
            factorDeAlimentacion = 3; 
          } else {
            factorDeAlimentacion = 2; 
          }
          return pesoPerro * (factorDeAlimentacion / 100) * 30; 
        }

        const tiempoDePaseo = this.calcularTiempoDePaseo(perro.pesoPerro, perro.edadPerro);


    return (
      <View style={styles.container}>

        {/*Perfil del perro */}
        <LinearGradient
        colors={['#8B4513', '#FFFFFF', '#ADD8E6']}
        style={styles.gradient}  // Aplica el estilo del gradiente al contenedor de información del perro
        >
          <View style={styles.avatarContainer}>
            <Image source={avatarMap[perro.avatar || 'Aleatorio.jpg']} style={styles.avatar} />
            <View style={styles.infoContainer}>
              <TouchableOpacity style={styles.editableField} onPress={() => this.handleEditParam('nombrePerro')}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoTextName}>{perro.nombrePerro}</Text>
                  {perro.sexo === 'masculino' ? (
                    <MaterialCommunityIcons name="gender-male" size={30} color="blue" style={styles.genderIcon} />
                  ) : (
                    <MaterialCommunityIcons name="gender-female" size={30} color="red" style={styles.genderIcon} />
                  )}
                  
                </View>
              </TouchableOpacity>

              <View style={styles.infoRow}>
                <TouchableOpacity style={[styles.editableField, styles.infoField]} onPress={() => this.handleEditParam('razaPerro')}>
                  <Text style={styles.editableFieldText}>{perro.razaPerro}</Text>
                </TouchableOpacity>
                </View>
              <View style={styles.infoRow}>
                <TouchableOpacity style={[styles.editableField, styles.infoField]} onPress={() => this.handleEditParam('edadPerro')}>
                  <Text style={styles.editableFieldText}>{perro.edadPerro} años</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.editableField, styles.infoField]} onPress={() => this.handleEditParam('pesoPerro')}>
                  <Text style={styles.editableFieldText}>{perro.pesoPerro} kg</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.scroll}>
        {/* Titulo comida */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Alimentación</Text>
          <Text style={styles.subheaderText}>Recomendación diaria: {cantidadOptima} kg</Text>
        </View>

        {/* Botones para indicar que el perro ha comido */}
        <View style={styles.infoRow}>
      <TouchableOpacity style={styles.infoField}>
        <View style={styles.buttonRow}>
          <View style={styles.dot} />
          <Text style={styles.buttonText}>Desayuno - 8:00 AM ({cantidadOptimaPorComida} kg)</Text>
          <TouchableOpacity
            style={[styles.button, desayuno && styles.buttonComido]}
            onPress={() => this.handleComidaConsumida('desayuno')} disabled={desayuno} >
            {desayuno ? (
              <MaterialCommunityIcons name="check" size={20} color="#FFF" disabled={true} />
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
          <Text style={styles.buttonText}>Almuerzo - 1:00 PM ({cantidadOptimaPorComida} kg)</Text>
          <TouchableOpacity
            style={[styles.button, almuerzo && styles.buttonComido]}
            onPress={() => this.handleComidaConsumida('almuerzo')}disabled={almuerzo}
          >
            {almuerzo ? (
              <MaterialCommunityIcons name="check" size={20} color="#FFF" disabled={true}/>
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
          <Text style={styles.buttonText}>Cena - 7:00 PM ({cantidadOptimaPorComida} kg)</Text>
          <TouchableOpacity
            style={[styles.button, cena && styles.buttonComido]}
            onPress={() => this.handleComidaConsumida('cena')}disabled={cena}
          >
            {cena ? (
              <MaterialCommunityIcons name="check" size={20} color="#FFF"disabled={true}/>
            ) : (
              <FontAwesome5 name="check" size={20} color="#000" />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>

    

  {/* Botón IA */}
  <View style={styles.containerIA}>
  <Image source={require('./images/Perritos.png')} style={styles.perrito1}></Image>
  <TouchableOpacity style={styles.iaButton} onPress={this.Ia}>
    <SimpleLineIcons name="magic-wand" size={24} style={styles.iaButtonIcon} />
    <Text style={styles.iaButtonText}>   Pregúntale algo a la IA</Text>
  </TouchableOpacity>
  </View>

{/*Paseo del perro */}
  <View style={styles.paseoContainer}>
        <Text style={styles.paseoTitle}>Paseo</Text>
        <View style={styles.innerPaseo}>
          <Text style={styles.paseoText}>Tu mascota necesita pasear: </Text>
          <View style={styles.paseoTimeContainer}>
      <Text style={styles.paseoTime}>{tiempoDePaseo}</Text>
      <Text style={styles.paseoText}> minutos</Text>
    </View>
        </View>
      </View>

      </ScrollView>

        {/* Modal para editar el perfil*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder={editedParam}
              onChangeText={(value) => {
                // Validar que no quede el campo vacío
                if (value.trim() === '') {
                  Alert.alert("Por favor no dejes campos vacios");
                  return;
                }

                // Validar que solo se ingresen números en los campos de años y peso
                if ((editedParam === 'edadPerro' || editedParam === 'pesoPerro') && !/^\d+$/.test(value)) {
                  Alert.alert("Por favor ingresa solo números validos");
                  return;
                }

                // Si pasa todas las validaciones, actualizar el estado
                this.setState({ editedValue: value });
              }}
              value={editedValue}
            />
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => this.setState({ modalVisible: false })}>
                  <MaterialCommunityIcons name="archive-cancel" size={40} color="#FF0000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.saveChanges}>
                  <FontAwesome5 name="save" size={40} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    paddingVertical: 10,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50, // Hacer que la imagen tenga forma de círculo
    borderWidth: 2, // Añadir un borde
    borderColor: '#000',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 20,
    height: 150,
  },
  editableField: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 3,
  },
  editableFieldText: {
    fontSize: 12,
    color: '#333',
  },
  buttonText: {
    fontSize: 10, 
    color: '#000',
    marginRight: 5,
    flex: 1,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Para centrar verticalmente el icono con el nombre
  },
  infoTextName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', 
  },
  genderIcon: {
    marginLeft: 10, // Espacio entre el nombre y el icono
  },
  infoField: {
    flex: 1,
    marginRight: 10,
  },





  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF', // Blanco
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 7,
    paddingHorizontal: 10,
    backgroundColor: '#D2B48C', // Café claro
    color: '#FFFFFF', // Color del texto de los inputs
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  
 


  scroll: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF', // Color de fondo blanco para el resto del contenido
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subheaderText: {
    fontSize: 18,
    color: '#000',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoField: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    color: '#000',
    marginRight: 10,
    flex: 1, // El texto ocupará todo el espacio disponible horizontalmente
    textAlign: 'center', // El texto se alinea en el centro horizontalmente
  },
  button: {
    backgroundColor: '#D2B48C',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonComido: {
    backgroundColor: '#D2B48C',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20, // Ajusta el ancho del botón
    fontWeight: 'bold',
  },
  buttonIcon: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D2B48C',
    marginRight: 10,
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

  paseoContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'brown',
    padding: 10,
    borderRadius: 5,
  },
  innerPaseo: {
    flexDirection: 'column', // Cambia la dirección del diseño a columna
    alignItems: 'center', // Centra los elementos en el eje horizontal
  },
  paseoTimeContainer: {
    flexDirection: 'row', // Alinear los elementos horizontalmente
    alignItems: 'center', // Centrar los elementos verticalmente
  },
  paseoTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 5, // Espacio entre el tiempo y "minutos"
  },
  paseoText: {
    fontSize: 14,
    color: '#000',
  },

});