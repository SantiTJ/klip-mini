// File: /app/proyectos/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { ref as storageRef, getStorage, deleteObject } from 'firebase/storage';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

interface Proyecto {
  nombre: string;
  descripcion: string;
  archivoUrl?: string;
}

export default function ProyectoDetallePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [borrando, setBorrando] = useState(false);

  useEffect(() => {
    const cargarProyecto = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'projects', id as string);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          alert('Proyecto no encontrado.');
          return router.push('/proyectos');
        }
        setProyecto(docSnap.data() as Proyecto);
      } catch (err) {
        console.error(err);
        alert('Error al cargar el proyecto.');
        router.push('/proyectos');
      } finally {
        setCargando(false);
      }
    };
    cargarProyecto();
  }, [id, user]);

  const handleDeleteArchivo = async () => {
    if (!proyecto?.archivoUrl) return;
    if (!confirm('¿Eliminar archivo adjunto?')) return;

    setBorrando(true);
    try {
      // 1. Eliminar del storage
      const storage = getStorage();
      const url = proyecto.archivoUrl;
      // extraemos la ruta en Storage desde la URL pública
      const path = decodeURIComponent(url.split('/o/')[1].split('?')[0]);
      const fileRef = storageRef(storage, path);
      await deleteObject(fileRef);

      // 2. Eliminar el campo en Firestore
      const docRef = doc(db, 'projects', id as string);
      await updateDoc(docRef, { archivoUrl: deleteField() });

      // 3. Actualizar estado local para re-render
      setProyecto(prev => prev ? { ...prev, archivoUrl: undefined } : null);
    } catch (err) {
      console.error('Error al eliminar archivo:', err);
      alert('No se pudo eliminar el archivo.');
    } finally {
      setBorrando(false);
    }
  };

  if (cargando) {
    return <p className="text-center mt-10">Cargando proyecto…</p>;
  }
  if (!proyecto) {
    return <p className="text-center mt-10">No se encontró el proyecto.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg text-black space-y-6">
      <h1 className="text-2xl font-bold">{proyecto.nombre}</h1>
      <p>{proyecto.descripcion}</p>

      {proyecto.archivoUrl ? (
        <div className="flex items-center space-x-4">
          <a
            href={proyecto.archivoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Ver archivo adjunto
          </a>
          <button
            onClick={handleDeleteArchivo}
            disabled={borrando}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            {borrando ? 'Eliminando…' : 'Eliminar archivo'}
          </button>
        </div>
      ) : null}

      <div className="flex space-x-4">
        <button
          onClick={() => router.push(`/proyectos/${id}/editar`)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Editar
        </button>
        <button
          onClick={() => router.push('/proyectos')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
