// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import { AuthContextProvider } from '../context/AuthContext';

export const metadata = {
  title: 'KLIP',
  description: 'Tu descripción',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  )
}
