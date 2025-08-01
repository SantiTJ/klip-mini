// lib/uploadFile.ts
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export async function subirArchivo(archivo: File, uid: string): Promise<string> {
  const storage = getStorage();
  const archivoRef = ref(storage, `archivos/${uid}/${archivo.name}`);
  const uploadTask = uploadBytesResumable(archivoRef, archivo);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      null,
      (error) => {
        console.error('Error al subir el archivo:', error);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}
