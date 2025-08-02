// File: /app/proyectos/page.tsx
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
          const data = doc.data();
          proyectosData.push({
            id: doc.id,
            nombre: data.nombre,
            descripcion: data.descripcion,
            archivoUrl: data.archivoUrl ?? undefined,
          });
        });

        setProyectos(proyectosData);
      } catch (error: unknown) {
        console.error('Error al cargar proyectos:', error);
      } finally {
        setCargando(false);
      }
    }

    if (!loading) {
      cargarProyectos();
    }
  }, [user, loading]);

  if (loading || cargando) {
    return <p className="text-center mt-10">Cargando proyectos…</p>;
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
