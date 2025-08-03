'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import ProjectCard from '@/components/ProjectCard';

interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  archivoUrl?: string;
}

export default function ProyectosPage() {
  const { user, loading } = useAuth();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarProyectos() {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'projects'),
          where('uid', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const proyectosData: Proyecto[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Proyecto;
          proyectosData.push({
            id: doc.id,
            nombre: data.nombre,
            descripcion: data.descripcion,
            archivoUrl: data.archivoUrl ?? undefined,
          });
        });
        setProyectos(proyectosData);
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
      } finally {
        setCargando(false);
      }
    }

    if (!loading) {
      cargarProyectos();
    }
  }, [user, loading]);

  // Loader animado visual
  if (loading || cargando) {
    return (
      <div className="flex flex-col items-center justify-center h-72">
        <svg className="animate-spin h-10 w-10 text-gray-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span className="text-lg font-medium text-gray-600">Cargando tus proyectos…</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Tus Proyectos</h1>

      {proyectos.length === 0 ? (
        <p className="text-gray-600">No has creado ningún proyecto aún.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proyectos.map((proyecto) => (
            <ProjectCard
              key={proyecto.id}
              id={proyecto.id}
              nombre={proyecto.nombre}
              descripcion={proyecto.descripcion}
              archivoUrl={proyecto.archivoUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
