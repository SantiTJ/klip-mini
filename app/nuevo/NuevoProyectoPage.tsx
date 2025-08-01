  'use client';

  import { useState } from 'react';
  import { useRouter } from 'next/navigation';
  import { useAuth } from '@/context/AuthContext';
  import { createProject } from '@/lib/project';

  export default function NuevoProyectoPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [archivo, setArchivo] = useState<File | null>(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (!user) {
        setError('No hay usuario autenticado.');
        return;
      }

      if (!nombre || !archivo) {
        setError('El nombre y el archivo son obligatorios.');
        return;
      }

      try {
        await createProject(user, {
          nombre,
          descripcion,
          archivo,
        });

        router.push('/proyectos');
      } catch (err) {
        console.error(err);
        setError('Error al crear el proyecto.');
      }
    };

    return (
      <div className="max-w-xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Nuevo Proyecto</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre del proyecto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <textarea
            placeholder="Descripción (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="file"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setArchivo(e.target.files[0]);
              }
            }}
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Crear Proyecto
          </button>
        </form>
      </div>
    );
  }
