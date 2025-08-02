// File: /app/layout.tsx
'use client';

import { Toaster } from 'sonner';
import { AuthContextProvider } from '@/context/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50">
        {/* Contexto de autenticación envolviendo toda la app */}
        <AuthContextProvider>
          {/* Toasts globales */}
          <Toaster richColors position="top-right" />
          
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
