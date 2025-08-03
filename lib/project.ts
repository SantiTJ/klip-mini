// File: /lib/project.ts
import { db } from "@/lib/firebase";
import { subirArchivo } from "@/components/UploadFile";
import { addDoc, collection, serverTimestamp, doc, deleteDoc, getDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { getStorage, ref, deleteObject } from "firebase/storage";

interface ProyectoData {
  nombre: string;
  descripcion: string;
  archivo: File;
}

export async function createProject(user: User, { nombre, descripcion, archivo }: ProyectoData) {
  const url = await subirArchivo(archivo, user.uid);

  await addDoc(collection(db, "projects"), {
    nombre,
    descripcion,
    archivoUrl: url, // minúsculas
    uid: user.uid,
    createdAt: serverTimestamp(),
  });
}

// BORRADO COMPLETO: elimina Firestore y archivo en Storage
export const deleteProject = async (id: string) => {
  try {
    const projectRef = doc(db, "projects", id);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
      throw new Error("Proyecto no encontrado");
    }

    const data = projectSnap.data();
    const archivoUrl = data?.archivoUrl;

    // 1. Elimina el documento en Firestore
    await deleteDoc(projectRef);

    // 2. Elimina el archivo en Storage si existe
    if (archivoUrl) {
      try {
        // Extrae la ruta desde la URL de descarga
        // Ejemplo de URL: https://firebasestorage.googleapis.com/v0/b/klip-mini.firebasestorage.app/o/archivos%2Fuid%2Fnombre.png?alt=media&token=xxxx
        const storage = getStorage();
        const matches = decodeURIComponent(archivoUrl).match(/\/o\/(.+)\?/);
        const storagePath = matches?.[1]; // archivos/uid/nombre.png

        if (storagePath) {
          const fileRef = ref(storage, storagePath);
          await deleteObject(fileRef);
        }
      } catch (storageErr) {
        // Si falla el borrado del archivo, no rompas la app
        console.warn("No se pudo borrar el archivo en Storage:", storageErr);
      }
    }
  } catch (error) {
    console.error("Error eliminando el proyecto:", error);
    throw error;
  }
};
