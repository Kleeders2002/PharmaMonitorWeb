import React from 'react';
import { Link } from 'react-router-dom';

const AccesoProhibido: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-6 py-12">
      <div className="text-center max-w-2xl w-full space-y-8">
        <div className="animate-pulse">
          <svg 
            className="mx-auto h-24 w-24 text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          <span className="text-red-600">403</span> - Acceso Prohibido
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          No tienes los permisos necesarios para acceder a este recurso.
        </p>
        
        <div className="flex justify-center">
          <Link 
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent 
              text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 
              transition-colors duration-200 transform hover:scale-105 focus:outline-none 
              focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccesoProhibido;