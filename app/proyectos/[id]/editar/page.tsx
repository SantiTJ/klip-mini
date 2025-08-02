// File: /app/[id]/editar/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
// ↳ corregido: viene de components, no de lib
import { subirArchivo } from '@/components/UploadFile';

export default function EditarProyectoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, 'projects', id as string);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          alert('Proyecto no encontrado.');
          router.push('/proyectos');
          return;
        }

        const data = docSnap.data();
        setNombre(data.nombre || '');
        setDescripcion(data.descripcion || '');
      } catch (error) {
        console.error('Error al cargar proyecto:', error);
        alert('Error al cargar el proyecto.');
        router.push('/proyectos');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setCargando(true);
      const docRef = doc(db, 'projects', id as string);

      const updateData: Partial<{
        nombre: string;
        descripcion: string;
        archivoUrl: string;
      }> = { nombre, descripcion };

      if (archivo) {
        const archivoUrl = await subirArchivo(archivo, user.uid);
        updateData.archivoUrl = archivoUrl;
      }

      await updateDoc(docRef, updateData);
      router.push(`/proyectos/${id}`);
    } catch (error) {
      console.error('Error al actualizar el proyecto:', error);
      alert('Error al actualizar el proyecto.');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return <p className="text-center mt-10">Cargando proyecto…</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white text-black shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Editar Proyecto</h1>
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
          {cargando ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
