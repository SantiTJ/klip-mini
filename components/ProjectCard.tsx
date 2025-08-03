'use client';

import { deleteProject } from '@/lib/project';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProjectCardProps {
  id: string;
  nombre: string;
  descripcion: string;
  /** URL del archivo adjunto, si existe */
  archivoUrl?: string;
  onDeleted?: () => void;
}

export default function ProjectCard({
  id,
  nombre,
  descripcion,
  archivoUrl,
  onDeleted,
}: ProjectCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('¿Seguro que quieres eliminar este proyecto?')) {
      toast('Eliminación cancelada', { description: 'Tu proyecto sigue ahí.' });
      return;
    }

    try {
      setLoading(true);
      await deleteProject(id);
      toast.success('Proyecto eliminado');
      onDeleted?.();
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    router.push(`/proyectos/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white text-black rounded-lg shadow-md p-4 w-full max-w-xs cursor-pointer hover:bg-gray-100 transition"
    >
      <h2 className="text-xl font-bold mb-2">{nombre}</h2>
      <p className="text-sm mb-4">{descripcion}</p>
      {archivoUrl && (
        <a
          href={archivoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-600 underline hover:text-blue-800 mb-4"
        >
          Ver archivo
        </a>
      )}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        {loading ? 'Eliminando...' : 'Eliminar'}
      </button>
    </div>
  );
}
