import { FIREBASE_DB } from './credenciales'; // Ajusta la ruta según la estructura de tu proyecto
import { doc, updateDoc } from 'firebase/firestore';


export const editarDatosUsuario = async (email, newData) => {
  try {
    const userDoc = doc(FIREBASE_DB, 'Usuarios', email);
    await updateDoc(userDoc, newData);
  } catch (error) {
    throw error; // Puedes manejar este error según tu aplicación (mostrar alertas, etc.)
  }
};

export const actualizarDatosMascota = async (email, mascotaId, newData) => {
  try {
    const mascotaDoc = doc(FIREBASE_DB, 'Usuarios', email, 'Mascotas', mascotaId);
    await updateDoc(mascotaDoc, newData);
  } catch (error) {
    throw error; // Puedes manejar este error según tu aplicación (mostrar alertas, etc.)
  }
};



