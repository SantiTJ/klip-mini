import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { subirArchivo } from '@/components/UploadFile';
import { User } from 'firebase/auth';

interface ProyectoData {
  nombre: string;
  descripcion: string;
  archivo: File;
}

export async function createProject(user: User, { nombre, descripcion, archivo }: ProyectoData) {
  const url = await subirArchivo(archivo, user.uid);

  await addDoc(collection(db, 'projects'), {
    nombre,
    descripcion,
    archivoURL: url,
    uid: user.uid,
    createdAt: serverTimestamp(),
  });
}
