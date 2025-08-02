// File: /app/proyectos/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

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
        const docRef = doc(db, 'projects', id as string);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          toast.error('Proyecto no encontrado');
          router.push('/proyectos');
          return;
        }

        setProyecto(docSnap.data() as Proyecto);
      } catch (error) {
        console.error('Error al cargar proyecto:', error);
        toast.error('Error al cargar el proyecto');
        router.push('/proyectos');
      } finally {
        setCargando(false);
      }
    };

    cargarProyecto();
  }, [id, user, router]);

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

      {proyecto.archivoUrl && (
        <a
          href={proyecto.archivoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-600 underline hover:text-blue-800"
        >
          Ver archivo adjunto
        </a>
      )}

      <div className="flex space-x-4">
        <Button variant="default" onClick={() => router.push(`/proyectos/${id}/editar`)}>
          Editar
        </Button>
        <Button variant="outline" onClick={() => router.push('/proyectos')}>
          Volver
        </Button>
      </div>
    </div>
  );
}
