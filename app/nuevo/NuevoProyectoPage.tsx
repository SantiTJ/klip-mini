"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createProject } from "@/lib/project";

export default function NuevoProyectoPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !archivo) return;

    try {
      setLoading(true);
      await createProject(user, { nombre, descripcion, archivo });
      router.push("/proyectos");
    } catch (error) {
      alert("Error al crear el proyecto.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Nuevo Proyecto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border px-3 py-2 rounded text-black"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border px-3 py-2 rounded text-black"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Archivo</label>
          <input
            type="file"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            className="w-full"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear Proyecto"}
        </button>
      </form>
    </div>
  );
}
