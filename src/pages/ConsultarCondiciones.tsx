import React, { useEffect, useState } from 'react';
import { 
  Alert,
  Typography,
  CircularProgress,
  TextField,
  InputAdornment,
  Button
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { FaSearch, FaExclamationTriangle, FaBox, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import HeaderDashboard from '../components/HeaderDashboard';
import api from '../api';
import Tooltip from '@mui/material/Tooltip';
import EditarCondicionDialog, { CondicionAlmacenamiento } from '../components/EditarCondicionDialog';

interface Condicion {
  id: number;
  nombre: string;
  temperatura_min: number;
  temperatura_max: number;
  humedad_min: number;
  humedad_max: number;
  lux_min: number;
  lux_max: number;
  presion_min: number;
  presion_max: number;
  fecha_actualizacion: string;
}

const ConsultarCondiciones: React.FC = () => {
  const [condiciones, setCondiciones] = useState<Condicion[]>([]);
  const [filteredCondiciones, setFilteredCondiciones] = useState<Condicion[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedCondition, setSelectedCondition] = useState<CondicionAlmacenamiento | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCondiciones = async () => {
      try {
        const response = await api.get('/condiciones/');
        const condicionesFormateadas = response.data.map((condicion: any) => ({
          ...condicion,
          fecha_actualizacion: new Date(condicion.fecha_actualizacion).toLocaleDateString()
        }));
        setCondiciones(condicionesFormateadas);
        setFilteredCondiciones(condicionesFormateadas);
        setError(null);
      } catch (err: any) {
        setError('Error al cargar las condiciones de almacenamiento.');
      } finally {
        setLoading(false);
      }
    };

    fetchCondiciones();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setFilteredCondiciones(
      condiciones.filter(condicion =>
        condicion.nombre.toLowerCase().includes(value.toLowerCase()) ||
        condicion.fecha_actualizacion.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleEdit = (id: number) => {
    const conditionToEdit = condiciones.find(cond => cond.id === id);
    if (conditionToEdit) {
      setSelectedCondition({
        id: conditionToEdit.id,
        nombre: conditionToEdit.nombre,
        temperatura_min: conditionToEdit.temperatura_min.toString(),
        temperatura_max: conditionToEdit.temperatura_max.toString(),
        humedad_min: conditionToEdit.humedad_min.toString(),
        humedad_max: conditionToEdit.humedad_max.toString(),
        lux_min: conditionToEdit.lux_min.toString(),
        lux_max: conditionToEdit.lux_max.toString(),
        presion_min: conditionToEdit.presion_min.toString(),
        presion_max: conditionToEdit.presion_max.toString(),
      });
      setDialogOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/condiciones/${id}`);
      const updatedCondiciones = condiciones.filter(condicion => condicion.id !== id);
      setCondiciones(updatedCondiciones);
      setFilteredCondiciones(
        updatedCondiciones.filter(condicion =>
          condicion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          condicion.fecha_actualizacion.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } catch (err: any) {
      setError('Error al eliminar la condición.');
    }
  };

  const handleUpdateCondition = async () => {
    if (!selectedCondition || !selectedCondition.id) return;
    try {
      await api.put(`/condiciones/${selectedCondition.id}`, selectedCondition);
      
      const updatedCondiciones = condiciones.map(condicion =>
        condicion.id === selectedCondition.id ? {
          ...condicion,
          ...selectedCondition,
          temperatura_min: Number(selectedCondition.temperatura_min),
          temperatura_max: Number(selectedCondition.temperatura_max),
          humedad_min: Number(selectedCondition.humedad_min),
          humedad_max: Number(selectedCondition.humedad_max),
          lux_min: Number(selectedCondition.lux_min),
          lux_max: Number(selectedCondition.lux_max),
          presion_min: Number(selectedCondition.presion_min),
          presion_max: Number(selectedCondition.presion_max),
        } : condicion
      );

      setCondiciones(updatedCondiciones);
      setFilteredCondiciones(
        updatedCondiciones.filter(condicion =>
          condicion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          condicion.fecha_actualizacion.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setDialogOpen(false);
      setSelectedCondition(null);
    } catch (err: any) {
      setError('Error al actualizar la condición.');
    }
  };

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 90, 
      headerAlign: 'center', 
      align: 'center' 
    },
    { 
      field: 'nombre', 
      headerName: 'Nombre', 
      width: 120, 
      headerAlign: 'center', 
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.value || ''}>
          <div className="flex flex-wrap items-center justify-center h-full text-center whitespace-normal leading-relaxed p-2">
            {params.value}
          </div>
        </Tooltip>
      )
    },
    { 
      field: 'temperatura', 
      headerName: 'Temperatura (°C)', 
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex items-center justify-center h-full text-center p-2">
          {`${params.row.temperatura_min} - ${params.row.temperatura_max}`}
        </div>
      )
    },
    { 
      field: 'humedad', 
      headerName: 'Humedad (%)', 
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex items-center justify-center h-full text-center p-2">
          {`${params.row.humedad_min} - ${params.row.humedad_max}`}
        </div>
      )
    },
    { 
      field: 'lux', 
      headerName: 'Lux', 
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex items-center justify-center h-full text-center p-2">
          {`${params.row.lux_min} - ${params.row.lux_max}`}
        </div>
      )
    },
    { 
      field: 'presion', 
      headerName: 'Presión (hPa)', 
      width: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex items-center justify-center h-full text-center p-2">
          {`${params.row.presion_min} - ${params.row.presion_max}`}
        </div>
      )
    },
    { 
      field: 'fecha_actualizacion', 
      headerName: 'Última Actualización', 
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex items-center justify-center h-full text-center p-2">
          {params.value}
        </div>
      )
    },
    {
      field: 'edit',
      headerName: 'Editar',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex justify-center items-center w-full h-full">
          <Button
            variant="contained"
            size="small"
            startIcon={<FaEdit />}
            className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-lg"
            onClick={() => handleEdit(params.row.id)}
          >
            Editar
          </Button>
        </div>
      )
    },
    {
      field: 'delete',
      headerName: 'Eliminar',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const isRelated = params.row.is_related;
        return (
          <div className="flex justify-center items-center w-full h-full">
            <Tooltip title={isRelated ? "No se puede eliminar porque está relacionada" : ""}>
              {/* El botón se envuelve en un <span> para que el tooltip funcione en botones deshabilitados */}
              <span>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<FaTrashAlt />}
                  className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isRelated}
                  onClick={() => !isRelated && handleDelete(params.row.id)}
                >
                  Eliminar
                </Button>
              </span>
            </Tooltip>
          </div>
        );
      }
    }
    
  ];

  return (
    <>
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="flex h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <HeaderDashboard title="Gestión de Condiciones" />

          <main className="flex-1 overflow-y-auto">
            <div className="w-full p-8 2xl:px-12">
              <div className="max-w-9xl mx-auto">
                {/* Panel Principal */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 transition-all duration-300 ease-in-out">
                  {/* Cabecera del Panel */}
                  <div className="px-8 py-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">Condiciones de Almacenamiento</h1>
                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                          {filteredCondiciones.length} resultados encontrados
                        </p>
                      </div>

                      <div className="w-full md:w-96">
                        <TextField
                          fullWidth
                          variant="outlined"
                          label="Buscar condiciones"
                          size="small"
                          value={searchTerm}
                          onChange={handleSearch}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FaSearch className="text-gray-400" />
                              </InputAdornment>
                            ),
                            className: "bg-white/80 backdrop-blur rounded-xl shadow-sm hover:shadow-md transition-all duration-300",
                            sx: {
                              borderRadius: '1rem',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3b82f6'
                              },
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#e2e8f0'
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6 lg:p-8">
                    {loading ? (
                      <div className="flex justify-center items-center min-h-[500px]">
                        <div className="text-center">
                          <CircularProgress
                            size={80}
                            thickness={2.5}
                            className="text-blue-600"
                            sx={{ animationDuration: '800ms' }}
                          />
                          <p className="mt-4 text-gray-600 font-medium animate-pulse">Cargando condiciones...</p>
                        </div>
                      </div>
                    ) : error ? (
                      <Alert
                        severity="error"
                        className="rounded-xl border-l-4 border-red-600 bg-red-50 backdrop-blur-sm"
                        icon={<FaExclamationTriangle className="mt-1" />}
                      >
                        <Typography variant="body1" className="font-semibold text-red-800">
                          Error de carga
                        </Typography>
                        <Typography variant="body2" className="text-red-700">
                          {error}
                        </Typography>
                      </Alert>
                    ) : (
                      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                        <DataGrid
                          rows={filteredCondiciones}
                          columns={columns}
                          getRowId={(row: Condicion) => row.id}
                          autoHeight
                          rowHeight={80}
                          initialState={{
                            pagination: {
                              paginationModel: { page: 0, pageSize: 8 },
                            },
                          }}
                          pageSizeOptions={[8, 25, 50]}
                          slots={{
                            noRowsOverlay: () => (
                              <div className="flex flex-col justify-center items-center h-48 gap-2 text-gray-400">
                                <FaBox className="text-4xl" />
                                <span className="text-lg">No se encontraron condiciones</span>
                              </div>
                            ),
                          }}
                          sx={{
                            "& .MuiDataGrid-columnHeaders": {
                              backgroundColor: "#f8fafc",
                              fontSize: "0.675rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              color: "#64748b",
                              borderBottom: "2px solid #e2e8f0",
                              minHeight: "0px"
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                              whiteSpace: "normal",
                              lineHeight: "1.2",
                              textAlign: "center",
                            },
                            "& .MuiDataGrid-cell": {
                              borderRight: "1px solid #f1f5f9",
                              "&:focus": {
                                outline: "none",
                              },
                            },
                            "& .MuiDataGrid-row": {
                              transition: "all 0.2s ease",
                              animation: "fadeInUp 0.3s ease-out",
                              "&:hover": {
                                backgroundColor: "rgba(59, 130, 246, 0.04)",
                                transform: "scale(1.01)",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                              },
                            },
                            "& .MuiDataGrid-virtualScroller": {
                              minHeight: "500px",
                              scrollbarWidth: "thin",
                              "&::-webkit-scrollbar": {
                                width: "8px",
                                height: "8px",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#cbd5e1",
                                borderRadius: "4px",
                              },
                            },
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
  
          {/* Diálogo de edición */}
          {dialogOpen && selectedCondition && (
            <EditarCondicionDialog 
              open={dialogOpen}
              onClose={() => {
                setDialogOpen(false);
                setSelectedCondition(null);
              }}
              condiciones={selectedCondition}
              handleCondicionesChange={
                (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  if (!selectedCondition) return;
                  setSelectedCondition({
                    ...selectedCondition,
                    [e.target.name]: e.target.value
                  });
                }
              }
              handleActualizar={handleUpdateCondition}
            />
          )}
  
        </div>
      </div>
    </div>

    <style>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
    </>
  );
};

export default ConsultarCondiciones;