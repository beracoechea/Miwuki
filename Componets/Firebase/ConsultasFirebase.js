// ConsultasFirebase.js

import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import appFirebase from '../Firebase/credenciales';

const firestore = getFirestore(appFirebase);

export async function guardarUsuario({ nombre, apellidos, telefono, email }) {
  try {
    await updateDoc(doc(firestore, 'Usuarios', email), { nombre, apellidos, telefono });
    console.log('Usuario guardado exitosamente en Firestore');
  } catch (error) {
    console.error('Error al guardar usuario en Firestore:', error);
    throw error; // Propagamos el error para manejarlo en el componente que llama a esta función
  }
}

export async function obtenerDatosUsuario(email) {
  try {
    const userDoc = await getDoc(doc(firestore, 'Usuarios', email));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log('No se encontraron datos para el usuario');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener datos del usuario desde Firestore:', error);
    throw error; // Propagamos el error para manejarlo en el componente que llama a esta función
  }
}
export async function actualizarComidaPerro(emailUsuario, tipoComida) {
  try {
    const usuarioDocRef = doc(firestore, 'Usuarios', emailUsuario); // Utiliza el email del usuario como ID
    await updateDoc(usuarioDocRef, {
      ultimaComida: tipoComida,
    });
    console.log(`Se actualizó la comida del usuario con email "${emailUsuario}" a: ${tipoComida}`);
  } catch (error) {
    console.error('Error al actualizar comida del usuario en Firestore:', error);
    throw error; // Propaga el error para manejarlo en el componente que llama a esta función
  }
}

// Puedes definir otras funciones de Firebase que necesites aquí
