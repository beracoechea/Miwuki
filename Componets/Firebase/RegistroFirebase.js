import { getFirestore, doc, setDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Importa los métodos necesarios de auth
import appFirebase from './credenciales';


const firestore = getFirestore(appFirebase);
const auth = getAuth(appFirebase); // Obtén el servicio de autenticación



export const registrarVacuna = async ({ email, mascotaId, nombre, dosis }) => {
  try {
    // Referencia al documento de la mascota dentro de la colección del usuario
    const mascotaRef = doc(firestore, 'Usuarios', email, 'Mascotas', mascotaId);

    // Subcolección de vacunas dentro del documento de la mascota
    const vacunasCollectionRef = collection(mascotaRef, 'Vacunas');

    // Generar un ID automático para la nueva vacuna
    const nuevaVacunaRef = doc(vacunasCollectionRef);

    // Guardar los datos de la vacuna en Firestore
    await setDoc(nuevaVacunaRef, {
      fechaAplicacion: new Date().toISOString(),
      nombre,
      dosis,
    });

  } catch (error) {
    throw error;
  }
};

export const registrarOperacion = async ({ email, mascotaId, fecha, detalles, tratamientos }) => {
  try {
    // Referencia al documento de la mascota dentro de la colección del usuario
    const mascotaRef = doc(firestore, 'Usuarios', email, 'Mascotas', mascotaId);

    // Subcolección de operaciones dentro del documento de la mascota
    const operacionesCollectionRef = collection(mascotaRef, 'Operaciones');

    // Generar un ID automático para la nueva operación
    const nuevaOperacionRef = doc(operacionesCollectionRef);

    // Guardar los datos de la operación en Firestore
    await setDoc(nuevaOperacionRef, {
      fecha,
      detalles,
      tratamientos,
      fechaRegistro: new Date().toISOString(), // Fecha de registro para la operación
    });

  } catch (error) {
    throw error;
  }
};


export const guardarMascota = async ({ email, nombreMascota, pesoMascota, edadMascota, razaMascota, avatar, sexo, tamaño }) => {
  try {
    // Obtener referencia al documento del usuario
    const usuarioRef = doc(firestore, 'Usuarios', email);

    // Obtener referencia al documento de la mascota utilizando el nombre de la mascota como ID (o puedes generar un ID automático)
    const mascotaRef = doc(collection(usuarioRef, 'Mascotas'), nombreMascota);

    // Guardar los datos de la mascota en Firestore
    await setDoc(mascotaRef, {
      nombreMascota,
      pesoMascota,
      edadMascota,
      razaMascota,
      avatar,
      sexo,
      tamaño,
    });

  } catch (error) {
    throw error;
  }
};




export const guardarUsuario = async ({ nombre, apellidos, telefono, email }) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado. Por favor, inicia sesión.');
    }
    await setDoc(doc(firestore, 'Usuarios', email), {
      nombre,
      apellidos,
      telefono,
      email,
      fechaCreacion: new Date().toISOString(),
    });

    
  } catch (error) {
   
    throw error;
  }
};
