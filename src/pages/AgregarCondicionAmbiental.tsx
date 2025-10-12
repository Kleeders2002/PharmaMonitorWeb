import React, { useState } from 'react';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

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
      <span className="text-blue-500 text-xl">{icon}</span>
      <h3 className="text-xl font-semibold text-gray-800">{children}</h3>
    </div>
  );

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex h-full">
        <Sidebar />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <HeaderDashboard title="Agregar Condición Ambiental" />
          
          <main className="flex-1 overflow-y-auto">
            <div className="w-full p-8 2xl:px-12">
              <div className="max-w-9xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl transition-all duration-300 ease-in-out">
                  <div className="px-8 py-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          Nueva Condición Ambiental
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                          Define los parámetros de almacenamiento requeridos
                        </p>
                      </div>
                    </div>
                  </div>
                  
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
    </div>
  );
};

export default AgregarCondicionAmbiental;