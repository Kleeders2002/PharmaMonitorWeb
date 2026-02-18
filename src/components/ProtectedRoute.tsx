import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';

interface ProtectedRouteProps {
  element: React.ComponentType<any>;
  roles?: number[];
}

interface User {
  sub: string;
  rol: number;
  exp: number;
  nombre: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element: Element, roles, ...rest }) => {
  const [authState, setAuthState] = useState<{
    loading: boolean;
    user: User | null;
    error: boolean;
  }>({ loading: true, user: null, error: false });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const checkAuth = async () => {
      try {
        const { data } = await api.get('/check-auth', {
          signal: controller.signal,
          timeout: 10000 // 10 segundos de timeout
        });

        if (isMounted) {
          if (data.authenticated) {
            setAuthState({
              loading: false,
              user: data.user,
              error: false
            });
          } else {
            setAuthState({
              loading: false,
              user: null,
              error: true
            });
          }
        }
      } catch (error) {
        if (isMounted) {
          setAuthState({
            loading: false,
            user: null,
            error: true
          });
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Estados de renderizado
  if (authState.loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  if (authState.error || !authState.user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(authState.user.rol)) {
    return <Navigate to="/AccesoProhibido" replace />;
  }

  // FIX: Casting del componente para evitar error de tipos
  return React.createElement(Element, { ...rest, user: authState.user });
};

export default ProtectedRoute;
