import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import HeaderDashboard from "../components/HeaderDashboard";
import api from "../api";
import { 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiClock, 
  FiThermometer, 
  FiSun, 
  FiChevronDown,
  FiPackage,
  FiMapPin,
  FiBox 
} from "react-icons/fi";
import { format, formatDistanceToNow } from "date-fns";
import es from "date-fns/locale/es";

interface ProductoMonitoreado {
  id: number;
  nombre_producto: string;
  localizacion: string;
  cantidad: number;
  foto_producto: string;
}

const VerAlertas: React.FC = () => {
  const [alertas, setAlertas] = useState<any[]>([]);
  const [productos, setProductos] = useState<ProductoMonitoreado[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showAllPending, setShowAllPending] = useState(false);
  const [showAllResolved, setShowAllResolved] = useState(false);
  const navigate = useNavigate();

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
  }, []);

  const getProductoInfo = (idProducto: number) => {
    return productos.find(p => p.id === idProducto) || {
      nombre_producto: "Producto desconocido",
      localizacion: "N/A",
      cantidad: 0,
      foto_producto: ""
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy, HH:mm", { locale: es });
  };

  const filteredAlertas = (estado: string) => {
    return alertas
      .filter(a => a.estado === estado && 
        (selectedDate ? 
          new Date(a.fecha_generacion).toISOString().split("T")[0] === selectedDate : 
          true))
      .sort((a, b) => new Date(b.fecha_generacion).getTime() - new Date(a.fecha_generacion).getTime());
  };

  const StatusBadge = ({ estado }: { estado: string }) => (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
      estado === 'pendiente' 
        ? 'bg-red-100 text-red-800' 
        : 'bg-green-100 text-green-800'
    }`}>
      {estado === 'pendiente' ? (
        <FiAlertTriangle className="mr-2" />
      ) : (
        <FiCheckCircle className="mr-2" />
      )}
      {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </span>
  );

  const ParametroIcon = ({ parametro }: { parametro: string }) => {
    const icons: { [key: string]: React.ReactNode } = {
      temperatura: <FiThermometer className="w-5 h-5" />,
      lux: <FiSun className="w-5 h-5" />,
    };
    return (
      <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
        {icons[parametro] || <FiAlertTriangle className="w-5 h-5" />}
      </div>
    );
  };

  const AlertCounter = ({ count, estado }: { count: number, estado: string }) => (
    <span className={`ml-2 text-sm font-medium ${
      estado === 'pendiente' ? 'text-red-600' : 'text-green-600'
    }`}>
      ({count})
    </span>
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const pendingAlertas = filteredAlertas('pendiente');
  const resolvedAlertas = filteredAlertas('resuelta');

  return (
    <>
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="flex h-full">
        <Sidebar />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <HeaderDashboard title="Gestión de Alertas" />

          <main className="flex-1 overflow-y-auto">
            <div className="w-full p-8 2xl:px-12">
              <div className="max-w-9xl mx-auto">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 transition-all duration-300 ease-in-out">
                  <div className="px-8 py-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                          Monitor de Alertas
                        </h1>
                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                          {alertas.length} alertas registradas • {productos.length} productos monitoreados
                        </p>
                      </div>
                      <div className="w-full md:w-60">
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setShowAllPending(false);
                            setShowAllResolved(false);
                          }}
                          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 lg:p-8">
                    <div className="grid grid-cols-1 gap-6">
                      {/* Alertas Pendientes */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-semibold text-red-600 flex items-center">
                            <FiAlertTriangle className="mr-2" />
                            Alertas Pendientes
                            <AlertCounter count={pendingAlertas.length} estado="pendiente" />
                          </h2>
                          {!selectedDate && pendingAlertas.length > 4 && (
                            <button
                              onClick={() => setShowAllPending(!showAllPending)}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded-lg transition-all"
                            >
                              {showAllPending ? 'Ver menos' : 'Ver todas'}
                              <FiChevronDown className={`ml-1 transition-transform ${showAllPending ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                          {pendingAlertas
                            .slice(0, (selectedDate || showAllPending) ? pendingAlertas.length : 4)
                            .map((alerta, index) => {
                              const producto = getProductoInfo(alerta.id_producto_monitoreado);
                              return (
                                <div key={alerta.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-xl hover:border-red-200 transition-all duration-300 animate-fadeIn" style={{ animationDelay: `${index * 0.05}s` }}>
                                  <div className="flex gap-4 flex-col sm:flex-row">
                                    {/* Sección de Producto */}
                                    <div className="w-full sm:w-1/3 flex-shrink-0">
                                      <div className="relative aspect-square sm:aspect-auto sm:h-32 rounded-lg overflow-hidden bg-gray-100">
                                        <img
                                          src={producto.foto_producto || '/placeholder-product.jpg'}
                                          alt={producto.nombre_producto}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="mt-3 space-y-1">
                                        <h3 className="font-medium flex items-center text-sm">
                                          <FiPackage className="mr-2 flex-shrink-0" />
                                          <span className="line-clamp-1">{producto.nombre_producto}</span>
                                        </h3>
                                        <p className="text-sm text-gray-500 flex items-center">
                                          <FiMapPin className="mr-2 flex-shrink-0" />
                                          <span className="line-clamp-1">{producto.localizacion}</span>
                                        </p>
                                        <p className="text-sm text-gray-500 flex items-center">
                                          <FiBox className="mr-2 flex-shrink-0" />
                                          {producto.cantidad} unidades
                                        </p>
                                      </div>
                                    </div>

                                    {/* Sección de Alerta */}
                                    <div className="w-full sm:w-2/3 flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <ParametroIcon parametro={alerta.parametro_afectado} />
                                        <StatusBadge estado={alerta.estado} />
                                      </div>
                                      <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900 line-clamp-2">
                                        {alerta.mensaje}
                                      </h3>
                                      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                                        <div>
                                          <p className="text-gray-500">Valor medido</p>
                                          <p className="font-medium">
                                            {alerta.valor_medido.toFixed(2)}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">Límites</p>
                                          <p className="font-medium">
                                            {alerta.limite_min} - {alerta.limite_max}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="mt-4 text-xs sm:text-sm text-gray-500 flex items-center">
                                        <FiClock className="mr-2 flex-shrink-0" />
                                        <span className="line-clamp-1">{formatDate(alerta.fecha_generacion)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      {/* Alertas Resueltas */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-semibold text-green-600 flex items-center">
                            <FiCheckCircle className="mr-2" />
                            Alertas Resueltas
                            <AlertCounter count={resolvedAlertas.length} estado="resuelta" />
                          </h2>
                          {!selectedDate && resolvedAlertas.length > 4 && (
                            <button
                              onClick={() => setShowAllResolved(!showAllResolved)}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded-lg transition-all"
                            >
                              {showAllResolved ? 'Ver menos' : 'Ver todas'}
                              <FiChevronDown className={`ml-1 transition-transform ${showAllResolved ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                          {resolvedAlertas
                            .slice(0, (selectedDate || showAllResolved) ? resolvedAlertas.length : 4)
                            .map((alerta, index) => {
                              const producto = getProductoInfo(alerta.id_producto_monitoreado);
                              return (
                                <div key={alerta.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-xl hover:border-green-200 transition-all duration-300 animate-fadeIn" style={{ animationDelay: `${index * 0.05}s` }}>
                                  <div className="flex gap-4 flex-col sm:flex-row">
                                    {/* Sección de Producto */}
                                    <div className="w-full sm:w-1/3 flex-shrink-0">
                                      <div className="relative aspect-square sm:aspect-auto sm:h-32 rounded-lg overflow-hidden bg-gray-100">
                                        <img
                                          src={producto.foto_producto || '/placeholder-product.jpg'}
                                          alt={producto.nombre_producto}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="mt-3 space-y-1">
                                        <h3 className="font-medium flex items-center text-sm">
                                          <FiPackage className="mr-2 flex-shrink-0" />
                                          <span className="line-clamp-1">{producto.nombre_producto}</span>
                                        </h3>
                                        <p className="text-sm text-gray-500 flex items-center">
                                          <FiMapPin className="mr-2 flex-shrink-0" />
                                          <span className="line-clamp-1">{producto.localizacion}</span>
                                        </p>
                                        <p className="text-sm text-gray-500 flex items-center">
                                          <FiBox className="mr-2 flex-shrink-0" />
                                          {producto.cantidad} unidades
                                        </p>
                                      </div>
                                    </div>

                                    {/* Sección de Alerta */}
                                    <div className="w-full sm:w-2/3 flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <ParametroIcon parametro={alerta.parametro_afectado} />
                                        <StatusBadge estado={alerta.estado} />
                                      </div>
                                      <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900 line-clamp-2">
                                        {alerta.mensaje}
                                      </h3>
                                      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                                        <div>
                                          <p className="text-gray-500">Duración</p>
                                          <p className="font-medium">
                                            {Math.floor(alerta.duracion_minutos / 60)}h {Math.round(alerta.duracion_minutos % 60)}m
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">Resuelta hace</p>
                                          <p className="font-medium">
                                            {formatDistanceToNow(new Date(alerta.fecha_resolucion), {
                                              addSuffix: true,
                                              locale: es
                                            })}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="mt-4 text-xs sm:text-sm text-gray-500 flex items-center">
                                        <FiClock className="mr-2 flex-shrink-0" />
                                        <span className="line-clamp-1">{formatDate(alerta.fecha_generacion)} - {formatDate(alerta.fecha_resolucion)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <style>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out forwards;
        opacity: 0;
      }
    `}</style>
    </>
  );
};

export default VerAlertas;