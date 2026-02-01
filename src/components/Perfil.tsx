import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaEnvelope, FaLock, FaCamera } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
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
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <>
      <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <div className="flex h-full">
          <Sidebar />

          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <HeaderDashboard title="Mi Perfil" />

            <main className="flex-1 overflow-y-auto">
              <div className={`w-full p-8 2xl:px-12 transition-all duration-700 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <div className="max-w-9xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 animate-fade-in-down">
                  <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8 overflow-hidden">
                    {/* Animated background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-4 animate-fade-in">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-purple-700">Cuenta de Usuario</span>
                      </div>

                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        Mi
                        <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-shift ml-2">
                          Perfil
                        </span>
                      </h1>
                      <p className="text-base text-gray-600 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        Administra tu información personal y seguridad
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className="p-8">

                      <div className="p-6 lg:p-8">
                        {!showChangePassword ? (
                          <div className="flex flex-col lg:flex-row gap-8">
                            {/* Sección Foto */}
                            <div className="w-full lg:w-1/3 flex flex-col items-center">
                              <div className="relative group w-full">
                                <label
                                  htmlFor="image-upload"
                                  className="w-full aspect-square rounded-xl bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center cursor-pointer
                                    transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-dashed border-purple-200 hover:border-purple-300
                                    overflow-hidden shadow-sm relative"
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
                                        <FiX className="text-red-600" />
                                      </IconButton>
                                    </>
                                  ) : (
                                    <div className="text-center p-4 space-y-2">
                                      <div className="inline-flex p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full shadow-sm">
                                        <FaCamera className="text-3xl text-purple-600 transition-colors" />
                                      </div>
                                      <span className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors font-medium">
                                        Subir foto de perfil
                                      </span>
                                    </div>
                                  )}
                                  <div className="absolute inset-0 ring-1 ring-inset ring-purple-100/50 rounded-xl" />
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
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                          transform: 'translateY(-1px)',
                                          boxShadow: '0 4px 12px rgba(147, 51, 234, 0.1)',
                                        },
                                        '&.Mui-focused': {
                                          boxShadow: '0 0 0 4px rgba(147, 51, 234, 0.1)',
                                        },
                                      }
                                    }}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <FaUser className="text-purple-500" />
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
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                          transform: 'translateY(-1px)',
                                          boxShadow: '0 4px 12px rgba(147, 51, 234, 0.1)',
                                        },
                                        '&.Mui-focused': {
                                          boxShadow: '0 0 0 4px rgba(147, 51, 234, 0.1)',
                                        },
                                      }
                                    }}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <FaUser className="text-purple-500" />
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
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                          transform: 'translateY(-1px)',
                                          boxShadow: '0 4px 12px rgba(147, 51, 234, 0.1)',
                                        },
                                        '&.Mui-focused': {
                                          boxShadow: '0 0 0 4px rgba(147, 51, 234, 0.1)',
                                        },
                                      }
                                    }}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <FaEnvelope className="text-purple-500" />
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
                                        height: '56px',
                                        borderRadius: '14px',
                                        textTransform: 'none',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)',
                                        boxShadow: '0 4px 14px rgba(147, 51, 234, 0.3)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                          background: 'linear-gradient(135deg, #7e22ce 0%, #2563eb 100%)',
                                          boxShadow: '0 6px 20px rgba(147, 51, 234, 0.4)',
                                          transform: 'translateY(-2px)',
                                        },
                                        '&:active': {
                                          transform: 'translateY(0)',
                                        },
                                        '&:disabled': {
                                          background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
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
                                        color: '#9333ea',
                                        '&:hover': {
                                          backgroundColor: 'transparent',
                                          color: '#7e22ce',
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
                              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-100">
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
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                          transform: 'translateY(-1px)',
                                          boxShadow: '0 4px 12px rgba(147, 51, 234, 0.1)',
                                        },
                                        '&.Mui-focused': {
                                          boxShadow: '0 0 0 4px rgba(147, 51, 234, 0.1)',
                                        },
                                      }
                                    }}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <FaLock className="text-purple-500" />
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
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                          transform: 'translateY(-1px)',
                                          boxShadow: '0 4px 12px rgba(147, 51, 234, 0.1)',
                                        },
                                        '&.Mui-focused': {
                                          boxShadow: '0 0 0 4px rgba(147, 51, 234, 0.1)',
                                        },
                                      }
                                    }}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <FaLock className="text-purple-500" />
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-4">
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
                                      backgroundColor: '#f3f4f6',
                                      transform: 'translateY(-1px)',
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    },
                                    transition: 'all 0.2s ease',
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
                                    background: 'linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)',
                                    boxShadow: '0 4px 14px rgba(147, 51, 234, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      background: 'linear-gradient(135deg, #7e22ce 0%, #2563eb 100%)',
                                      boxShadow: '0 6px 20px rgba(147, 51, 234, 0.4)',
                                      transform: 'translateY(-2px)',
                                    },
                                    '&:active': {
                                      transform: 'translateY(0)',
                                    },
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
              </div>
            </main>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          opacity: 0;
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-fade-in {
          opacity: 0;
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 5s ease infinite;
        }
      `}</style>
    </>
  );
};

export default Perfil;