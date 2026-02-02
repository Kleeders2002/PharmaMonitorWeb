import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

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
  const { user, isAuthenticated, isLoading } = useAuth();

  // Estados de renderizado
  if (isLoading) {
    return <div className="loading-container">Cargando...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Verificar rol - el backend devuelve user.rol (no user.idrol)
  const userRol = user.idrol || user.rol;
  if (roles && userRol && !roles.includes(userRol)) {
    return <Navigate to="/AccesoProhibido" replace />;
  }

  // Pasar el usuario al componente
  return React.createElement(Element, { ...rest, user });
};

export default ProtectedRoute;