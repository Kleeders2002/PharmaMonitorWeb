import { FiAlertCircle, FiChevronRight, FiMapPin, FiThermometer } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const AlertasActivas = () => {
  const navigate = useNavigate();
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [productos, setProductos] = useState<ProductoMonitoreado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertasResponse, productosResponse] = await Promise.all([
          api.get("/alertas"),
          api.get("/productosmonitoreados/detalles")
        ]);

        setAlertas(alertasResponse.data);
        setProductos(productosResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Actualizar alertas automáticamente cada 10 segundos
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getProducto = (idProducto: number) => {
    return productos.find(p => p.id === idProducto) || {
      localizacion: 'Ubicación desconocida',
      foto_producto: '/placeholder-product.jpg'
    };
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM, HH:mm", { locale: es });
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 h-full flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium animate-pulse">Cargando alertas...</p>
        </div>
      </div>
    );
  }

  const alertasActivas = alertas
    .filter(a => a.estado === 'pendiente')
    .sort((a, b) => new Date(b.fecha_generacion).getTime() - new Date(a.fecha_generacion).getTime());

  const getAlertColor = (parametro: string) => {
    const colors = {
      temperatura: 'from-orange-500 to-red-500',
      humedad: 'from-blue-500 to-cyan-500',
      lux: 'from-yellow-500 to-amber-500',
      presion: 'from-purple-500 to-indigo-500'
    };
    return colors[parametro as keyof typeof colors] || 'from-red-500 to-orange-500';
  };

  const getAlertBgColor = (parametro: string) => {
    const colors = {
      temperatura: 'from-orange-50/50 to-red-50/50',
      humedad: 'from-blue-50/50 to-cyan-50/50',
      lux: 'from-yellow-50/50 to-amber-50/50',
      presion: 'from-purple-50/50 to-indigo-50/50'
    };
    return colors[parametro as keyof typeof colors] || 'from-red-50/50 to-orange-50/50';
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 h-full flex flex-col animate-fade-in relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Animated background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-400/5 to-orange-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-400/5 to-red-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      {/* Header */}
      <div className="relative flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-orange-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-pulse"></div>
            <div className="relative p-2.5 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg shadow-red-500/30">
              <FiAlertCircle className="text-white w-5 h-5 drop-shadow-md" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              Alertas Activas
              <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full shadow-md">
                {alertasActivas.length}
              </span>
            </h3>
          </div>
        </div>

        <button
          onClick={() => navigate('/VerAlertas')}
          className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md border border-blue-200/50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300 rounded-xl"></div>
          <span className="relative text-sm font-semibold text-blue-700">Ver todas</span>
          <FiChevronRight className="relative w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>

      {/* Alertas List */}
      <div className="relative flex-1 space-y-3 overflow-y-auto">
        {alertasActivas.slice(0, 3).map((alerta, index) => {
          const producto = getProducto(alerta.id_producto_monitoreado);

          return (
            <div
              key={alerta.id}
              className="group relative flex items-start gap-3 p-4 bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-2xl border border-white/20 shadow-md hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 animate-slide-in cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Animated gradient border */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-gradient-to-b ${getAlertColor(alerta.parametro_afectado)} shadow-lg`}></div>

              <div className="flex-1 flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`px-2.5 py-1 bg-gradient-to-r ${getAlertColor(alerta.parametro_afectado)} rounded-lg shadow-md`}>
                      <span className="text-xs font-bold text-white uppercase tracking-wide">
                        {alerta.parametro_afectado}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
                    {alerta.mensaje}
                  </h4>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1.5">
                    <div className="p-1.5 rounded-lg bg-blue-50 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                      <FiMapPin className="flex-shrink-0 text-blue-500 w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium">{producto.localizacion}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg">
                      <FiThermometer className="text-amber-500 w-3 h-3" />
                      <span className="font-semibold">Rango: {alerta.limite_min} - {alerta.limite_max}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className={`text-lg font-bold bg-gradient-to-r ${getAlertColor(alerta.parametro_afectado)} bg-clip-text text-transparent`}>
                      {alerta.valor_medido.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {formatDate(alerta.fecha_generacion)}
                    </p>
                  </div>
                  <div className="relative w-14 h-14 flex-shrink-0 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                    <img
                      src={producto.foto_producto}
                      alt="Producto"
                      className="relative w-full h-full rounded-xl object-cover border-2 border-white shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getAlertBgColor(alerta.parametro_afectado)} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
            </div>
          );
        })}

        {alertasActivas.length === 0 && (
          <div className="relative flex flex-col items-center justify-center py-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-gray-600 font-semibold">No hay alertas activas</p>
            <p className="text-sm text-gray-500 mt-1">Todos los parámetros están dentro de los límites</p>
          </div>
        )}
      </div>
    </div>
  );
};

AlertasActivas.displayName = 'AlertasActivas';

export default AlertasActivas;