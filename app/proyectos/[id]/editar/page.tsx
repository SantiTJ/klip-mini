'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { subirArchivo } from '@/components/UploadFile';
import { toast } from 'sonner';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  nombre: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  descripcion: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede superar 1000 caracteres'),
});
type FormData = z.infer<typeof schema>;

export default function EditarProyectoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [archivo, setArchivo] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const docRef = doc(db, 'projects', id as string);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        toast.error('Proyecto no encontrado');
        return router.push('/proyectos');
      }
      const data = snap.data() as any;
      setValue('nombre', data.nombre);
      setValue('descripcion', data.descripcion);
    })();
  }, [id, user, router, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error('Debes estar logueado');
      return;
    }
    try {
      const docRef = doc(db, 'projects', id as string);
      const updateData: any = {
        nombre: data.nombre,
        descripcion: data.descripcion,
      };

      if (archivo) {
        if (archivo.size > 5_000_000) {
          toast.error('El archivo supera 5MB');
          return;
        }
        const tipos = ['image/png', 'image/jpeg', 'application/pdf'];
        if (!tipos.includes(archivo.type)) {
          toast.error('Formato inválido (PNG, JPG o PDF)');
          return;
        }
        updateData.archivoUrl = await subirArchivo(archivo, user.uid);
      }

      await updateDoc(docRef, updateData);
      toast.success('Proyecto actualizado');
      router.push(`/proyectos/${id}`);
    } catch (err) {
      console.error(err);
      toast.error('Error al actualizar el proyecto');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-lg text-black">
      <h1 className="text-2xl font-bold mb-6">Editar Proyecto</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block font-semibold mb-1">
            Nombre
          </label>
          <input
            id="nombre"
            {...register('nombre')}
            className="w-full px-4 py-2 border rounded"
          />
          {errors.nombre && (
            <p className="text-red-600 text-sm mt-1">{errors.nombre.message}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block font-semibold mb-1">
            Descripción
          </label>
          <textarea
            id="descripcion"
            {...register('descripcion')}
            className="w-full px-4 py-2 border rounded"
          />
          {errors.descripcion && (
            <p className="text-red-600 text-sm mt-1">{errors.descripcion.message}</p>
          )}
        </div>

        {/* Archivo */}
        <div>
          <label htmlFor="archivo" className="block font-semibold mb-1">
            Nuevo archivo (PNG, JPG o PDF, max 5MB)
          </label>
          <input
            id="archivo"
            type="file"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            className="w-full"
          />
          <p className="text-gray-500 text-sm mt-1">Máximo 5MB</p>
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
