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

const ActividadReciente = () => {
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
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg h-full animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg w-32 animate-pulse" />
          <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-24 animate-pulse" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 relative animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg w-32 animate-pulse" />
                <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg w-48 animate-pulse" />
                <div className="h-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full w-24 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg h-full flex flex-col items-center justify-center text-red-500 animate-fade-in-up border border-red-100">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
          <FiUser className="text-2xl" />
        </div>
        <p className="text-center font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg h-full animate-fade-in-up border border-white/50 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
            <FiUser className="text-white text-sm" />
          </div>
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Actividad Reciente
          </span>
        </h3>
        <Link
          to="/consultarregistros"
          className="text-sm text-purple-600 hover:text-purple-800 transition-all duration-300 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-purple-50 font-medium group"
        >
          Consultar todos
          <span className="text-lg transform group-hover:translate-x-1 transition-transform duration-300">→</span>
        </Link>
      </div>

      <div className="space-y-4">
        {registros.map((registro, i) => (
          <div
            key={registro.id}
            className="flex items-start gap-3 relative group animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-purple-50 group-hover:to-blue-50 shadow-sm group-hover:shadow-md border border-gray-200">
              <FiUser className="text-gray-500 group-hover:text-purple-600 transition-colors duration-300" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                  {registro.nombre_usuario}
                </h4>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                  {formatFecha(registro.fecha)}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-300">
                {getAccion(
                  registro.tipo_operacion,
                  registro.entidad_afectada,
                  registro.detalles
                )}
              </p>

              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 text-xs font-semibold text-purple-700 bg-gradient-to-r from-purple-50 to-blue-50 rounded-full border border-purple-200 shadow-sm">
                  {registro.rol_usuario}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  #{registro.entidad_afectada}
                </span>
              </div>
            </div>

            {/* Solo mostrar separador en los primeros 2 elementos */}
            {i < 2 && (
              <div className="absolute bottom-[-1.25rem] left-5 w-px h-6 bg-gradient-to-b from-gray-200 to-transparent" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActividadReciente;