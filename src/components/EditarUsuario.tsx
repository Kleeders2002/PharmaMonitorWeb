import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaUserTag, FaCamera, FaTimes } from 'react-icons/fa';
import { Alert, Button, TextField, MenuItem, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import api from '../api';
import HeaderDashboard from '../components/HeaderDashboard';
import Sidebar from '../components/Sidebar';

const EditarUsuario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    idrol: 1,
    foto: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/usuarios/${id}`);
        setFormData({
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          email: response.data.email,
          idrol: response.data.idrol,
          foto: response.data.foto || '',
        });
        if (response.data.foto) setPreview(response.data.foto);
      } catch (error: any) {
        setError('Error al cargar los datos del usuario.');
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFormData(prev => ({ ...prev, foto: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const response = await api.post("/upload-image/", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if ([200, 201].includes(response.status)) {
        setFormData(prev => ({ ...prev, foto: response.data.url }));
        setPreview(response.data.url);
      }
    } catch (error) {
      console.error("Error al subir imagen:", error);
      setError('Error al subir la imagen del usuario');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await api.put(`/usuarios/${id}`, formData);

      if (response.status === 200) {
        setSuccess('Usuario actualizado exitosamente');
        setTimeout(() => navigate('/usuarios'), 2000);
      }
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Error inesperado al actualizar el usuario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex h-full">
        <Sidebar />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <HeaderDashboard title="Editar Usuario" />
          
          <main className="flex-1 overflow-y-auto">
            <div className="w-full p-8 2xl:px-12">
              <div className="max-w-9xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl transition-all duration-300 ease-in-out">
                  <div className="px-8 py-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          Editar Usuario
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                          Actualiza los campos que deseas modificar
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 lg:p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sección Foto */}
                        <div className="w-full lg:w-1/3 flex flex-col items-center">
                          <div className="relative group w-full">
                            <label 
                              htmlFor="image-upload"
                              className="w-full aspect-square rounded-xl bg-gray-50 flex items-center justify-center cursor-pointer 
                                transition-all duration-300 hover:bg-gray-100 border-2 border-dashed border-blue-200
                                overflow-hidden shadow-sm hover:shadow-md relative"
                            >
                              {preview ? (
                                <>
                                  <img 
                                    src={preview} 
                                    alt="Vista previa del usuario" 
                                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                                  />
                                  <IconButton
                                    className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-lg"
                                    onClick={handleRemoveImage}
                                  >
                                    <FaTimes className="text-red-600" />
                                  </IconButton>
                                </>
                              ) : (
                                <div className="text-center p-4 space-y-2">
                                  <FaCamera className="text-3xl text-blue-400 mb-2 mx-auto transition-colors" />
                                  <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                                    {formData.foto ? 'Cambiar foto' : 'Subir foto de perfil'}
                                  </span>
                                </div>
                              )}
                              <div className="absolute inset-0 ring-1 ring-inset ring-gray-200/50 rounded-xl" />
                            </label>
                            <input
                              id="image-upload"
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              accept="image/png, image/jpeg, image/webp"
                              onChange={handleFileChange}
                            />
                          </div>
                          <span className="text-sm text-gray-500 mt-4 text-center">
                            Formatos soportados: JPG, PNG, WEBP<br/>
                            Tamaño máximo: 5MB
                          </span>
                        </div>

                        {/* Formulario */}
                        <div className="w-full lg:w-2/3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextField
                              label="Nombre"
                              name="nombre"
                              value={formData.nombre}
                              onChange={handleChange}
                              required
                              fullWidth
                              variant="outlined"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  '&:hover fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                }
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <FaUser className="text-blue-500" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                            
                            <TextField
                              label="Apellido"
                              name="apellido"
                              value={formData.apellido}
                              onChange={handleChange}
                              required
                              fullWidth
                              variant="outlined"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  '&:hover fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                }
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <FaUser className="text-blue-500" />
                                  </InputAdornment>
                                ),
                              }}
                            />

                            <TextField
                              label="Correo Electrónico"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              fullWidth
                              variant="outlined"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  '&:hover fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                }
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <FaEnvelope className="text-blue-500" />
                                  </InputAdornment>
                                ),
                              }}
                            />

                            <div className="md:col-span-2">
                              <TextField
                                select
                                label="Rol del Usuario"
                                name="idrol"
                                value={formData.idrol}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover fieldset': {
                                      borderColor: '#2563eb',
                                    },
                                  }
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <FaUserTag className="text-blue-500" />
                                    </InputAdornment>
                                  ),
                                }}
                              >
                                <MenuItem value={1} sx={{ '&:hover': { backgroundColor: '#f0f9ff' } }}>
                                  Administrador
                                </MenuItem>
                                <MenuItem value={2} sx={{ '&:hover': { backgroundColor: '#f0f9ff' } }}>
                                  Usuario Estándar
                                </MenuItem>
                              </TextField>
                            </div>
                          </div>

                          <div className="mt-10 space-y-6">
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              fullWidth
                              size="large"
                              disabled={isSubmitting}
                              sx={{
                                height: '50px',
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: 600,
                                background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                                '&:hover': {
                                  background: 'linear-gradient(to right, #1d4ed8, #1e40af)',
                                }
                              }}
                            >
                              {isSubmitting ? (
                                <CircularProgress size={24} color="inherit" />
                              ) : (
                                'Guardar Cambios'
                              )}
                            </Button>

                            <div className="space-y-4">
                              {error && (
                                <Alert 
                                  severity="error" 
                                  sx={{
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                  }}
                                >
                                  {error}
                                </Alert>
                              )}
                              {success && (
                                <Alert 
                                  severity="success" 
                                  sx={{
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                  }}
                                >
                                  {success}
                                </Alert>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EditarUsuario;