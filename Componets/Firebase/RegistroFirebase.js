import { getFirestore, doc, setDoc, collection } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Importa los métodos necesarios de auth
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

    console.log('Vacuna registrada exitosamente en Firestore');
  } catch (error) {
    console.error('Error al registrar la vacuna en Firestore:', error);
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

    console.log('Operación registrada exitosamente en Firestore');
  } catch (error) {
    console.error('Error al registrar la operación en Firestore:', error);
    throw error;
  }
};


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
