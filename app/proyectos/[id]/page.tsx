'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
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

  useEffect(() => {
    const cargarProyecto = async () => {
      if (!user) return;

      try {
        // CORREGIDO: aquí debe decir 'projects' y no 'proyectos'
        const docRef = doc(db, 'projects', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProyecto(docSnap.data() as Proyecto);
        } else {
          alert('Proyecto no encontrado.');
          router.push('/proyectos');
        }
      } catch (error) {
        console.error('Error al cargar proyecto:', error);
        router.push('/proyectos');
      } finally {
        setCargando(false);
      }
    };

    cargarProyecto();
  }, [id, user]);

  if (cargando) return <p className="text-center mt-10">Cargando proyecto...</p>;

  if (!proyecto) return <p className="text-center mt-10">No se encontró el proyecto.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg text-black">
      <h1 className="text-2xl font-bold mb-4">{proyecto.nombre}</h1>
      <p className="mb-6">{proyecto.descripcion}</p>

      {proyecto.archivoUrl && (
        <div className="mt-4">
          <a
            href={proyecto.archivoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Ver archivo adjunto
          </a>
        </div>
      )}
    </div>
  );
}
