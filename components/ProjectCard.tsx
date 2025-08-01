'use client';

import { deleteProject } from '@/lib/project';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProjectCardProps {
  id: string;
  nombre: string;
  descripcion: string;
}

const ProjectCard = ({ id, nombre, descripcion }: ProjectCardProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // evita que se dispare el click del contenedor
    const confirmar = confirm('¿Seguro que quieres eliminar este proyecto?');
    if (!confirmar) return;

    try {
      setLoading(true);
      await deleteProject(id);
    } catch (error) {
      alert('Error al eliminar el proyecto.');
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
      <button
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        {loading ? 'Eliminando...' : 'Eliminar'}
      </button>
    </div>
  );
};

export default ProjectCard;
