import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header className="flex justify-between items-center px-4 py-3 bg-white shadow-sm sticky top-0 z-50">
      {/* Logo y menú */}
      <div className="flex items-center space-x-4">
        <img src={logo} alt="Logo" className="h-12 w-auto" />
        <div className="text-2xl font-semibold text-gray-800">PharmaMonitor</div>
        
        {/* Menú desktop - Solo Inicio */}
        <nav className="hidden md:flex ml-4">
          <ul className="flex space-x-8">
            <li>
              <a 
                href="#features" 
                className="text-gray-600 hover:text-blue-700 transition-colors duration-200 font-medium text-lg"
              >
                Inicio
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Contenedor botón desktop y móvil */}
      <div className="flex items-center space-x-4">
        {/* Botón desktop */}
        <button
          onClick={handleLoginClick}
          className="hidden md:block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg shadow-sm"
        >
          Iniciar
        </button>

        {/* Hamburguesa móvil */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-600 hover:text-blue-700 focus:outline-none"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t">
          <ul className="flex flex-col py-4 px-6 space-y-4">
            <li>
              <a 
                href="#features" 
                className="text-gray-600 hover:text-blue-700 text-lg font-medium"
              >
                Inicio
              </a>
            </li>
            <li>
              <button
                onClick={handleLoginClick}
                className="w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Iniciar
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;