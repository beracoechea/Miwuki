// ConsultasFirebase.js

import { getFirestore, doc, getDoc, updateDoc,getDocs,collection,query,onSnapshot, addDoc,deleteDoc } from 'firebase/firestore';
import appFirebase from '../Firebase/credenciales';

const firestore = getFirestore(appFirebase);

export async function guardarUsuario({ nombre, apellidos, telefono, email }) {
  try {
    await updateDoc(doc(firestore, 'Usuarios', email), { nombre, apellidos, telefono });
  } catch (error) {
    throw error; // Propagamos el error para manejarlo en el componente que llama a esta función
  }
}

// Nuevo método para eliminar la cita

export const eliminarCita = async (emailUsuario, citaId) => { // Agrega emailUsuario como parámetro
  try {
    const citaDoc = doc(firestore, 'Usuarios', emailUsuario, 'Citas', citaId);
    const docSnapshot = await getDoc(citaDoc);

    if (!docSnapshot.exists()) {
      console.log('El documento no existe, no se puede eliminar.');
      return;
    }

    await deleteDoc(citaDoc);
    console.log('Cita eliminada de Firebase');
  } catch (error) {
    console.error('Error al eliminar la cita en Firebase:', error);
    throw error; // Manejo del error según sea necesario
  }
};



export const suscribirACambiosCitas = (emailUsuario, callback) => {
  const citasRef = collection(firestore, 'Usuarios', emailUsuario, 'Citas');
  const q = query(citasRef);

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added' || change.type === 'modified' || change.type === 'removed') {
        callback(change);
      }
    });
  });
};
export async function guardarCita(emailUsuario, cita) {
  try {
    const citasRef = collection(firestore, 'Usuarios', emailUsuario, 'Citas');
    await addDoc(citasRef, cita);
  } catch (error) {
    throw error;
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
export const suscribirACambiosMascotas = (email, callback) => {
  const usuarioRef = doc(firestore, 'Usuarios', email);
  const mascotasRef = collection(usuarioRef, 'Mascotas');

  const q = query(mascotasRef);

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added' || change.type === 'modified' || change.type === 'removed') {
        callback(change);
      }
    });
  });
};

export async function obtenerDatosMascotaPorId(emailUsuario, mascotaId) {
  try {
    const mascotaRef = doc(collection(firestore, 'Usuarios', emailUsuario, 'Mascotas'), mascotaId);
    const mascotaDoc = await getDoc(mascotaRef);

    if (mascotaDoc.exists()) {
      return mascotaDoc.data();
    } else {
      throw new Error('No existe la mascota con el ID proporcionado.');
    }
  } catch (error) {
    throw error;
  }
}

export async function obtenerVacunasMascota(emailUsuario, mascotaId) {
  try {
    const vacunasRef = collection(firestore, 'Usuarios', emailUsuario, 'Mascotas', mascotaId, 'Vacunas');
    const vacunasSnapshot = await getDocs(vacunasRef);

    const vacunas = [];
    vacunasSnapshot.forEach((doc) => {
      vacunas.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return vacunas;
  } catch (error) {
    throw error; // Propaga el error para manejarlo en el componente que llama a esta función
  }
}

// Función para suscribirse a cambios en las vacunas de una mascota
export const suscribirACambiosVacunas = (emailUsuario, mascotaId, callback) => {
  const vacunasRef = collection(firestore, 'Usuarios', emailUsuario, 'Mascotas', mascotaId, 'Vacunas');
  const q = query(vacunasRef);

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added' || change.type === 'modified' || change.type === 'removed') {
        callback(change);
      }
    });
  });
};

export async function obtenerOperacionesMascota(emailUsuario, mascotaId) {
  try {
    const operacionesRef = collection(firestore, 'Usuarios', emailUsuario, 'Mascotas', mascotaId, 'Operaciones');
    const operacionesSnapshot = await getDocs(operacionesRef);

    const operaciones = [];
    operacionesSnapshot.forEach((doc) => {
      operaciones.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return operaciones;
  } catch (error) {
    throw error; // Propaga el error para manejarlo en el componente que llama a esta función
  }
}

// Función para suscribirse a cambios en las operaciones de una mascota
export const suscribirACambiosOperaciones = (emailUsuario, mascotaId, callback) => {
  const operacionesRef = collection(firestore, 'Usuarios', emailUsuario, 'Mascotas', mascotaId, 'Operaciones');
  const q = query(operacionesRef);

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added' || change.type === 'modified' || change.type === 'removed') {
        callback(change);
      }
    });
  });
};


// Puedes definir otras funciones de Firebase que necesites aquí