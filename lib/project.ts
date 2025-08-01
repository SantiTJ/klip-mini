// lib/project.ts
import { db } from "@/lib/firebase";
import { subirArchivo } from "@/components/UploadFile";
import { addDoc, collection, serverTimestamp, doc, deleteDoc } from "firebase/firestore";
import { User } from "firebase/auth";

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
    archivoURL: url,
    uid: user.uid,
    createdAt: serverTimestamp(),
  });
}

export const deleteProject = async (id: string) => {
  try {
    const projectRef = doc(db, "projects", id);
    await deleteDoc(projectRef);
  } catch (error) {
    console.error("Error eliminando el proyecto:", error);
    throw error;
  }
};
