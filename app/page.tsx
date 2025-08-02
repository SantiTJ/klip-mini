// app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  // Al montar este componente, redirigimos a /login
  redirect('/login');
}
