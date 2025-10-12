// Seccion5.tsx
import { FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';

interface Registro {
  id: number;
  id_usuario: number;
  fecha: string;
  detalles: {
    id?: number;
    nombre_producto?: string;
    id_producto_farmaceutico?: number;
    localizacion?: string;
    fecha_inicio_monitoreo?: string;
    cantidad?: number;
    id_producto?: number;
    alertas_resueltas?: number;
    fecha_inicio?: string;
    fecha_fin?: string;
    duracion_total_dias?: number;
  };
  nombre_usuario: string;
  rol_usuario: string;
  tipo_operacion: string;
  entidad_afectada: string;
}

const Seccion5 = () => {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchRegistros = async () => {
      try {
        const response = await api.get('/dashboard/metrics/last-registros', {
          signal: controller.signal,
        });
        // Limitar a 3 registros
        setRegistros(response.data.slice(0, 3));
      } catch (err: any) {
        if (!controller.signal.aborted) {
          setError('Error al cargar la actividad reciente');
          console.error('Error fetching registros:', err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchRegistros();

    return () => controller.abort();
  }, []);

  const formatFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(/ /g, ' ');
  };

  const getAccion = (operacion: string, entidad: string, detalles: any) => {
    const acciones: { [key: string]: string } = {
      crear: `Creó nuevo ${entidad}`,
      actualizar: `Actualizó ${entidad}`,
      eliminar: `Eliminó ${entidad}`,
      detener: `Detuvo monitoreo de ${detalles.nombre_producto || 'producto'}`,
      iniciar: `Inició monitoreo de ${detalles.nombre_producto || 'producto'}`,
    };

    return acciones[operacion] || `${operacion} en ${entidad}`;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 relative">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col items-center justify-center text-red-500">
        <FiUser className="text-2xl mb-2" />
        <p className="text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FiUser className="text-purple-600" /> Actividad Reciente
        </h3>
        <Link
          to="/consultarregistros"
          className="text-sm text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1"
        >
          Consultar todos <span className="text-lg">→</span>
        </Link>
      </div>
      
      <div className="space-y-4">
        {registros.map((registro, i) => (
          <div key={registro.id} className="flex items-start gap-3 relative group">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-colors group-hover:bg-purple-50">
              <FiUser className="text-gray-500 group-hover:text-purple-600" />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-800">{registro.nombre_usuario}</h4>
                <span className="text-xs text-gray-400">
                  {formatFecha(registro.fecha)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mt-1">
                {getAccion(
                  registro.tipo_operacion,
                  registro.entidad_afectada,
                  registro.detalles
                )}
              </p>
              
              <div className="mt-2 flex items-center gap-2">
                <span className="px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded-full">
                  {registro.rol_usuario}
                </span>
                <span className="text-xs text-gray-400">
                  #{registro.entidad_afectada}
                </span>
              </div>
            </div>

            {/* Solo mostrar separador en los primeros 2 elementos */}
            {i < 2 && (
              <div className="absolute bottom-[-1.25rem] left-4 w-px h-6 bg-gray-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Seccion5;