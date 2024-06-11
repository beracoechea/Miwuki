import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TouchableOpacity, TextInput, StyleSheet, Image, Platform, KeyboardAvoidingView, Keyboard, ScrollView } from 'react-native';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import appFirebase from './credenciales';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import avatarMap from './ImagenesPerros';


// Inicializa Firestore
const firestore = getFirestore(appFirebase);

export default function PerfilPerruno({ route }) {
  const navigation = useNavigation();
  const { email } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [avatar, setAvatar] = useState(require('./images/Avatars/Aleatorio.jpg'));
  const [nombrePerro, setNombrePerro] = useState('');
  const [pesoPerro, setPesoPerro] = useState('');
  const [edadPerro, setEdadPerro] = useState('');
  const [razaPerro, setRazaPerro] = useState('');
  const [selectedAvatarName, setSelectedAvatarName] = useState('Aleatorio.jpg');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [generoPerro, setGeneroPerro] = useState('');
  const [genderSelected, setGenderSelected] = useState(null);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

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

  // Función para habilitar o deshabilitar el botón de guardar según el estado de los campos obligatorios
  useEffect(() => {
    if (nombrePerro && pesoPerro && edadPerro && razaPerro && generoPerro && selectedAvatarName !== 'Aleatorio.jpg') {
      setSaveButtonDisabled(false);
    } else {
      setSaveButtonDisabled(true);
    }
  }, [nombrePerro, pesoPerro, edadPerro, razaPerro, generoPerro , selectedAvatarName]);

  const handleAvatarPress = (avatarName) => {
    setAvatar(avatarMap[avatarName]);
    setSelectedAvatarName(avatarName);
    setModalVisible(false);
  };

  const handleSaveButtonPress = async () => {
    try {
      if (!nombrePerro || !pesoPerro || !edadPerro || !razaPerro || !generoPerro) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      await setDoc(doc(firestore, 'Perros', email), {
        nombrePerro,
        pesoPerro,
        edadPerro,
        razaPerro,
        avatar: selectedAvatarName,
        sexo: generoPerro
      });


      navigation.navigate('Menu', { email: email });

    } catch (error) {
      console.error('Error al guardar los datos del perro:', error);
      alert('Error al guardar los datos del perro. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const handleGenderButtonPress = async (gender) => {
    try {
      setGeneroPerro(gender);
      await setDoc(doc(firestore, 'Perros', email), { sexo: gender });
      setGenderSelected(gender);
    } catch (error) {
      console.error('Error al guardar el género del perro:', error);
      alert('Error al guardar el género del perro. Por favor, inténtalo de nuevo más tarde.');
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
          <TextInput
            style={[styles.input, keyboardVisible && styles.inputFocused]}
            placeholder="Nombre del perro"
            value={nombrePerro}
            onChangeText={setNombrePerro}
          />
          <TextInput
            style={[styles.input, keyboardVisible && styles.inputFocused]}
            placeholder="Peso"
            value={pesoPerro}
            keyboardType="numeric"
            onChangeText={setPesoPerro}
          />
          <TextInput
            style={[styles.input, keyboardVisible && styles.inputFocused]}
            placeholder="Edad en años"
            value={edadPerro}
            keyboardType="numeric"
            onChangeText={setEdadPerro}
          />
          <TextInput
            style={[styles.input, keyboardVisible && styles.inputFocused]}
            placeholder="Raza"
            value={razaPerro}
            onChangeText={setRazaPerro}
          />
          <View style={styles.genderContainer}>
            <TouchableOpacity onPress={() => handleGenderButtonPress('masculino')}>
              <MaterialCommunityIcons name="gender-male" size={40} color={genderSelected === 'masculino' ? '#007BFF' : '#000'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleGenderButtonPress('femenino')}>
              <MaterialCommunityIcons name="gender-female" size={40} color={genderSelected === 'femenino' ? 'pink' : '#000'} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.saveButton, saveButtonDisabled && styles.saveButtonDisabled]} // Aplicar estilo deshabilitado si el botón está deshabilitado
            onPress={handleSaveButtonPress}
            disabled={saveButtonDisabled} // Habilitar o deshabilitar el botón según el estado
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
    {Object.keys(avatarMap).map((avatarName, index) => (
      <TouchableOpacity key={index} onPress={() => handleAvatarPress(avatarName)}>
        <Image source={avatarMap[avatarName]} style={styles.avatarOption} />
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>
      </Modal>
    </ScrollView>
  );
}

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
    height: '75%', // Ajusta la altura del overlay
    width: '85%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
    position: 'relative', // Posición relativa para poder posicionar el icono sobre el avatar
  },
  overlayKeyboardVisible: {
    paddingTop: 100, // Ajusta el padding superior para dejar espacio para el teclado
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
    height:'120%',
  },
  infoContainerKeyboardVisible: {
    marginTop: 'auto', // Desplaza los inputs hacia arriba cuando el teclado está visible
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#fff', // Color del texto en campos de entrada
  },
  inputFocused: {
    borderColor: '#000', // Color del borde cuando el input está en foco
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
});