'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { subirArchivo } from '@/components/UploadFile';
import { toast } from 'sonner';

interface UpdateData {
  nombre: string;
  descripcion: string;
  archivoUrl?: string;
}

export default function EditarProyectoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      if (!user) return;
      try {
        const ref = doc(db, 'projects', id as string);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          toast.error('Proyecto no encontrado');
          return router.push('/proyectos');
        }
        const data = snap.data();
        setNombre(data.nombre);
        setDescripcion(data.descripcion);
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar el proyecto');
        router.push('/proyectos');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Debes estar logueado');
      return;
    }
    setCargando(true);
    try {
      const ref = doc(db, 'projects', id as string);
      const updateData: UpdateData = {
        nombre,
        descripcion,
      };
      if (archivo) {
        updateData.archivoUrl = await subirArchivo(archivo, user.uid);
      }
      await updateDoc(ref, updateData);
      toast.success('Proyecto actualizado');
      router.push(`/proyectos/${id}`);
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar el proyecto');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return <p className="text-center mt-10">Cargando proyecto…</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-lg text-black">
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
            Nuevo archivo (opcional)
          </label>
          <input
            id="archivo"
            type="file"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            className="w-full"
          />
          <p className="text-gray-500 text-sm mt-1">Máximo 5MB, PNG/JPG/PDF</p>
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
