import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import HeaderDashboard from "../components/HeaderDashboard";
import api from "../api";
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface Registro {
  id: number;
  rol_usuario: string;
  tipo_operacion: string;
  entidad_afectada: string;
  nombre_usuario: string;
  id_usuario: number;
  fecha: string;
  detalles: Record<string, any>;
}

const ConsultarRegistros: React.FC = () => {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const response = await api.get('/registros/');
        const sortedData = response.data.sort((a: Registro, b: Registro) => 
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        setRegistros(sortedData);
      } catch (err) {
        setError("Error al cargar los registros");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistros();
  }, []);

  const filterOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'crear', label: 'Creaciones' },
    { value: 'actualizar', label: 'Actualizaciones' },
    { value: 'eliminar', label: 'Eliminaciones' },
  ];

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const filteredRegistros = registros.filter(registro => {
    const matchesSearch = Object.values(registro).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesFilter = selectedFilter === 'all' || registro.tipo_operacion === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const currentRecords = filteredRegistros.slice(0, indexOfLastRecord);

  const getBadgeColor = (operation: string) => {
    switch (operation.toLowerCase()) {
      case 'crear': return 'bg-green-100 text-green-800';
      case 'actualizar': return 'bg-blue-100 text-blue-800';
      case 'eliminar': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDetalles = (detalles: Record<string, any>, depth = 0) => {
    return Object.entries(detalles).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return (
          <div key={key} className={`ml-4 ${depth === 0 ? 'border-l-2 border-gray-200 pl-4' : ''}`}>
            <span className="font-medium text-sm">{key}:</span>
            {renderDetalles(value, depth + 1)}
          </div>
        );
      }
      
      let displayValue = value;
      if (key.toLowerCase().includes('fecha')) {
        displayValue = format(parseISO(value), "dd MMM yyyy HH:mm", { locale: es });
      }

      // Aquí está la modificación para mostrar la foto pequeña
      if (key.toLowerCase() === 'foto' && typeof value === 'string') {
        return (
          <div key={key} className="flex gap-2 text-sm items-center">
            <span className="font-medium capitalize text-gray-700">{key.replace(/_/g, ' ')}:</span>
            <img 
              src={value} 
              alt="Foto" 
              className="w-6 h-6 object-cover rounded hover:scale-150 transition-transform cursor-pointer" 
              style={{ 
                minWidth: '1.5rem',
                minHeight: '1.5rem',
                maxWidth: '1.5rem',
                maxHeight: '1.5rem' 
              }}
            />
          </div>
        );
      }
      
      return (
        <div key={key} className="flex gap-2 text-sm">
          <span className="font-medium capitalize text-gray-700">{key.replace(/_/g, ' ')}:</span>
          <span className="text-gray-600">{displayValue}</span>
        </div>
      );
    });
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="flex h-full">
        {/* Sidebar Fijo */}
        <div className="fixed left-0 top-0 h-screen w-64 z-50 shadow-xl">
          <Sidebar />
        </div>

        {/* Contenido Principal */}
        <div className="ml-64 flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header Fijo */}
          <div className="fixed top-0 left-64 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
            <HeaderDashboard title="Registros del Sistema" />
          </div>

          {/* Contenido Scrollable */}
          <main className="flex-1 overflow-y-auto pt-16 pb-8">
            <div className="w-full p-6 lg:p-8 xl:p-12">
              <div className="max-w-9xl mx-auto space-y-6">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20">
                  <div className="px-8 py-6 border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                          Auditoría del Sistema
                        </h1>
                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                          Registro detallado de todas las operaciones
                        </p>
                      </div>

                      <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
                        <div className="flex gap-2 items-center bg-gray-50/80 backdrop-blur p-1 rounded-xl border border-gray-200">
                          {filterOptions.map(option => (
                            <button
                              key={option.value}
                              onClick={() => setSelectedFilter(option.value)}
                              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                                selectedFilter === option.value
                                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                  : 'text-gray-600 hover:bg-white/50'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>

                        <input
                          type="text"
                          placeholder="Buscar registros..."
                          className="w-full lg:w-64 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition-all duration-300"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {loading ? (
                      <div className="min-h-[400px] flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                          <p className="mt-4 text-gray-600 font-medium animate-pulse">Cargando registros...</p>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="min-h-[400px] flex items-center justify-center text-red-500">
                        {error}
                      </div>
                    ) : (
                      <>
                        {/* Vista Desktop - Tabla */}
                        <div className="hidden lg:block overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                              <tr>
                                {['Fecha y Hora', 'Usuario', 'Operación', 'Entidad', 'Detalles'].map((header) => (
                                  <th key={header} className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white/80 backdrop-blur divide-y divide-gray-200">
                              {currentRecords.map((registro, index) => (
                                <tr
                                  key={registro.id}
                                  className="hover:bg-blue-50/50 transition-all duration-200 animate-fadeIn"
                                  style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {format(parseISO(registro.fecha), "dd MMM yyyy HH:mm", { locale: es })}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-medium">
                                          {registro.nombre_usuario[0]}
                                        </span>
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {registro.nombre_usuario}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {registro.rol_usuario}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(registro.tipo_operacion)}`}>
                                      {capitalizeFirstLetter(registro.tipo_operacion)}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {registro.entidad_afectada}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    <div className="space-y-2">
                                      {renderDetalles(registro.detalles)}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Vista Mobile - Tarjetas */}
                        <div className="lg:hidden space-y-4">
                          {currentRecords.map((registro, index) => (
                            <div
                              key={registro.id}
                              className="bg-white/80 backdrop-blur rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 animate-fadeIn"
                              style={{ animationDelay: `${index * 0.05}s` }}
                            >
                              {/* Header con fecha y badge */}
                              <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                                    Fecha y Hora
                                  </p>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {format(parseISO(registro.fecha), "dd MMM yyyy HH:mm", { locale: es })}
                                  </p>
                                </div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(registro.tipo_operacion)} ml-2 flex-shrink-0`}>
                                  {capitalizeFirstLetter(registro.tipo_operacion)}
                                </span>
                              </div>

                              {/* Info de usuario */}
                              <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-blue-600 font-medium">
                                    {registro.nombre_usuario[0]}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {registro.nombre_usuario}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {registro.rol_usuario}
                                  </p>
                                </div>
                              </div>

                              {/* Entidad */}
                              <div className="mb-3">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                                  Entidad Afectada
                                </p>
                                <p className="text-sm text-gray-800">
                                  {registro.entidad_afectada}
                                </p>
                              </div>

                              {/* Detalles */}
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">
                                  Detalles
                                </p>
                                <div className="space-y-1.5">
                                  {renderDetalles(registro.detalles)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Mensaje cuando no hay registros */}
                        {currentRecords.length === 0 && (
                          <div className="p-6 text-center text-gray-500">
                            No se encontraron registros
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {!loading && filteredRegistros.length > currentRecords.length && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="px-5 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Cargar más registros
                    </button>
                  </div>
                )}
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

export default ConsultarRegistros;