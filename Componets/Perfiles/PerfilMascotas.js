import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TouchableOpacity, TextInput, StyleSheet, Image, ScrollView, Keyboard } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import avatarMapPerros from '../TiposMascotas/ImagenesPerros'; 
import avatarMapGatos from '../TiposMascotas/ImagenesGatos';  
import avatarMapAves from '../TiposMascotas/ImagenesAves';
import avatarMapMamiferos from '../TiposMascotas/ImagenesMamiferos';
import { guardarMascota } from '../Firebase/RegistroFirebase';
import { Picker } from '@react-native-picker/picker';
import Alerts, { ALERT_TYPES } from '../Alerts/Alerts';

const PerfilPerruno = ({ route }) => {
  const navigation = useNavigation();
  const { email } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [avatar, setAvatar] = useState(require('../../images/Avatars/Aleatorio.jpg'));
  const [tipoMascota, setTipoMascota] = useState('Perro');
  const [nombreMascota, setNombreMascota] = useState('');
  const [pesoMascota, setPesoMascota] = useState('');
  const [edadMascota, setEdadMascota] = useState('');
  const [razaMascota, setRazaMascota] = useState('');
  const [selectedAvatarName, setSelectedAvatarName] = useState('Aleatorio.jpg');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [generoMascota, setGeneroMascota] = useState('');
  const [tamañoEstatura, setTamañoEstatura] = useState('mediana'); // Ahora es una cadena
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [selectedGender, setSelectedGender] = useState(null);

  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    validateForm();
  }, [nombreMascota, pesoMascota, edadMascota, razaMascota, generoMascota, selectedAvatarName, tamañoEstatura]);

  function validateForm() {
    const formIsValid = nombreMascota && pesoMascota && edadMascota && razaMascota && generoMascota && selectedAvatarName !== 'Aleatorio.jpg' && tamañoEstatura;
    setSaveButtonDisabled(!formIsValid);
  }

  const handleAvatarPress = (avatarName) => {
    const avatarMap = getAvatarMap(tipoMascota);
    setAvatar(avatarMap[avatarName]);
    setSelectedAvatarName(avatarName);
    setModalVisible(false);
  };

  const handleSaveButtonPress = async () => {
    try {
      if (saveButtonDisabled) {
        throw new Error('Por favor, completa todos los campos.');
      }

      await guardarMascota({
        email,
        tipoMascota,
        nombreMascota,
        pesoMascota: parseInt(pesoMascota),
        edadMascota: parseInt(edadMascota),
        razaMascota,
        avatar: selectedAvatarName,
        sexo: generoMascota,
        tamaño: tamañoEstatura, // Ahora se envía como cadena
      });

      navigation.navigate('Menu', { email });

    } catch (error) {
      console.error('Error al guardar los datos de la mascota:', error);
      setAlertType(ALERT_TYPES.ERROR);
      setAlertMessage('Error al guardar los datos de la mascota. Por favor, inténtalo de nuevo más tarde.');
      setAlertVisible(true);
    }
  };

  const handleGenderButtonPress = (gender) => {
    setSelectedGender(gender);
    setGeneroMascota(gender);
  };

  const handleTipoMascotaChange = (itemValue) => {
    setTipoMascota(itemValue);
    const avatarMap = getAvatarMap(itemValue);
    setAvatar(avatarMap['Aleatorio.jpg']);
    setSelectedAvatarName('Aleatorio.jpg');
    setTamañoEstatura('mediana'); // Resetear el tamaño de estatura cuando cambia el tipo de mascota
  };

  const getAvatarMap = (tipo) => {
    switch (tipo) {
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.overlay, keyboardVisible && styles.overlayKeyboardVisible]}>
        <View style={styles.avatarContainer}>
          <Image source={avatar} style={styles.avatar} />
          <TouchableOpacity
            style={styles.changeAvatarButton}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <FontAwesome5 name="user-edit" color="#000" size={20} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={[styles.infoContainer, keyboardVisible && styles.infoContainerKeyboardVisible]}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tipoMascota}
              style={[styles.input, keyboardVisible && styles.inputFocused]}
              onValueChange={(itemValue) => handleTipoMascotaChange(itemValue)}
              mode="dropdown"
            >
              <Picker.Item label="Perro" value="Perro" />
              <Picker.Item label="Gato" value="Gato" />
              <Picker.Item label="Mamifero" value="Mamifero" />
              <Picker.Item label="Ave" value="Ave" />
            </Picker>
          </View>
          <TextInput
            style={[styles.input, keyboardVisible && styles.inputFocused]}
            placeholder="Nombre de la mascota"
            value={nombreMascota}
            onChangeText={setNombreMascota}
          />
          <TextInput
            style={[styles.input, keyboardVisible && styles.inputFocused]}
            placeholder="Peso"
            value={pesoMascota}
            keyboardType="numeric"
            onChangeText={setPesoMascota}
          />
          <TextInput
            style={[styles.input, keyboardVisible && styles.inputFocused]}
            placeholder="Edad en años"
            value={edadMascota}
            keyboardType="numeric"
            onChangeText={setEdadMascota}
          />
          <TextInput
            style={[styles.input, keyboardVisible && styles.inputFocused]}
            placeholder="Raza"
            value={razaMascota}
            onChangeText={setRazaMascota}
          />
          {(tipoMascota === 'Perro' || tipoMascota === 'Gato') && (
            <Picker
              selectedValue={tamañoEstatura}
              style={[styles.input, keyboardVisible && styles.inputFocused]}
              onValueChange={(itemValue) => setTamañoEstatura(itemValue)}
              mode="dropdown"
            >
              <Picker.Item label="Pequeña" value="pequeña" />
              <Picker.Item label="Mediana" value="mediana" />
              <Picker.Item label="Grande" value="grande" />
            </Picker>
          )}
          <View style={styles.genderContainer}>
            <TouchableOpacity onPress={() => handleGenderButtonPress('masculino')}>
              <MaterialCommunityIcons
                name="gender-male"
                size={40}
                color={selectedGender === 'masculino' ? '#007BFF' : '#000'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleGenderButtonPress('femenino')}>
              <MaterialCommunityIcons
                name="gender-female"
                size={40}
                color={selectedGender === 'femenino' ? 'pink' : '#000'}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.saveButton, saveButtonDisabled && styles.saveButtonDisabled]}
            onPress={handleSaveButtonPress}
            disabled={saveButtonDisabled}
          >
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalBackground}>
          <ScrollView contentContainerStyle={styles.modalContainer} horizontal>
            {Object.keys(getAvatarMap(tipoMascota)).map((avatarName, index) => (
              <TouchableOpacity key={index} onPress={() => handleAvatarPress(avatarName)}>
                <Image source={getAvatarMap(tipoMascota)[avatarName]} style={styles.avatarOption} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
      {alertVisible && (
        <Alerts
          type={alertType}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      )}
    </ScrollView>
  );
};

export default PerfilPerruno;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cd966c',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  overlay: {
    height: '75%',
    width: '85%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
    position: 'relative',
  },
  overlayKeyboardVisible: {
    paddingTop: 100,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 125,
    borderRadius: 70,
  },
  infoContainer: {
    width: '100%',
    height: '120%',
  },
  infoContainerKeyboardVisible: {
    marginTop: 'auto',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#fff',
  },
  inputFocused: {
    borderColor: '#000',
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 3,
    right: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 15,
  },
  icon: {
    paddingHorizontal: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    alignItems: 'center',
  },
  avatarOption: {
    margin: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginTop: 3,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
});
