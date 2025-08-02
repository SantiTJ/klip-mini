// File: /app/proyectos/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
// ↳ IMPORT CORREGIDO: ahora apuntamos al directorio raíz de componentes
import ProjectCard from '@/components/ProjectCard';

interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
}

export default function ProyectosPage() {
  const { user } = useAuth();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!user) return;
    const cargarProyectos = async () => {
      setCargando(true);
      try {
        const q = query(
          collection(db, 'projects'),
          where('uid', '==', user.uid),
        );
        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as any),
        }));
        setProyectos(lista);
      } catch (err) {
        console.error('Error al cargar proyectos:', err);
      } finally {
        setCargando(false);
      }
    };
    cargarProyectos();
  }, [user]);

  const handleDeleteLocal = (deletedId: string) => {
    setProyectos(prev => prev.filter(p => p.id !== deletedId));
  };

  if (cargando) {
    return <p className="text-center mt-10">Cargando proyectos…</p>;
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-6">
      {proyectos.map(({ id, nombre, descripcion }) => (
        <ProjectCard
          key={id}
          id={id}
          nombre={nombre}
          descripcion={descripcion}
          onDeleted={() => handleDeleteLocal(id)}
        />
      ))}
      {proyectos.length === 0 && (
        <p className="col-span-full text-center text-gray-500">
          No tienes proyectos todavía.
        </p>
      )}
    </div>
  );
}
