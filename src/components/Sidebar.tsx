import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome, FiUsers, FiThermometer, FiCloud,
  FiMenu, FiX, FiChevronDown, FiUser, FiLogOut,
  FiActivity, FiAlertCircle, FiList
} from 'react-icons/fi';
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Sidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    foto: '',
    rol: ''
  });
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Obtener datos del usuario autenticado
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/perfil');
        setUserData({
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          foto: response.data.foto || 'https://via.placeholder.com/150',
          rol: response.data.rol
        });
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth < 768 && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile Menu Button - Enhanced */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Backdrop with glassmorphism */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden z-40 animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar with enhanced design */}
      <div
        ref={sidebarRef}
        className={`fixed md:relative inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } w-64 h-screen transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex flex-col h-full bg-white/90 backdrop-blur-xl border-r border-white/20 shadow-2xl">
          {/* Logo Section with Gradient */}
          <div className="p-6 pb-6 flex items-center border-b border-white/20 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
            <div className="relative">
              <img src={logo} alt="Logo" className="h-10 w-10 rounded-xl bg-white/20 p-1.5 backdrop-blur-sm" />
              <div className="absolute inset-0 bg-white/10 rounded-xl animate-pulse"></div>
            </div>
            <span className="text-xl font-bold text-white ml-3 tracking-tight">
              PharmaMonitor
            </span>
          </div>

          {/* User Profile Card - Enhanced */}
          <div className="px-4 py-6 border-b border-white/20 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
            <div className="text-center">
              <div className="relative inline-block mb-3">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-full blur-md opacity-75 animate-pulse"></div>
                <img
                  src={userData.foto}
                  alt="Profile"
                  className="relative h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full border-3 border-white shadow-md"></div>
              </div>
              <h2 className="text-base font-bold text-gray-900 mb-1">
                {userData.nombre} {userData.apellido}
              </h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                <p className="text-xs font-semibold text-blue-700">{userData.rol}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu - Enhanced */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <MenuItem
              to="/AdminDashboard"
              icon={<FiHome />}
              label="Visión General"
              isActive={location.pathname === '/AdminDashboard'}
            />

            <NestedMenuItem
              icon={<FiUsers />}
              label="Usuarios"
              subItems={[
                { to: '/AgregarUsuario', label: 'Agregar' },
                { to: '/ConsultarUsuarios', label: 'Gestionar' }
              ]}
              isActive={location.pathname.startsWith('/AgregarUsuario') || location.pathname.startsWith('/ConsultarUsuarios') || location.pathname.startsWith('/EditarUsuario')}
            />

            <NestedMenuItem
              icon={<FiThermometer />}
              label="Productos"
              subItems={[
                { to: '/AgregarProducto', label: 'Agregar' },
                { to: '/ConsultarProductos', label: 'Gestionar' }
              ]}
              isActive={location.pathname.startsWith('/AgregarProducto') ||
                        location.pathname.startsWith('/ConsultarProductos')}
            />

            <NestedMenuItem
              icon={<FiCloud />}
              label="Cond. Ambientales"
              subItems={[
                { to: '/AgregarCondicionAmbiental', label: 'Agregar' },
                { to: '/ConsultarCondiciones', label: 'Gestionar' }
              ]}
              isActive={location.pathname.startsWith('/AgregarCondicionAmbiental') || location.pathname.startsWith('/ConsultarCondiciones')}
            />

            <NestedMenuItem
              icon={<FiActivity />}
              label="Monitoreo"
              subItems={[
                { to: '/AgregarMonitoreo', label: 'Agregar Productos' },
                { to: '/ConsultarMetricas', label: 'Consultar Métricas' }
              ]}
              isActive={location.pathname.startsWith('/AgregarMonitoreo') ||
                        location.pathname.startsWith('/HistoricoMonitoreo') ||
                        location.pathname.startsWith('/ConsultarMetricas')}
            />

            <MenuItem
              to="/VerAlertas"
              icon={<FiAlertCircle />}
              label="Alertas"
              isActive={location.pathname === '/VerAlertas'}
            />

            <MenuItem
              to="/ConsultarRegistros"
              icon={<FiList />}
              label="Registro de Cambios"
              isActive={location.pathname === '/ConsultarRegistros'}
            />

            <MenuItem
              to="/perfil"
              icon={<FiUser />}
              label="Perfil"
              isActive={location.pathname === '/perfil'}
            />

            <div className="pt-2 mt-2 border-t border-gray-200">
              <MenuItem
                to="/login"
                icon={<FiLogOut />}
                label="Cerrar Sesión"
                isActive={false}
                onClick={handleLogout}
              />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

const MenuItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}> = ({ to, icon, label, isActive, onClick }) => (
  <li>
    <Link
      to={to}
      onClick={onClick}
      className={`group flex items-center p-3 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden ${
        isActive
          ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white shadow-lg'
          : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-600'
      }`}
    >
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 opacity-100 animate-gradient-shift"></div>
      )}
      <span className={`relative z-10 mr-3 text-lg transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`}>
        {icon}
      </span>
      <span className="relative z-10">{label}</span>
      {isActive && (
        <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
      )}
    </Link>
  </li>
);

const NestedMenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  subItems: Array<{ to: string; label: string }>;
  isActive: boolean;
}> = ({ icon, label, subItems, isActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <li ref={menuRef} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`group w-full flex items-center p-3 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden ${
          isActive || isOpen
            ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white shadow-lg'
            : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-600'
        }`}
      >
        {(isActive || isOpen) && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 animate-gradient-shift"></div>
        )}
        <span className={`relative z-10 mr-3 text-lg transition-transform duration-300 group-hover:scale-110 ${isActive || isOpen ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`}>
          {icon}
        </span>
        <span className="relative z-10 flex-1 text-left">{label}</span>
        <span className={`relative z-10 ml-auto transform transition-transform duration-300 ${
          isOpen ? 'rotate-180' : 'rotate-0'
        }`}>
          <FiChevronDown size={16} />
        </span>
      </button>

      {isOpen && (
        <ul className="ml-3 mt-2 space-y-1 overflow-hidden animate-slide-down">
          {subItems.map((subItem, index) => (
            <li key={subItem.to} style={{ animationDelay: `${index * 0.05}s` }}>
              <Link
                to={subItem.to}
                className={`group flex items-center p-2.5 pl-6 text-sm font-medium rounded-xl transition-all duration-300 ${
                  location.pathname === subItem.to
                    ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 shadow-md'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-600 hover:shadow-md'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 mr-3 transition-transform duration-300 group-hover:scale-125"></span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">{subItem.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Sidebar;

// Custom animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes gradient-shift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }

  .animate-slide-down {
    animation: slide-down 0.3s ease-out;
  }

  .animate-gradient-shift {
    background-size: 200% 200%;
    animation: gradient-shift 3s ease infinite;
  }
`;

if (!document.head.querySelector('style[data-sidebar-animations]')) {
  style.setAttribute('data-sidebar-animations', 'true');
  document.head.appendChild(style);
}