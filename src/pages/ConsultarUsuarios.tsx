import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { 
  Alert, 
  Typography, 
  CircularProgress, 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  InputAdornment
} from '@mui/material';
import { FaSearch, FaExclamationCircle, FaTrashAlt, FaEdit, FaUsers, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import HeaderDashboard from '../components/HeaderDashboard';
import api from '../api';

interface Usuario {
  idusuario: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  foto: string; // Nuevo campo para la foto
}

const ConsultarUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get('/usuarios/');
        const usuariosConRol = response.data.map((usuario: any) => ({
          ...usuario,
          rol: usuario.idrol === 1 ? 'Administrador' : 'Usuario',
          foto: usuario.foto || "", // Asegurar que el campo foto esté presente
        }));
        setUsuarios(usuariosConRol);
        setFilteredUsuarios(usuariosConRol);
        setError(null);
      } catch (err: any) {
        setError('Error al cargar la lista de usuarios.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setFilteredUsuarios(usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(value.toLowerCase()) ||
      usuario.apellido.toLowerCase().includes(value.toLowerCase()) ||
      usuario.email.toLowerCase().includes(value.toLowerCase()) ||
      usuario.rol.toLowerCase().includes(value.toLowerCase())
    ));
  };

  const handleEdit = (id: number) => {
    navigate(`/EditarUsuario/${id}`);
  };

  const handleClickOpen = (id: number) => {
    setSelectedUserId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUserId(null);
    setDeleteError(null);
  };

  const handleDelete = async () => {
    if (selectedUserId !== null) {
      try {
        await api.delete(`/usuarios/${selectedUserId}`);
        setDeleteSuccess('Usuario eliminado exitosamente');
        setDeleteError(null);
        setOpen(false);
        setUsuarios(usuarios.filter(usuario => usuario.idusuario !== selectedUserId));
        setFilteredUsuarios(filteredUsuarios.filter(usuario => usuario.idusuario !== selectedUserId));
      } catch (err) {
        setDeleteError('Error al eliminar el usuario');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'idusuario', headerName: 'ID', width: 90 },
    {
      field: 'foto',
      headerName: 'Foto',
      width: 120,
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="flex justify-center items-center w-full h-full">
          {params.row.foto ? (
            <img
              src={params.row.foto}
              alt="Usuario"
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <span className="text-gray-400">Sin imagen</span>
          )}
        </div>
      ),
    },
    { field: 'nombre', headerName: 'Nombre', width: 150 },
    { field: 'apellido', headerName: 'Apellido', width: 150 },
    { field: 'email', headerName: 'Correo Electrónico', width: 200 },
    { field: 'rol', headerName: 'Rol', width: 150 },
    {
      field: 'edit', 
      headerName: 'Editar', 
      width: 150, 
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<FaEdit />}
          onClick={() => handleEdit(params.row.idusuario)}
        >
          Editar
        </Button>
      ),
    },
    {
      field: 'delete',
      headerName: 'Eliminar',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          startIcon={<FaTrashAlt />}
          onClick={() => handleClickOpen(params.row.idusuario)}
        >
          Eliminar
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
       <div className="flex h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <HeaderDashboard title="Gestión de Usuarios" />
          
          <main className="flex-1 overflow-y-auto">
            <div className="h-full p-8 2xl:px-12">
              <div className="max-w-9xl mx-auto">
                {/* Panel Principal */}
                <div className="bg-white rounded-2xl shadow-xl transition-all duration-300 ease-in-out">
                  {/* Cabecera del Panel */}
                  <div className="px-8 py-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">Consulta de Usuarios</h1>
                        <p className="text-sm text-gray-500 mt-1">
                          {filteredUsuarios.length} resultados encontrados
                        </p>
                      </div>
                      
                      <div className="w-full md:w-96">
                        <TextField
                          fullWidth
                          variant="outlined"
                          label="Buscar usuario"
                          size="small"
                          value={searchTerm}
                          onChange={handleSearch}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FaSearch className="text-gray-400" />
                              </InputAdornment>
                            ),
                            className: "bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow",
                            sx: {
                              borderRadius: '1rem',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3b82f6'
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
                        <CircularProgress
                          size={80}
                          thickness={2.5}
                          className="text-blue-600"
                          sx={{
                            animationDuration: '800ms'
                          }}
                        />
                      </div>
                    ) : error ? (
                      <Alert
                        severity="error"
                        className="rounded-xl border-l-4 border-red-600 bg-red-50"
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
                      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <DataGrid
                          rows={filteredUsuarios}
                          columns={columns}
                          getRowId={(row) => row.idusuario}
                          autoHeight
                          initialState={{
                            pagination: {
                              paginationModel: { page: 0, pageSize: 8},
                            },
                          }}
                          pageSizeOptions={[8, 25, 50]}
                          slots={{
                            noRowsOverlay: () => (
                              <div className="flex flex-col justify-center items-center h-48 gap-2 text-gray-400">
                                <FaUsers className="text-4xl" />
                                <span className="text-lg">No se encontraron usuarios</span>
                              </div>
                            ),
                          }}
                          sx={{
                            '& .MuiDataGrid-columnHeaders': {
                              backgroundColor: '#f8fafc',
                              fontSize: '0.875rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              color: '#64748b',
                              borderBottom: '2px solid #e2e8f0'
                            },
                            '& .MuiDataGrid-cell': {
                              borderRight: '1px solid #f1f5f9',
                              '&:focus': {
                                outline: 'none'
                              }
                            },
                            '& .MuiDataGrid-row': {
                              transition: 'background-color 0.2s',
                              '&:hover': {
                                backgroundColor: '#f8fafc'
                              }
                            },
                            '& .MuiDataGrid-virtualScroller': {
                              minHeight: '500px',
                              scrollbarWidth: 'thin',
                              '&::-webkit-scrollbar': {
                                width: '8px',
                                height: '8px'
                              },
                              '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#cbd5e1',
                                borderRadius: '4px'
                              }
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
  
          {/* Diálogo de Confirmación */}
          <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              className: "rounded-2xl max-w-md w-full mx-4 shadow-2xl",
            }}
          >
            <DialogTitle className="bg-blue-50 px-8 py-6 border-b border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaExclamationCircle className="text-red-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Confirmar eliminación</h2>
                  <p className="text-sm text-gray-500 mt-1">Esta acción no se puede deshacer</p>
                </div>
              </div>
            </DialogTitle>
  
            <DialogContent className="px-8 py-6">
              <DialogContentText className="text-gray-700 leading-relaxed">
                Estás a punto de eliminar permanentemente al usuario con ID{' '}
                <span className="font-semibold text-red-600">{selectedUserId}</span>.
                ¿Deseas continuar con esta acción?
              </DialogContentText>
  
              <div className="mt-6 space-y-3">
                {deleteError && (
                  <Alert
                    severity="error"
                    className="rounded-lg border-l-4 border-red-600 bg-red-50"
                    icon={<FaExclamationCircle />}
                  >
                    <span className="text-red-800">{deleteError}</span>
                  </Alert>
                )}
                {deleteSuccess && (
                  <Alert
                    severity="success"
                    className="rounded-lg border-l-4 border-green-600 bg-green-50"
                    icon={<FaCheckCircle />}
                  >
                    <span className="text-green-800">{deleteSuccess}</span>
                  </Alert>
                )}
              </div>
            </DialogContent>
  
            <DialogActions className="px-8 py-5 bg-gray-50 border-t border-gray-100">
              <div className="flex w-full justify-between">
                <Button
                  onClick={handleClose}
                  variant="text"
                  className="text-gray-600 hover:bg-gray-100 px-5 py-2 rounded-lg"
                  startIcon={<FaTimes />}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="contained"
                  color="error"
                  className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white shadow-sm hover:shadow-md transition-all"
                  startIcon={<FaTrashAlt />}
                >
                  Confirmar Eliminación
                </Button>
              </div>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ConsultarUsuarios;