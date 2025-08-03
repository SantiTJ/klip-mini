'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link href="/">
          <span className="text-xl font-bold cursor-pointer">Klip Mini</span>
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" passHref>
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <Link href="/proyectos" passHref>
                <Button variant="outline" size="sm">Proyectos</Button>
              </Link>
              <Button variant="destructive" size="sm" onClick={() => logout()}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button variant="default" size="sm">Login</Button>
              </Link>
              <Link href="/register" passHref>
                <Button variant="outline" size="sm">Registro</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
