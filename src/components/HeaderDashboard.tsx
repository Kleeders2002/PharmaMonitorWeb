import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  FiBell,
  FiUser,
  FiChevronDown,
  FiLogOut,
  FiAlertCircle,
  FiMapPin,
  FiThermometer,
  FiChevronRight
} from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';

interface ProductoMonitoreado {
  id: number;
  localizacion: string;
  foto_producto: string;
}

interface Alerta {
  id: number;
  mensaje: string;
  estado: string;
  parametro_afectado: string;
  fecha_generacion: string;
  id_producto_monitoreado: number;
  valor_medido: number;
  limite_min: number;
  limite_max: number;
}

const HeaderDashboard: React.FC<{ title: string }> = ({ title }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [productos, setProductos] = useState<ProductoMonitoreado[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    foto: '',
    rol: ''
  });
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [notificationsPosition, setNotificationsPosition] = useState({ top: 0, right: 0 });

  const navigate = useNavigate();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const notificationsButtonRef = useRef<HTMLButtonElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);

  // Calcular posición del dropdown
  const updateDropdownPositions = () => {
    if (menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuPosition({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
    if (notificationsButtonRef.current) {
      const rect = notificationsButtonRef.current.getBoundingClientRect();
      setNotificationsPosition({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
  };

  useEffect(() => {
    updateDropdownPositions();
    window.addEventListener('scroll', updateDropdownPositions, true);
    window.addEventListener('resize', updateDropdownPositions);
    return () => {
      window.removeEventListener('scroll', updateDropdownPositions, true);
      window.removeEventListener('resize', updateDropdownPositions);
    };
  }, []);

  // Recalcular posiciones cuando se abre un menú
  useEffect(() => {
    if (isMenuOpen || isNotificationsOpen) {
      updateDropdownPositions();
    }
  }, [isMenuOpen, isNotificationsOpen]);

  // CORRECCIÓN PRINCIPAL: Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Si no hay menús abiertos, no hacemos nada
      if (!isMenuOpen && !isNotificationsOpen) return;

      // Verificar notificaciones - botón Y dropdown
      if (isNotificationsOpen) {
        const clickedButton = notificationsButtonRef.current?.contains(target);
        const clickedDropdown = notificationsDropdownRef.current?.contains(target);

        if (!clickedButton && !clickedDropdown) {
          setIsNotificationsOpen(false);
        }
      }

      // Verificar menú usuario - botón Y dropdown
      if (isMenuOpen) {
        const clickedButton = menuButtonRef.current?.contains(target);
        const clickedDropdown = menuDropdownRef.current?.contains(target);

        if (!clickedButton && !clickedDropdown) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isNotificationsOpen]);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    setIsNotificationsOpen(false);
    // Recalcular posición después de que el estado cambie
    setTimeout(updateDropdownPositions, 10);
  };

  const handleNotificationsToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = !isNotificationsOpen;
    setIsNotificationsOpen(newState);
    setIsMenuOpen(false);
    // Recalcular posición después de que el estado cambie
    setTimeout(updateDropdownPositions, 10);
  };

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

  // Obtener alertas y detalles de productos monitoreados
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertasResponse, productosResponse] = await Promise.all([
          api.get('/alertas'),
          api.get('/productosmonitoreados/detalles')
        ]);

        setAlertas(alertasResponse.data);
        setProductos(productosResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProducto = (idProducto: number) => {
    return productos.find(p => p.id === idProducto) || {
      localizacion: 'Ubicación desconocida',
      foto_producto: '/placeholder-product.jpg'
    };
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM, HH:mm', { locale: es });
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      window.location.href = '/login';
    }
  };

  const alertasActivas = alertas
    .filter(a => a.estado === 'pendiente')
    .sort(
      (a, b) =>
        new Date(b.fecha_generacion).getTime() -
        new Date(a.fecha_generacion).getTime()
    );

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg sticky top-0 z-40 animate-fade-in-down">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Título con gradiente - Espacio para menú hamburguesa en móvil */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-shift">
              {title}
            </h1>
          </div>
          <div className="sm:hidden pl-14">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-shift">
              {title}
            </h1>
          </div>
        </div>

        {/* Controles Derecha */}
        <div className="flex items-center gap-2 sm:gap-4 relative z-50">
          {/* Notificaciones */}
          <div className="relative">
            <button
              ref={notificationsButtonRef}
              onClick={handleNotificationsToggle}
              className="group relative p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <FiBell className="w-5 h-5 text-blue-600 group-hover:animate-bounce" />
              {alertasActivas.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
                  {alertasActivas.length > 9 ? '9+' : alertasActivas.length}
                </span>
              )}
            </button>

            {/* Dropdown Notificaciones */}
            {isNotificationsOpen && createPortal(
              <div
                ref={notificationsDropdownRef}
                className="fixed w-96 sm:w-[420px] z-[10000] animate-scale-in opacity-100"
                style={{ top: `${notificationsPosition.top}px`, right: `${notificationsPosition.right}px` }}
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden opacity-100">
                  {/* Header con gradiente */}
                  <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                        <FiAlertCircle className="animate-pulse" /> Alertas Activas
                        <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-sm">
                          {alertasActivas.length}
                        </span>
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 max-h-[450px] overflow-y-auto">
                    <div className="space-y-3">
                      {alertasActivas.slice(0, 10).map((alerta, index) => {
                        const producto = getProducto(alerta.id_producto_monitoreado);
                        return (
                          <Link
                            to="/VerAlertas"
                            key={alerta.id}
                            className="group block bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-cyan-50 rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-gray-100 hover:border-blue-200"
                            style={{ animationDelay: `${index * 0.05}s` }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-1.5 h-14 rounded-full bg-gradient-to-b from-red-500 to-pink-500 animate-pulse" />
                              <div className="flex-1 flex justify-between items-start gap-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                                    {alerta.mensaje}
                                  </h4>
                                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                    <FiMapPin className="flex-shrink-0 text-cyan-600" />
                                    <span className="truncate">{producto.localizacion}</span>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-gray-400">
                                    <div className="flex items-center gap-1">
                                      <FiThermometer className="text-blue-500" />
                                      <span>
                                        Límites: {alerta.limite_min} - {alerta.limite_max}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <div className="text-right">
                                    <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
                                      {alerta.valor_medido.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {formatDate(alerta.fecha_generacion)}
                                    </p>
                                  </div>
                                  <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden ring-2 ring-blue-100 hover:ring-blue-300 transition-all">
                                    <img
                                      src={producto.foto_producto}
                                      alt="Producto"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                      {alertasActivas.length === 0 && (
                        <div className="text-center py-8">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 mb-3">
                            <FiAlertCircle className="w-8 h-8 text-green-500" />
                          </div>
                          <p className="text-gray-500 font-medium">No hay alertas activas</p>
                          <p className="text-sm text-gray-400 mt-1">Todo está funcionando correctamente</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {alertasActivas.length > 0 && (
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-t border-blue-100">
                      <Link
                        to="/VerAlertas"
                        className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-cyan-700 flex items-center justify-center transition-all duration-300 group"
                      >
                        Ver todas las alertas
                        <FiChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>,
              document.body
            )}
          </div>

          {/* Menú Usuario */}
          <div className="relative">
            <button
              ref={menuButtonRef}
              onClick={handleMenuToggle}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-all duration-300 hover:scale-105 hover:shadow-md group"
            >
              <div className="relative">
                <img
                  src={userData.foto}
                  alt="Usuario"
                  className="w-8 h-8 rounded-full ring-2 ring-white shadow-md group-hover:ring-blue-300 transition-all"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gray-700">{userData.nombre}</p>
                <p className="text-xs text-gray-500">{userData.rol}</p>
              </div>
              <FiChevronDown
                className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isMenuOpen && createPortal(
              <div
                ref={menuDropdownRef}
                className="fixed w-56 z-[10000] animate-scale-in opacity-100"
                style={{ top: `${menuPosition.top}px`, right: `${menuPosition.right}px` }}
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden opacity-100">
                  {/* User Info Header */}
                  <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={userData.foto}
                        alt="Usuario"
                        className="w-12 h-12 rounded-full ring-2 ring-white/50"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">
                          {userData.nombre} {userData.apellido}
                        </p>
                        <p className="text-xs text-blue-100 truncate">{userData.rol}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      to="/perfil"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 group"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 group-hover:scale-110 transition-transform mr-3">
                        <FiUser className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium">Perfil</span>
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 group"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-br from-red-100 to-pink-100 group-hover:scale-110 transition-transform mr-3">
                        <FiLogOut className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="font-medium">Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              </div>,
              document.body
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderDashboard;

// Custom animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in-down {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .animate-scale-in {
    animation: scale-in 0.2s ease-out forwards;
  }

  @keyframes gradient-shift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  .animate-fade-in-down {
    animation: fade-in-down 0.5s ease-out;
  }


  .animate-gradient-shift {
    background-size: 200% 200%;
    animation: gradient-shift 3s ease infinite;
  }
`;

if (!document.head.querySelector('style[data-header-animations]')) {
  style.setAttribute('data-header-animations', 'true');
  document.head.appendChild(style);
}
