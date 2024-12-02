import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, Keyboard, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import avatarMapPerros from '../TiposMascotas/ImagenesPerros';
import { guardarMascota } from '../Firebase/RegistroFirebase';
import Alerts, { ALERT_TYPES } from '../Alerts/Alerts';
import AvatarPicker from './AvatarPicker';
import InputForm from './InputForm';
import GenderSelector from './GenderSelector';
import Buttons from './Buttons';

const PerfilPerruno = ({ route }) => {
  const navigation = useNavigation();
  const { email } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [avatar, setAvatar] = useState(require('../../images/Avatars/Aleatorio.jpg'));
  const [formData, setFormData] = useState({
    nombreMascota: '',
    pesoMascota: '',
    edadMascota: '',
    razaMascota: '',
    tamaño: '',
  });
  const [selectedAvatarName, setSelectedAvatarName] = useState('Aleatorio.jpg');
  const [selectedGender, setSelectedGender] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const formIsValid = Object.values(formData).every((value) => value) && 
                      selectedAvatarName !== 'Aleatorio.jpg' && 
                      selectedGender;

  const handleAvatarPress = (avatarName) => {
    const selectedAvatar = avatarMapPerros[avatarName];
    setAvatar(selectedAvatar.image);
    setSelectedAvatarName(avatarName);

    // Actualiza automáticamente la raza y el tamaño en el estado
    setFormData((prevFormData) => ({
      ...prevFormData,
      razaMascota: selectedAvatar.raza,  // Asigna la raza desde el objeto del avatar
      tamaño: selectedAvatar.tamaño,  // Asigna el tamaño desde el objeto del avatar
    }));

    // Opcional: Verifica que los datos se actualicen correctamente
    console.log('Datos actualizados: ', formData);

    setModalVisible(false);
  };

  const handleSaveButtonPress = async () => {
    try {
      // Verifica que todos los campos estén completos
      if (!formIsValid) throw new Error('Por favor, completa todos los campos.');
  
      // Asegúrate de que tamañoEstatura tenga un valor válido
      const tamañoEstaturaValid = formData.tamaño || 'Desconocido'; // Valor por defecto si es undefined o vacío
  
      // Muestra los datos que se enviarán antes de guardarlos
      console.log('Datos a enviar a Firebase:', {
        email,
       
        nombreMascota: formData.nombreMascota,
        pesoMascota: parseInt(formData.pesoMascota),
        edadMascota: parseInt(formData.edadMascota),
        razaMascota: formData.razaMascota,
        avatar: selectedAvatarName,
        sexo: selectedGender,
        tamaño: tamañoEstaturaValid, // Aseguramos que tamañoEstatura tenga un valor válido
      });
  
      await guardarMascota({
        email,
        nombreMascota: formData.nombreMascota,
        pesoMascota: parseInt(formData.pesoMascota),
        edadMascota: parseInt(formData.edadMascota),
        razaMascota: formData.razaMascota,
        avatar: selectedAvatarName,
        sexo: selectedGender,
        tamaño: tamañoEstaturaValid,  // Aseguramos de pasar un valor válido para tamañoEstatura
      });
  
      setFormData({
        nombreMascota: '',
        pesoMascota: '',
        edadMascota: '',
        razaMascota: '',
        tamaño: 'mediana',
      });
      setAvatar(require('../../images/Avatars/Aleatorio.jpg'));
      setSelectedAvatarName('Aleatorio.jpg');
      setSelectedGender(null);
  
      navigation.navigate('Menu', { email });
    } catch (error) {
      console.error('Error al guardar los datos de la mascota:', error);
      setAlertType(ALERT_TYPES.ERROR);
      setAlertMessage('Error al guardar los datos de la mascota. Por favor, inténtalo de nuevo más tarde.');
      setAlertVisible(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.overlay, keyboardVisible && styles.overlayKeyboardVisible]}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image source={avatar} style={styles.avatar} />
          </TouchableOpacity>
          <AvatarPicker
            modalVisible={modalVisible}
            avatarMap={avatarMapPerros}
            onAvatarSelect={handleAvatarPress}
            onClose={() => setModalVisible(false)}
          />
        </View>

        <InputForm formData={formData} setFormData={setFormData} />

        <GenderSelector selectedGender={selectedGender} onGenderSelect={setSelectedGender} />

        <Buttons 
          onSave={handleSaveButtonPress} 
          onCancel={() => navigation.navigate('Menu', { email })} 
          saveDisabled={!formIsValid} 
        />
      </View>

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
  overlay: {
    height: '75%',
    width: '85%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
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
});
