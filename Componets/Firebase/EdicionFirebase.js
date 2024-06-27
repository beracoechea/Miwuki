import { FIREBASE_DB } from './credenciales'; // Ajusta la ruta según la estructura de tu proyecto
import { doc, updateDoc } from 'firebase/firestore';

export const editarDatosUsuario = async (email, newData) => {
  try {
    const userDoc = doc(FIREBASE_DB, 'Usuarios', email);
    await updateDoc(userDoc, newData);
    console.log('Datos actualizados en Firebase');
  } catch (error) {
    console.error('Error al actualizar los datos en Firebase:', error);
    throw error; // Puedes manejar este error según tu aplicación (mostrar alertas, etc.)
  }
};
