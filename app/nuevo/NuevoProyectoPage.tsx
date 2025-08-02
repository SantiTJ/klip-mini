// File: /app/nuevo/NuevoProyectoPage.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { subirArchivo } from '@/components/UploadFile';
import { toast } from 'sonner';

export default function NuevoProyectoPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Debes estar logueado');
      return;
    }

    setCargando(true);
    try {
      let archivoUrl: string | null = null;
      if (archivo) {
        archivoUrl = await subirArchivo(archivo, user.uid);
      }

      await addDoc(collection(db, 'projects'), {
        nombre,
        descripcion,
        archivoUrl,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });

      toast.success('Proyecto creado');
      router.push('/proyectos');
    } catch (err) {
      console.error(err);
      toast.error('Error al crear el proyecto');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-lg text-black">
      <h1 className="text-2xl font-bold mb-6">Nuevo Proyecto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block font-semibold mb-1">
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="block font-semibold mb-1">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="archivo" className="block font-semibold mb-1">
            Archivo (opcional)
          </label>
          <input
            id="archivo"
            type="file"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {cargando ? 'Creando…' : 'Crear Proyecto'}
        </button>
      </form>
    </div>
  );
}