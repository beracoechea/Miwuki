// ConsultasFirebase.js

import { getFirestore, doc, getDoc, updateDoc,getDocs,collection } from 'firebase/firestore';
import appFirebase from '../Firebase/credenciales';

const firestore = getFirestore(appFirebase);

export async function guardarUsuario({ nombre, apellidos, telefono, email }) {
  try {
    await updateDoc(doc(firestore, 'Usuarios', email), { nombre, apellidos, telefono });
  } catch (error) {
    throw error; // Propagamos el error para manejarlo en el componente que llama a esta función
  }
}

export async function obtenerDatosUsuario(email) {
  try {
    const userDoc = await getDoc(doc(firestore, 'Usuarios', email));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    throw error; // Propagamos el error para manejarlo en el componente que llama a esta función
  }
}
export async function actualizarComidaPerro(emailUsuario, tipoComida) {
  try {
    const usuarioDocRef = doc(firestore, 'Usuarios', emailUsuario); // Utiliza el email del usuario como ID
    await updateDoc(usuarioDocRef, {
      ultimaComida: tipoComida,
    });
  } catch (error) {
    throw error; // Propaga el error para manejarlo en el componente que llama a esta función
  }
}

export async function obtenerMascotasUsuario(email) {
  try {
    const mascotasRef = collection(firestore, 'Usuarios', email, 'Mascotas');
    const mascotasSnapshot = await getDocs(mascotasRef);

    const mascotas = [];
    mascotasSnapshot.forEach((doc) => {
      mascotas.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return mascotas;
  } catch (error) {
    throw error;
  }
}


// Puedes definir otras funciones de Firebase que necesites aquí
