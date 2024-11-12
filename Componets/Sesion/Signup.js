// Signup.js
import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Alerts, { ALERT_TYPES } from '../Alerts/Alerts'; // Ajusta la ruta según sea necesario
import { registerWithEmailAndPassword } from '../Firebase/Authfirebase'; // Importamos las funciones de Firebase

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar u ocultar la contraseña
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Estado para habilitar/deshabilitar el botón de registro
  const [alert, setAlert] = useState({ type: null, message: '' }); // Estado para la alerta
  const navigation = useNavigation();

  useEffect(() => {
    // Verifica si los campos están vacíos o la contraseña no tiene al menos 6 caracteres
    setIsButtonDisabled(!(email && password && password.length >= 6));
  }, [email, password]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert({ type: null, message: '' }); // Limpiar la alerta después de 3 segundos
    }, 3000);

    return () => clearTimeout(timer); // Limpiar el timer al desmontar el componente
  }, [alert]);

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Cambia el estado para mostrar u ocultar la contraseña
  };

  const handleSignup = async () => {
    if (!email || !password) {
      setAlert({ type: ALERT_TYPES.ERROR, message: 'Por favor ingrese un correo electrónico y una contraseña válidos.' });
      return;
    }

    try {
      await registerWithEmailAndPassword(email, password);
      navigation.navigate('PerfilUsuario', { email: email });
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setAlert({ type: ALERT_TYPES.WARNING, message: 'Este correo electrónico ya está registrado. Por favor, inicie sesión o utilice otro correo electrónico.' });
      } else {
        setAlert({ type: ALERT_TYPES.ERROR, message: 'Error al registrar el usuario. Por favor, inténtelo de nuevo más tarde.' });
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Registro</Text>
        <Text style={styles.passwordRequirement}>Por motivos de seguridad, la contraseña debe contener al menos 6 caracteres.</Text>
        <View style={styles.userIconContainer}>
          <View style={styles.circle}>
            <FontAwesome5 name="dog" color="#fff" size={50} style={styles.icon} />
          </View>
        </View>
        {alert.type && (
        <Alerts type={alert.type} message={alert.message} onClose={() => setAlert({ type: null, message: '' })} />
    )}

        <View style={styles.inputContainer}>
          <MaterialIcons name="pets" size={20} color="#fff" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={handleEmailChange}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="pets" size={20} color="#fff" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="Contraseña"
            secureTextEntry={!showPassword} // Usa secureTextEntry con el estado showPassword
          />
          <TouchableOpacity onPress={handleTogglePasswordVisibility} style={styles.passwordVisibilityButton}> 
            <MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={20} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.button, isButtonDisabled && styles.disabledButton]} onPress={handleSignup} disabled={isButtonDisabled}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  overlay: {
    height: '80%',
    width: '95%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  userIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 70,
    backgroundColor: '#008080',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 20,
    color: '#fff',
  },
  passwordVisibilityButton: {
    position: 'absolute',
    right: 0,
    paddingRight: 20,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#008080',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },

  passwordRequirement: {
    color: '#fff',
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});
