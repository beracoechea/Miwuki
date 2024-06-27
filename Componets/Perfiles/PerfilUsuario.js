import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput, StyleSheet, ScrollView, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { guardarUsuario } from '../Firebase/RegistroFirebase';
import Alerts, { ALERT_TYPES } from '../Alerts/Alerts';
import Ionicons  from 'react-native-vector-icons/Ionicons'; // Asegúrate de importar el icono adecuado

export default function UserRegistrationForm({ route }) {
  const navigation = useNavigation();
  const { email } = route.params;
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null); // Estado para rastrear el input enfocado
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' });

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
    // Limpiar la alerta después de 3 segundos si está visible
    if (alert.visible) {
      const timer = setTimeout(() => {
        setAlert({ visible: false, type: '', message: '' });
      }, 1000);

      return () => clearTimeout(timer); // Limpiar el timeout al desmontar el componente
    }
  }, [alert]);

  const handleSaveButtonPress = async () => {
    let alertMessage = '';
    let alertType = '';

    if (!nombre.trim() || !apellidos.trim() || !telefono) {
      alertMessage = 'Por favor, completa todos los campos.   ';
      alertType = ALERT_TYPES.WARNING;
    } else if (!validarTelefono(telefono)) {
      alertMessage = 'El número de teléfono debe tener exactamente 10 dígitos y contener solo números.      ';
      alertType = ALERT_TYPES.ERROR;
    } else if (!validarNombreApellido(nombre) || !validarNombreApellido(apellidos)) {
      alertMessage = 'El nombre y apellidos deben contener solo caracteres alfabéticos.         ';
      alertType = ALERT_TYPES.ERROR;
    } else {
      try {
        await guardarUsuario({ nombre, apellidos, telefono, email });
        alertMessage = 'Información guardada exitosamente.      ';
        alertType = ALERT_TYPES.INFO;

        setTimeout(() => {
          navigation.navigate('Menu', { email:email });
        }, 2000); // Navegar después de 2 segundos 

      } catch (error) {
        console.error('Error al guardar los datos del usuario:', error);
        alertMessage = 'Error al guardar los datos del usuario. Por favor, inténtalo de nuevo más tarde.       ';
        alertType = ALERT_TYPES.ERROR;
      }
    }

    setAlert({
      visible: true,
      type: alertType,
      message: alertMessage,
    });
  };

  const validarTelefono = (telefono) => {
    return /^\d{10}$/.test(telefono); // Validar que el número de teléfono tenga exactamente 10 dígitos y solo números
  };

  const validarNombreApellido = (texto) => {
    return /^[a-zA-Z\s]+$/.test(texto); // Validar que solo contiene caracteres alfabéticos y espacios
  };

  const handleInputFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.overlay, keyboardVisible && styles.overlayKeyboardVisible]}>
        <View style={[styles.infoContainer, keyboardVisible && styles.infoContainerKeyboardVisible]}>
          <View style={styles.userIconContainer}>
            {!focusedInput && <Ionicons name="person-circle-outline" size={100} color="#007BFF" />}
          </View>
          <TextInput
            style={[styles.input, focusedInput === 'nombre' && styles.inputFocused]}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
            onFocus={() => handleInputFocus('nombre')}
            onBlur={handleInputBlur}
          />
          <TextInput
            style={[styles.input, focusedInput === 'apellidos' && styles.inputFocused]}
            placeholder="Apellidos"
            value={apellidos}
            onChangeText={setApellidos}
            onFocus={() => handleInputFocus('apellidos')}
            onBlur={handleInputBlur}
          />
          <TextInput
            style={[styles.input, focusedInput === 'telefono' && styles.inputFocused]}
            placeholder="Teléfono"
            value={telefono}
            keyboardType="phone-pad"
            onChangeText={setTelefono}
            onFocus={() => handleInputFocus('telefono')}
            onBlur={handleInputBlur}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveButtonPress}
          >
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
      {alert.visible && <Alerts type={alert.type} message={alert.message} onClose={() => this.setState({ alertMessage: '' })} />}
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
  overlay: {
    height: '75%',
    width: '85%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayKeyboardVisible: {
    paddingTop: 100,
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainerKeyboardVisible: {
    marginTop: 'auto',
  },
  userIconContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#fff',
  },
  inputFocused: {
    borderColor: '#007BFF',
    borderWidth: 2,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginTop: 20,
    alignItems: 'center',
    width: '50%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
