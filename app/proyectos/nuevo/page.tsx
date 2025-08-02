'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createProject } from '@/lib/project';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ChangeEvent, useState } from 'react';

export default function NuevoProyectoPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setArchivo(e.target.files?.[0] ?? null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Debes estar logueado');
      return;
    }
    if (!archivo) {
      toast.error('Debes seleccionar un archivo');
      return;
    }

    setIsSubmitting(true);
    try {
      await createProject(user, { nombre, descripcion, archivo });
      toast.success('Proyecto creado');
      router.push('/proyectos');
    } catch (err) {
      console.error(err);
      toast.error('Error al crear el proyecto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-lg text-black">
      <h1 className="text-2xl font-bold mb-6">Nuevo Proyecto</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block font-semibold mb-1">
            Nombre
          </label>
          <Input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block font-semibold mb-1">
            Descripción
          </label>
          <Textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        {/* Archivo */}
        <div>
          <label htmlFor="archivo" className="block font-semibold mb-1">
            Archivo (PNG, JPG o PDF, max 5MB)
          </label>
          <input
            id="archivo"
            type="file"
            accept="image/png,image/jpeg,application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700"
            required
          />
          <p className="text-gray-500 text-sm mt-1">Máximo 5MB</p>
        </div>

        {/* Botón */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando…' : 'Crear Proyecto'}
        </Button>
      </form>
    </div>
  );
}
