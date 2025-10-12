// components/PublicHeader.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import logo from './logo.png';

const PublicHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-blue-600 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src={logo} 
              alt="Logo" 
              className="h-12 w-12 mr-3 transition-opacity group-hover:opacity-90" 
            />
            <span className="text-2xl font-bold text-white tracking-tight">
              Pharma<span className="text-blue-200">Monitor</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/documentacion" 
              className="text-white/90 hover:text-white px-4 py-2.5 rounded-lg transition-colors hover:bg-white/10"
            >
              Documentación
            </Link>

            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium flex items-center"
            >
              Iniciar Sesión
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-white hover:text-blue-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white shadow-xl z-50">
            <div className="px-4 pt-4 pb-6 space-y-4">
              <Link
                to="/documentacion"
                className="block px-4 py-3 text-gray-800 hover:bg-blue-50 rounded-lg"
              >
                Documentación
              </Link>
              <button
                onClick={() => navigate('/login')}
                className="w-full text-left px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default PublicHeader;