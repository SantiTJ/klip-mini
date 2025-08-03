'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

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
    return (
      <div className="flex items-center justify-center my-16">
        <svg className="animate-spin h-8 w-8 text-gray-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span className="text-lg">Cargando proyecto…</span>
      </div>
    );
  }

  if (!proyecto) {
    return <p className="text-center mt-10">No se encontró el proyecto.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg text-black space-y-6">
      <h1 className="text-2xl font-bold">{proyecto.nombre}</h1>
      <p>{proyecto.descripcion}</p>

      {/* PREVIEW DE ARCHIVO - SIEMPRE MUESTRA LA IMAGEN SI EXISTE archivoUrl */}
      {proyecto.archivoUrl && (
        <div className="my-4">
          <div className="relative max-w-xs max-h-48 mb-2">
            <Image
              src={proyecto.archivoUrl}
              alt="Archivo del proyecto"
              width={400}
              height={200}
              className="rounded shadow border object-contain"
            />
          </div>
        </div>
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
