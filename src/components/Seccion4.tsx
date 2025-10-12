// Seccion4.tsx
import React, { useState, useEffect } from 'react';
import { FiPackage, FiArrowRight } from 'react-icons/fi';
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

const Seccion4 = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<ProductoFarmaceutico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FiPackage className="text-green-600" /> Últimos Productos Registrados
        </h3>
        <button 
          onClick={() => navigate('/ConsultarProductos')}
          className="flex items-center gap-1 text-sm text-green-600 hover:text-green-800 transition-colors"
        >
          Ver todos
          <FiArrowRight className="mt-0.5" />
        </button>
      </div>

      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center justify-between p-2">
              <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
              <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
              <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-red-500 p-4 text-center">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-gray-500 border-b">
                <th className="pb-3 text-left">Producto</th>
                <th className="pb-3 text-left">Concentración</th>
                <th className="pb-3 text-left">Fórmula</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} className="hover:bg-gray-50">
                  <td className="py-3 text-sm flex items-center gap-2">
                    {producto.foto && (
                      <img 
                        src={producto.foto} 
                        alt={producto.nombre}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    {producto.nombre}
                  </td>
                  <td className="py-3 text-sm">{producto.concentracion}</td>
                  <td className="py-3 text-sm">{producto.formula}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Seccion4;