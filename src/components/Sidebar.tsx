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

  // Obtener datos del usuario autenticado
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/perfil');
        setUserData({
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          foto: response.data.foto || 'https://via.placeholder.com/150', // URL de imagen por defecto
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

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed md:relative inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } w-64 h-screen bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out z-50`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 pb-4 flex items-center border-b border-gray-200">
            <img src={logo} alt="Logo" className="h-8 w-8 mr-3" />
            <span className="text-xl font-semibold text-gray-800">PharmaMonitor</span>
          </div>

          <div className="px-6 py-4 border-b border-gray-200 text-center">
            <img 
              src={userData.foto} 
              alt="Profile" 
              className="h-20 w-20 rounded-full mx-auto mb-3 border-2 border-blue-100 object-cover"
            />
            <h2 className="text-base font-semibold text-gray-800">
              {userData.nombre} {userData.apellido}
            </h2>
            <p className="text-sm text-gray-500">{userData.rol}</p>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
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

              <MenuItem 
                to="/login" 
                icon={<FiLogOut />} 
                label="Cerrar Sesión" 
                isActive={false}
                onClick={handleLogout}
              />
            </ul>
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
      className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      <span className="mr-3 text-lg">{icon}</span>
      {label}
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
        className={`w-full flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
          isActive || isOpen
            ? 'bg-blue-600 text-white' 
            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
        }`}
      >
        <span className="mr-3 text-lg">{icon}</span>
        {label}
        <span className={`ml-auto transform transition-transform ${
          isOpen ? 'rotate-180' : 'rotate-0'
        }`}>
          <FiChevronDown size={16} />
        </span>
      </button>
      
      {isOpen && (
        <ul className="ml-4 mt-1 space-y-1">
          {subItems.map((subItem) => (
            <li key={subItem.to}>
              <Link
                to={subItem.to}
                className="flex items-center p-3 pl-8 text-sm text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {subItem.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Sidebar;