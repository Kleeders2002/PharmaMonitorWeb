import React, { useState, useEffect } from 'react';
import {
  Alert,
  Button,
  TextField,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  FaClipboardList,
  FaThermometerHalf,
  FaTint,
  FaSun,
  FaWeight,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import api from '../api';
import HeaderDashboard from '../components/HeaderDashboard';
import Sidebar from '../components/Sidebar';

const AgregarCondicionAmbiental: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    temperatura_min: '',
    temperatura_max: '',
    humedad_min: '',
    humedad_max: '',
    lux_min: '',
    lux_max: '',
    presion_min: '',
    presion_max: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    temperatura?: string;
    humedad?: string;
    lux?: string;
    presion?: string;
  }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validar en tiempo real
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    const numValue = parseFloat(value);
    const errors = { ...validationErrors };

    // Validar temperatura
    if (name === 'temperatura_min' && formData.temperatura_max) {
      const max = parseFloat(formData.temperatura_max);
      if (numValue >= max) {
        errors.temperatura = 'La temperatura mínima debe ser menor a la máxima';
      } else if (numValue < -50) {
        errors.temperatura = 'La temperatura mínima no puede ser menor de -50°C';
      } else {
        delete errors.temperatura;
      }
    } else if (name === 'temperatura_max' && formData.temperatura_min) {
      const min = parseFloat(formData.temperatura_min);
      if (numValue <= min) {
        errors.temperatura = 'La temperatura máxima debe ser mayor a la mínima';
      } else if (numValue > 100) {
        errors.temperatura = 'La temperatura máxima no puede ser mayor de 100°C';
      } else {
        delete errors.temperatura;
      }
    }

    // Validar humedad
    if (name === 'humedad_min' && formData.humedad_max) {
      const max = parseFloat(formData.humedad_max);
      if (numValue >= max) {
        errors.humedad = 'La humedad mínima debe ser menor a la máxima';
      } else if (numValue < 0) {
        errors.humedad = 'La humedad mínima no puede ser negativa';
      } else {
        delete errors.humedad;
      }
    } else if (name === 'humedad_max' && formData.humedad_min) {
      const min = parseFloat(formData.humedad_min);
      if (numValue <= min) {
        errors.humedad = 'La humedad máxima debe ser mayor a la mínima';
      } else if (numValue > 100) {
        errors.humedad = 'La humedad máxima no puede ser mayor de 100%';
      } else {
        delete errors.humedad;
      }
    }

    // Validar lux
    if (name === 'lux_min') {
      if (numValue < 0) {
        errors.lux = 'El valor de lux no puede ser negativo';
      } else if (formData.lux_max && numValue >= parseFloat(formData.lux_max)) {
        errors.lux = 'El lux mínimo debe ser menor al máximo';
      } else {
        delete errors.lux;
      }
    } else if (name === 'lux_max' && formData.lux_min) {
      const min = parseFloat(formData.lux_min);
      if (numValue <= min) {
        errors.lux = 'El lux máximo debe ser mayor al mínimo';
      } else if (numValue > 100000) {
        errors.lux = 'El lux máximo no puede ser mayor de 100,000';
      } else {
        delete errors.lux;
      }
    }

    // Validar presión
    if (name === 'presion_min' && formData.presion_max) {
      const max = parseFloat(formData.presion_max);
      if (numValue >= max) {
        errors.presion = 'La presión mínima debe ser menor a la máxima';
      } else if (numValue < 100) {
        errors.presion = 'La presión mínima no puede ser menor de 100 hPa';
      } else {
        delete errors.presion;
      }
    } else if (name === 'presion_max' && formData.presion_min) {
      const min = parseFloat(formData.presion_min);
      if (numValue <= min) {
        errors.presion = 'La presión máxima debe ser mayor a la mínima';
      } else if (numValue > 1500) {
        errors.presion = 'La presión máxima no puede ser mayor de 1500 hPa';
      } else {
        delete errors.presion;
      }
    }

    setValidationErrors(errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    // Validaciones
    const temp_min = parseFloat(formData.temperatura_min);
    const temp_max = parseFloat(formData.temperatura_max);
    const hum_min = parseFloat(formData.humedad_min);
    const hum_max = parseFloat(formData.humedad_max);
    const lux_min = parseFloat(formData.lux_min);
    const lux_max = parseFloat(formData.lux_max);
    const pres_min = parseFloat(formData.presion_min);
    const pres_max = parseFloat(formData.presion_max);

    // Validar temperatura
    if (isNaN(temp_min) || isNaN(temp_max)) {
      setError('Los valores de temperatura son obligatorios');
      setIsSubmitting(false);
      return;
    }
    if (temp_min >= temp_max) {
      setError('La temperatura mínima debe ser menor a la temperatura máxima');
      setIsSubmitting(false);
      return;
    }
    if (temp_min < -50 || temp_max > 100) {
      setError('Los valores de temperatura deben estar entre -50°C y 100°C');
      setIsSubmitting(false);
      return;
    }

    // Validar humedad
    if (isNaN(hum_min) || isNaN(hum_max)) {
      setError('Los valores de humedad son obligatorios');
      setIsSubmitting(false);
      return;
    }
    if (hum_min >= hum_max) {
      setError('La humedad mínima debe ser menor a la humedad máxima');
      setIsSubmitting(false);
      return;
    }
    if (hum_min < 0 || hum_max > 100) {
      setError('Los valores de humedad deben estar entre 0% y 100%');
      setIsSubmitting(false);
      return;
    }

    // Validar lux
    if (isNaN(lux_min) || isNaN(lux_max)) {
      setError('Los valores de iluminación son obligatorios');
      setIsSubmitting(false);
      return;
    }
    if (lux_min < 0 || lux_max < 0) {
      setError('Los valores de lux no pueden ser negativos');
      setIsSubmitting(false);
      return;
    }
    if (lux_min >= lux_max) {
      setError('El valor de lux mínimo debe ser menor al lux máximo');
      setIsSubmitting(false);
      return;
    }
    if (lux_max > 100000) {
      setError('El valor de lux máximo no puede superar 100,000 lux');
      setIsSubmitting(false);
      return;
    }

    // Validar presión
    if (isNaN(pres_min) || isNaN(pres_max)) {
      setError('Los valores de presión son obligatorios');
      setIsSubmitting(false);
      return;
    }
    if (pres_min >= pres_max) {
      setError('La presión mínima debe ser menor a la presión máxima');
      setIsSubmitting(false);
      return;
    }
    if (pres_min < 100 || pres_max > 1500) {
      setError('Los valores de presión deben estar entre 100 hPa y 1500 hPa');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post('/condiciones/', formData);
      if (response.status === 200) {
        setSuccess('Condición ambiental agregada exitosamente');
        setFormData({
          nombre: '',
          temperatura_min: '',
          temperatura_max: '',
          humedad_min: '',
          humedad_max: '',
          lux_min: '',
          lux_max: '',
          presion_min: '',
          presion_max: '',
        });
      }
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Error inesperado al agregar la condición ambiental.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const SectionTitle = ({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) => (
    <div className="flex items-center gap-4 my-8">
      <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl shadow-sm">
        <span className="text-blue-600 text-xl">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-800">{children}</h3>
    </div>
  );

  return (
    <>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <Sidebar />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <HeaderDashboard title="Agregar Condición Ambiental" />

          <main className="flex-1 overflow-y-auto">
            <div className={`max-w-7xl mx-auto p-8 transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
            {/* Header Section */}
            <div className="mb-8 animate-fade-in-down">
              <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8 overflow-hidden">
                {/* Animated background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/10 to-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mb-4 animate-fade-in">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-blue-700">Control Ambiental</span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    Nueva Condición
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-shift ml-2">
                      Ambiental
                    </span>
                  </h1>
                  <p className="text-base text-gray-600 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    Define los parámetros de almacenamiento requeridos
                  </p>
                </div>
              </div>
            </div>

            {/* Main Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="p-8">
                  
                  <div className="p-6 lg:p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <TextField
                        label="Nombre de la Condición"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        fullWidth
                        required
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
                              <FaClipboardList className="text-blue-500" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <hr className="my-8 border-gray-200" />

                      <SectionTitle icon={<FaThermometerHalf />}>
                        Parámetros de Temperatura
                      </SectionTitle>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                          label="Temperatura Mínima"
                          name="temperatura_min"
                          value={formData.temperatura_min}
                          onChange={handleChange}
                          required
                          type="number"
                          placeholder="Ej: 2"
                          error={!!validationErrors.temperatura}
                          helperText={validationErrors.temperatura || 'Rango: -50°C a 100°C'}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
                              },
                              '&.Mui-focused': {
                                boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
                              },
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FaArrowDown className="text-blue-500" />
                              </InputAdornment>
                            ),
                            endAdornment: <InputAdornment position="end">°C</InputAdornment>,
                          }}
                        />
                        
                        <TextField
                          label="Temperatura Máxima"
                          name="temperatura_max"
                          value={formData.temperatura_max}
                          onChange={handleChange}
                          required
                          type="number"
                          placeholder="Ej: 8"
                          error={!!validationErrors.temperatura}
                          helperText={validationErrors.temperatura || 'Rango: -50°C a 100°C'}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
                              },
                              '&.Mui-focused': {
                                boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
                              },
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FaArrowUp className="text-blue-500" />
                              </InputAdornment>
                            ),
                            endAdornment: <InputAdornment position="end">°C</InputAdornment>,
                          }}
                        />
                      </div>

                      <hr className="my-8 border-gray-200" />

                      <SectionTitle icon={<FaTint />}>
                        Parámetros de Humedad
                      </SectionTitle>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                          label="Humedad Mínima"
                          name="humedad_min"
                          value={formData.humedad_min}
                          onChange={handleChange}
                          required
                          type="number"
                          placeholder="Ej: 30"
                          error={!!validationErrors.humedad}
                          helperText={validationErrors.humedad || 'Rango: 0% a 100%'}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
                              },
                              '&.Mui-focused': {
                                boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
                              },
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FaArrowDown className="text-blue-500" />
                              </InputAdornment>
                            ),
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                        />
                        
                        <TextField
                          label="Humedad Máxima"
                          name="humedad_max"
                          value={formData.humedad_max}
                          onChange={handleChange}
                          required
                          type="number"
                          placeholder="Ej: 60"
                          error={!!validationErrors.humedad}
                          helperText={validationErrors.humedad || 'Rango: 0% a 100%'}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
                              },
                              '&.Mui-focused': {
                                boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
                              },
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FaArrowUp className="text-blue-500" />
                              </InputAdornment>
                            ),
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                        />
                      </div>

                      <hr className="my-8 border-gray-200" />

                      <SectionTitle icon={<FaSun />}>
                        Control de Iluminación
                      </SectionTitle>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                          label="Lux Mínimo"
                          name="lux_min"
                          value={formData.lux_min}
                          onChange={handleChange}
                          required
                          type="number"
                          placeholder="Ej: 0"
                          error={!!validationErrors.lux}
                          helperText={validationErrors.lux || 'Mínimo: 0 lux, Máximo: 100,000 lux'}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
                              },
                              '&.Mui-focused': {
                                boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
                              },
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FaArrowDown className="text-blue-500" />
                              </InputAdornment>
                            ),
                            endAdornment: <InputAdornment position="end">Lux</InputAdornment>,
                          }}
                        />
                        
                        <TextField
                          label="Lux Máximo"
                          name="lux_max"
                          value={formData.lux_max}
                          onChange={handleChange}
                          required
                          type="number"
                          placeholder="Ej: 500"
                          error={!!validationErrors.lux}
                          helperText={validationErrors.lux || 'Mínimo: 0 lux, Máximo: 100,000 lux'}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
                              },
                              '&.Mui-focused': {
                                boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
                              },
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FaArrowUp className="text-blue-500" />
                              </InputAdornment>
                            ),
                            endAdornment: <InputAdornment position="end">Lux</InputAdornment>,
                          }}
                        />
                      </div>

                      <hr className="my-8 border-gray-200" />

                      <SectionTitle icon={<FaWeight />}>
                        Presión Atmosférica
                      </SectionTitle>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                          label="Presión Mínima"
                          name="presion_min"
                          value={formData.presion_min}
                          onChange={handleChange}
                          required
                          type="number"
                          placeholder="Ej: 900"
                          error={!!validationErrors.presion}
                          helperText={validationErrors.presion || 'Rango: 100 hPa a 1500 hPa'}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
                              },
                              '&.Mui-focused': {
                                boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
                              },
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FaArrowDown className="text-blue-500" />
                              </InputAdornment>
                            ),
                            endAdornment: <InputAdornment position="end">hPa</InputAdornment>,
                          }}
                        />
                        
                        <TextField
                          label="Presión Máxima"
                          name="presion_max"
                          value={formData.presion_max}
                          onChange={handleChange}
                          required
                          type="number"
                          placeholder="Ej: 1100"
                          error={!!validationErrors.presion}
                          helperText={validationErrors.presion || 'Rango: 100 hPa a 1500 hPa'}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
                              },
                              '&.Mui-focused': {
                                boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
                              },
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FaArrowUp className="text-blue-500" />
                              </InputAdornment>
                            ),
                            endAdornment: <InputAdornment position="end">hPa</InputAdornment>,
                          }}
                        />
                      </div>

                      <div className="mt-10 space-y-6">
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          size="large"
                          disabled={isSubmitting || Object.keys(validationErrors).length > 0}
                          sx={{
                            height: '56px',
                            borderRadius: '14px',
                            textTransform: 'none',
                            fontSize: '16px',
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)',
                            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #1d4ed8 0%, #0e7490 100%)',
                              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
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
                            'Guardar Condición Ambiental'
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
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </main>
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

export default AgregarCondicionAmbiental;