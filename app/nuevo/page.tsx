import ProtectedRoute from '@/components/ProtectedRoute';
import NuevoProyectoPage from './NuevoProyectoPage';

export default function NuevoPage() {
  return (
    <ProtectedRoute>
      <NuevoProyectoPage />
    </ProtectedRoute>
  );
}
