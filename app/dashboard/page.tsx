// File: app/dashboard/page.tsx
'use client';

import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';

interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  archivoUrl?: string;
}

function DashboardContent() {
  const { user, logout } = useAuth();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const q = query(
        collection(db, 'projects'),
        where('uid', '==', user.uid)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Proyecto, 'id'>),
      }));
      setProyectos(data);
      setCargando(false);
    })();
  }, [user]);

  if (cargando) return <p className="text-center mt-10">Cargando…</p>;

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => logout()}>
            Cerrar sesión
          </Button>
          <Link href="/proyectos/nuevo" passHref>
            <Button>+ Nuevo Proyecto</Button>
          </Link>
        </div>
      </div>

      {proyectos.length === 0 ? (
        <p className="text-gray-600">Aún no tienes proyectos.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proyectos.map((p) => (
            <ProjectCard
              key={p.id}
              id={p.id}
              nombre={p.nombre}
              descripcion={p.descripcion}
              archivoUrl={p.archivoUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
