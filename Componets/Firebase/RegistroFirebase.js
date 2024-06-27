import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import appFirebase from './credenciales';

const firestore = getFirestore(appFirebase);
const auth = getAuth(appFirebase);

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
