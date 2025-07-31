'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AuthContextType = {
  user: string | null;
  loading: boolean;
  login: (user: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Nuevo estado

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false); // Ya terminó de intentar cargar el usuario
  }, []);

  const login = (user: string) => {
    localStorage.setItem('user', user);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthContextProvider');
  return context;
};
