import React, { useState, useEffect } from 'react';
import { FiPackage, FiArrowRight, FiBox } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../api';

interface ProductoFarmaceutico {
  id: number;
  nombre: string;
  formula: string;
  concentracion: string;
  foto?: string;
  id_condicion: number;
  id_forma_farmaceutica: number;
}

const UltimosProductos = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<ProductoFarmaceutico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get<ProductoFarmaceutico[]>('/dashboard/metrics/last-product');
        setProductos(response.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los últimos productos');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-emerald-100/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
              <FiPackage className="text-white w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Últimos Productos</h3>
          </div>
          <button
            onClick={() => navigate('/ConsultarProductos')}
            className="group flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-600
                     bg-white/80 backdrop-blur rounded-lg border border-emerald-200
                     hover:bg-emerald-600 hover:text-white hover:border-emerald-600
                     transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            Ver todos
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 overflow-y-auto">
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-100"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <FiBox className="text-red-500 w-8 h-8" />
            </div>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-3">
            {productos.map((producto, index) => (
              <div
                key={producto.id}
                className={`group relative bg-white rounded-xl p-4 border border-gray-100
                          shadow-sm hover:shadow-lg hover:border-emerald-200
                          transform hover:-translate-y-1 transition-all duration-300
                          ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                style={{
                  transitionDelay: `${index * 0.1}s`,
                  animation: 'slide-in-left 0.5s ease-out forwards'
                }}
              >
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-transparent
                              rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-shine
                              bg-gradient-to-r from-transparent via-white/40 to-transparent
                              skew-x-12 rounded-xl"></div>

                <div className="relative flex items-center gap-4">
                  {/* Product Image */}
                  <div className="relative group/img">
                    {producto.foto ? (
                      <img
                        src={producto.foto}
                        alt={producto.nombre}
                        className="w-14 h-14 rounded-xl object-cover shadow-md
                                 group-hover/img:scale-110 group-hover/img:rotate-3 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200
                                  flex items-center justify-center shadow-md">
                        <FiBox className="text-emerald-600 w-6 h-6" />
                      </div>
                    )}
                    {/* Floating badge */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full
                                    border-2 border-white shadow-sm opacity-0 group-hover:opacity-100
                                    transition-opacity duration-300"></div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate group-hover:text-emerald-600
                                    transition-colors duration-300">
                      {producto.nombre}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full
                                       bg-emerald-100 text-emerald-700">
                          {producto.concentracion}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {producto.formula}
                      </div>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <FiArrowRight className="text-emerald-400 w-5 h-5 opacity-0 group-hover:opacity-100
                                           group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shine {
          100% {
            transform: translateX(100%) skewX(12deg);
          }
        }

        .animate-shine {
          animation: shine 1s;
        }
      `}</style>
    </div>
  );
};

export default UltimosProductos;
