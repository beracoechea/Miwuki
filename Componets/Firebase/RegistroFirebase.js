import { getFirestore, doc, setDoc, collection } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Importa los métodos necesarios de auth
import appFirebase from './credenciales';

const firestore = getFirestore(appFirebase);
const auth = getAuth(appFirebase); // Obtén el servicio de autenticación

export const guardarMascota = async ({ email, tipoMascota, nombreMascota, pesoMascota, edadMascota, razaMascota, avatar, sexo, tamaño }) => {
  try {
    // Obtener referencia al documento del usuario
    const usuarioRef = doc(firestore, 'Usuarios', email);

    // Obtener referencia al documento de la mascota utilizando el nombre de la mascota como ID (o puedes generar un ID automático)
    const mascotaRef = doc(collection(usuarioRef, 'Mascotas'), nombreMascota);

    // Guardar los datos de la mascota en Firestore
    await setDoc(mascotaRef, {
      tipoMascota,
      nombreMascota,
      pesoMascota,
      edadMascota,
      razaMascota,
      avatar,
      sexo,
      tamaño,
    });

    console.log('Datos de la mascota guardados exitosamente en Firestore');
  } catch (error) {
    console.error('Error al guardar los datos de la mascota:', error);
    throw error;
  }
};




export const guardarUsuario = async ({ nombre, apellidos, telefono, email }) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado. Por favor, inicia sesión.');
    }

    // Guardar los datos del usuario en Firestore
    await setDoc(doc(firestore, 'Usuarios', email), {
      nombre,
      apellidos,
      telefono,
      email,
      fechaCreacion: new Date().toISOString(),
    });

    console.log('Usuario registrado exitosamente en Firestore');
  } catch (error) {
    console.error('Error al guardar los datos del usuario:', error);
    throw error;
  }
};

// Función para iniciar sesión (si es necesario)
export const iniciarSesion = async ({ email, password }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Inicio de sesión exitoso');
    return userCredential.user;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};
