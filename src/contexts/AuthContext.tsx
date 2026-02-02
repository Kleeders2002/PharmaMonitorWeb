import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api';
import { AxiosError } from 'axios';

interface User {
  idusuario: number;
  email: string;
  nombre: string;
  apellido: string;
  idrol: number;
  foto?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await api.get('/check-auth');
      if (response.data.authenticated && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Llamar al backend para eliminar cookies
      await api.post('/logout');
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar estado local PRIMERO
      setUser(null);

      // Limpiar TODOS los datos de almacenamiento local
      localStorage.clear();
      sessionStorage.clear();

      // Forzar recarga COMPLETA de la aplicación
      // Esto elimina TODA la memoria de React, estado, caché, etc.
      window.location.replace('/login');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    checkAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
