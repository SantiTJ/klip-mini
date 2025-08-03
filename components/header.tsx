'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="text-xl font-bold text-primary">
          Klip Mini SaaS
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Mini avatar con la inicial, o emoji */}
              <span className="w-9 h-9 rounded-full flex items-center justify-center bg-blue-100 text-blue-700 font-bold text-lg shadow">
                {user.displayName?.charAt(0).toUpperCase() ?? '👤'}
              </span>
              <span className="text-gray-700 font-semibold hidden sm:inline">
                {user.displayName || user.email}
              </span>
              <Button
                onClick={logout}
                className="ml-2"
                size="sm"
                variant="outline"
              >
                Cerrar sesión
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="default">
                Iniciar sesión
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
