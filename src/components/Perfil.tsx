import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaEnvelope, FaLock, FaCamera, FaTimes } from 'react-icons/fa';
import { Alert, Button, TextField, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import api from '../api';
import HeaderDashboard from '../components/HeaderDashboard';
import Sidebar from '../components/Sidebar';

const Perfil: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    foto: '',
  });
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/perfil');
        setFormData({
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          email: response.data.email,
          foto: response.data.foto || '',
        });
        if (response.data.foto) setPreview(response.data.foto);
      } catch (error) {
        setError('Error al cargar los datos del perfil');
      }
    };

    fetchUserData();
  }, []);

  // Nuevo efecto para limpiar errores al cambiar de formulario
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [showChangePassword]);

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
      setError('Error al subir la imagen de perfil');
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFormData(prev => ({ ...prev, foto: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await api.put('/perfil', formData);
      if (response.status === 200) {
        setSuccess('Perfil actualizado exitosamente');
      }
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Error al actualizar el perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  // CAMBIO CRÍTICO 1: Nombre del campo y manejo de errores
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      // Cambiado de 'password' a 'new_password'
      const response = await api.put('/perfil/password', { 
        new_password: newPassword // <- Campo corregido aquí
      });
      
      if (response.status === 200) {
        setSuccess('Contraseña actualizada exitosamente');
        setNewPassword('');
        setConfirmPassword('');
        setShowChangePassword(false);
      }
    } catch (error: any) {
      // CAMBIO CRÍTICO 2: Manejo correcto del error de FastAPI
      const errorDetail = error.response?.data?.detail;
      const errorMessage = Array.isArray(errorDetail) && errorDetail.length > 0 
        ? errorDetail[0].msg 
        : 'Error al actualizar la contraseña';
      
      setError(errorMessage);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex h-full">
        <Sidebar />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <HeaderDashboard title="Mi Perfil" />
          
          <main className="flex-1 overflow-y-auto">
            <div className="w-full p-8 2xl:px-12">
              <div className="max-w-9xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl transition-all duration-300 ease-in-out">
                  <div className="px-8 py-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          Mi Perfil
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                          Administra tu información personal y seguridad
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 lg:p-8">
                    {!showChangePassword ? (
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
                                    alt="Vista previa del perfil" 
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

                        {/* Formulario de perfil */}
                        <div className="w-full lg:w-2/3">
                          <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <TextField
                                label="Nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                                required
                                fullWidth
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover fieldset': { borderColor: '#2563eb' },
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
                                onChange={(e) => setFormData(prev => ({ ...prev, apellido: e.target.value }))}
                                required
                                fullWidth
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover fieldset': { borderColor: '#2563eb' },
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
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                required
                                fullWidth
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover fieldset': { borderColor: '#2563eb' },
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
                            </div>

                            <div className="flex flex-col gap-6">
                              <div className="mt-4">
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
                              </div>

                              <div className="text-center">
                                <Button
                                  variant="text"
                                  color="primary"
                                  onClick={() => setShowChangePassword(true)}
                                  sx={{
                                    textTransform: 'none',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: '#2563eb',
                                    '&:hover': {
                                      backgroundColor: 'transparent',
                                      color: '#1e40af',
                                    }
                                  }}
                                  startIcon={<FaLock className="text-sm" />}
                                >
                                  Cambiar Contraseña
                                </Button>
                              </div>
                            </div>

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
                          </form>
                        </div>
                      </div>
                    ) : (
                      /* Formulario de contraseña sin foto */
                      <div className="w-full max-w-2xl mx-auto">
                        <form onSubmit={handlePasswordChange} className="space-y-6">
                          <div className="bg-blue-50 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                              Cambio de Contraseña
                            </h3>
                            
                            <div className="space-y-4">
                              <TextField
                                label="Nueva Contraseña"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover fieldset': { borderColor: '#2563eb' },
                                  }
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <FaLock className="text-blue-500" />
                                    </InputAdornment>
                                  ),
                                }}
                              />

                              <TextField
                                label="Confirmar Contraseña"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover fieldset': { borderColor: '#2563eb' },
                                  }
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <FaLock className="text-blue-500" />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <Button
                              type="button"
                              variant="outlined"
                              color="secondary"
                              fullWidth
                              onClick={() => setShowChangePassword(false)}
                              sx={{
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: 600,
                                borderColor: '#d1d5db',
                                color: '#374151',
                                '&:hover': {
                                  borderColor: '#9ca3af',
                                  backgroundColor: '#f3f4f6'
                                }
                              }}
                            >
                              Volver al Perfil
                            </Button>

                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              fullWidth
                              sx={{
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
                              Confirmar Nueva Contraseña
                            </Button>
                          </div>

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
                        </form>
                      </div>
                    )}
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

export default Perfil;