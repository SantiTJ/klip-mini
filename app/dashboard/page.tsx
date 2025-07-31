'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div>
        <h1>Bienvenido al Dashboard</h1>
        <p>Usuario autenticado: <strong>{user}</strong></p>
        <button onClick={logout}>Cerrar sesión</button>
      </div>
    </ProtectedRoute>
  );
}
