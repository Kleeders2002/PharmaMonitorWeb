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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex h-full">
        {/* Sidebar Fijo */}
        <div className="fixed left-0 top-0 h-screen w-64 z-50 shadow-xl">
          <Sidebar />
        </div>
        
        {/* Contenido Principal */}
        <div className="ml-64 flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header Fijo */}
          <div className="fixed top-0 left-64 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
            <HeaderDashboard title="Registros del Sistema" />
          </div>
          
          {/* Contenido Scrollable */}
          <main className="flex-1 overflow-y-auto pt-16 pb-8">
            <div className="w-full p-6 lg:p-8 xl:p-12">
              <div className="max-w-9xl mx-auto space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                          Auditoría del Sistema
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                          Registro detallado de todas las operaciones
                        </p>
                      </div>
                      
                      <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
                        <div className="flex gap-2 items-center bg-gray-50 p-1 rounded-lg">
                          {filterOptions.map(option => (
                            <button
                              key={option.value}
                              onClick={() => setSelectedFilter(option.value)}
                              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                selectedFilter === option.value 
                                  ? 'bg-white shadow-sm border border-gray-200 text-gray-900'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                        
                        <input
                          type="text"
                          placeholder="Buscar registros..."
                          className="w-full lg:w-64 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {loading ? (
                      <div className="min-h-[400px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : error ? (
                      <div className="min-h-[400px] flex items-center justify-center text-red-500">
                        {error}
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              {['Fecha y Hora', 'Usuario', 'Operación', 'Entidad', 'Detalles'].map((header) => (
                                <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentRecords.map((registro) => (
                              <tr 
                                key={registro.id}
                                className="hover:bg-gray-50 transition-colors"
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
                        
                        {currentRecords.length === 0 && (
                          <div className="p-6 text-center text-gray-500">
                            No se encontraron registros
                          </div>
                        )}
                      </div>
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
  );
};

export default ConsultarRegistros;