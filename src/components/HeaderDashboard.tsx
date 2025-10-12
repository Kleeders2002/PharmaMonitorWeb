import React, { useState, useEffect } from 'react';
import {
  FiBell,
  FiUser,
  FiChevronDown,
  FiSettings,
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

  const navigate = useNavigate();

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
      document.cookie =
        'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
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
    <header className="bg-blue-600 text-white shadow-sm px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        {/* Título */}
        <h1 className="text-xl font-semibold truncate">{title}</h1>

        {/* Controles Derecha */}
        <div className="flex items-center gap-4">
          {/* Notificaciones */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-lg hover:bg-blue-700 relative transition-colors"
            >
              <FiBell className="w-5 h-5" />
              {alertasActivas.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {alertasActivas.length > 9 ? '9+' : alertasActivas.length}
                </span>
              )}
            </button>

            {/* Dropdown Notificaciones */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-96 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-black">
                      <FiAlertCircle className="text-red-500" /> Alertas Activas
                      <span className="text-sm font-normal text-gray-500">
                        ({alertasActivas.length})
                      </span>
                    </h3>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {alertasActivas.slice(0, 10).map(alerta => {
                      const producto = getProducto(alerta.id_producto_monitoreado);
                      return (
                        <Link
                          to="/VerAlertas"
                          key={alerta.id}
                          className="group block hover:bg-gray-50 rounded-lg p-2 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-14 rounded-full bg-red-500" />
                            <div className="flex-1 flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-sm text-gray-900">
                                    {alerta.mensaje}
                                  </h4>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <FiMapPin className="flex-shrink-0 text-gray-400" />
                                  <span>{producto.localizacion}</span>
                                </div>
                                <div className="mt-1 flex items-center gap-4 text-xs text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <FiThermometer className="text-blue-500" />
                                    <span>
                                      Límites: {alerta.limite_min} -{' '}
                                      {alerta.limite_max}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-red-600">
                                    {alerta.valor_medido.toFixed(2)}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {formatDate(alerta.fecha_generacion)}
                                  </p>
                                </div>
                                <div className="w-12 h-12 flex-shrink-0">
                                  <img
                                    src={producto.foto_producto}
                                    alt="Producto"
                                    className="w-full h-full rounded-lg object-cover border border-gray-200"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                    {alertasActivas.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        No hay alertas activas
                      </div>
                    )}
                  </div>
                  {alertasActivas.length > 0 && (
                    <div className="mt-4 border-t border-gray-200 pt-2">
                      <Link
                        to="/VerAlertas"
                        className="text-blue-600 text-sm hover:underline flex items-center justify-center"
                      >
                        Ver todas las alertas <FiChevronRight className="ml-1" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Menú Usuario */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <img
                src={userData.foto}
                alt="Usuario"
                className="w-8 h-8 rounded-full border border-white"
              />
              <FiChevronDown
                className={`w-4 h-4 transition-transform ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-2">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-semibold text-black">
                      {userData.nombre} {userData.apellido}
                    </p>
                    <p className="text-xs text-gray-500">{userData.rol}</p>
                  </div>
                  <Link
                    to="/perfil"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50"
                  >
                    <FiUser className="w-4 h-4 mr-3 text-blue-600" />
                    <span>Perfil</span>
                  </Link>
                  <Link
                    to="/configuracion"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50"
                  >
                    <FiSettings className="w-4 h-4 mr-3 text-blue-600" />
                    <span>Configuración</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50"
                  >
                    <FiLogOut className="w-4 h-4 mr-3 text-blue-600" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderDashboard;
