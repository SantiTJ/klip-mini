"use client";

import { deleteProject } from "@/lib/project";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProjectCardProps {
  id: string;
  nombre: string;
  descripcion: string;
}

const ProjectCard = ({ id, nombre, descripcion }: ProjectCardProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Seguro que quieres eliminar este proyecto?")) return;
    try {
      setLoading(true);
      await deleteProject(id);
      router.refresh(); // Recarga los datos de la página
    } catch (error) {
      alert("Error al eliminar el proyecto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-black rounded-lg shadow-md p-4 w-full max-w-xs">
      <h2 className="text-xl font-bold mb-2">{nombre}</h2>
      <p className="text-sm mb-4">{descripcion}</p>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
      >
        {loading ? "Eliminando..." : "Eliminar"}
      </button>
    </div>
  );
};

export default ProjectCard;
