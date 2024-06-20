// Signup.js
import React, { useState } from 'react';
import { Text, TouchableOpacity, View, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Alerts, { ALERT_TYPES } from '../Alerts/Alerts'; // Ajusta la ruta según sea necesario
import { loginWithEmailAndPassword } from '../Firebase/firebase'; // Importamos la función de login

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ type: null, message: '' }); // Estado para la alerta
  const navigation = useNavigation();

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setAlert({ type: ALERT_TYPES.ERROR, message: 'Por favor ingrese un correo electrónico y una contraseña válidos.' });
      resetAlert();
      return;
    }

    try {
      // Intenta iniciar sesión con las credenciales proporcionadas
      await loginWithEmailAndPassword(email, password);

      // Si la autenticación es exitosa, navega a la pantalla de inicio
      navigation.navigate('Menu', { email: email });
    } catch (error) {
      // Si hay algún error durante la autenticación, muestra un mensaje de error
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setAlert({ type: ALERT_TYPES.ERROR, message: 'Error al iniciar sesión. Comprueba el correo y la contraseña.' });
      } else {
        setAlert({ type: ALERT_TYPES.ERROR, message: 'Error al iniciar sesión. Inténtalo de nuevo más tarde.' });
      }
      resetAlert();
    }
  };

  const resetAlert = () => {
    // Reinicia la alerta después de 3 segundos
    setTimeout(() => {
      setAlert({ type: null, message: '' });
    }, 2000); // 3000 milisegundos = 3 segundos
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <View style={styles.userIconContainer}>
          <View style={styles.circle}>
            <FontAwesome5 name="dog" color="#fff" size={50} style={styles.icon} />
          </View>
        </View>
        {alert.type && (
          <Alerts type={alert.type} message={alert.message} />
        )}
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={20} color="#fff" style={styles.icon} />
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
          <MaterialIcons name="lock" size={20} color="#fff" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={toggleShowPassword} style={styles.passwordVisibilityButton}>
            <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={20} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
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
    borderRadius: 40,
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
});
