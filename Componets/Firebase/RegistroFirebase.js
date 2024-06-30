import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import appFirebase from './credenciales';

const firestore = getFirestore(appFirebase);

export const guardarMascota = async ({ email, tipoMascota, nombreMascota, pesoMascota, edadMascota, razaMascota, avatar, sexo }) => {
  try {
    // Obtener referencia al documento del usuario
    const usuarioRef = doc(firestore, 'Usuarios', email);

    // Obtener referencia al documento de la mascota utilizando el nombre de la mascota como ID
    const mascotaRef = doc(collection(usuarioRef, 'Mascotas'));

    // Guardar los datos de la mascota en Firestore
    await setDoc(mascotaRef, {
      tipoMascota,
      nombreMascota,
      pesoMascota,
      edadMascota,
      razaMascota,
      avatar,
      sexo,
    });

  } catch (error) {
    console.error('Error al guardar los datos de la mascota:', error);
    throw error;
  }
};



export const guardarUsuario = async ({ nombre, apellidos, telefono, email }) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No se pudo autenticar al usuario.');
    }

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
