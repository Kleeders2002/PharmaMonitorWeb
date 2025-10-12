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

const Seccion3 = () => {
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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const alertasActivas = alertas
    .filter(a => a.estado === 'pendiente')
    .sort((a, b) => new Date(b.fecha_generacion).getTime() - new Date(a.fecha_generacion).getTime());

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FiAlertCircle className="text-red-500" /> Alertas Activas
          <span className="text-sm font-normal text-gray-500">({alertasActivas.length})</span>
        </h3>
        <button 
          onClick={() => navigate('/gestion-alertas')}
          className="text-blue-600 text-sm hover:underline flex items-center"
        >
          Ver todas <FiChevronRight className="ml-1" />
        </button>
      </div>
      <div className="space-y-4">
        {alertasActivas.slice(0, 3).map((alerta) => {
          const producto = getProducto(alerta.id_producto_monitoreado);
          
          return (
            <div key={alerta.id} className="group flex items-start gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors">
              {/* Línea vertical roja */}
              <div className="w-2 h-14 rounded-full bg-red-500" />
              
              <div className="flex-1 flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm text-gray-900">{alerta.mensaje}</h4>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiMapPin className="flex-shrink-0 text-gray-400" />
                    <span>{producto.localizacion}</span>
                  </div>
                  
                  <div className="mt-1 flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <FiThermometer className="text-blue-500" />
                      <span>Límites: {alerta.limite_min} - {alerta.limite_max}</span>
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
          );
        })}
        
        {alertasActivas.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No hay alertas activas
          </div>
        )}
      </div>
    </div>
  );
};

export default Seccion3;