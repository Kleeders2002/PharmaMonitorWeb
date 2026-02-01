import React, { useState, useEffect, useRef } from 'react';
import {
  FaPills, FaVial, FaClipboardList,
  FaNotesMedical, FaBan, FaExclamationTriangle, FaCube
} from 'react-icons/fa';
import { FiActivity } from 'react-icons/fi';
import { FiX } from 'react-icons/fi';
import { Alert, Button, TextField, InputAdornment, IconButton, CircularProgress, MenuItem } from '@mui/material';
import api from '../api';
import HeaderDashboard from '../components/HeaderDashboard';
import Sidebar from '../components/Sidebar';
import CondicionAlmacenamientoList, { CondicionAlmacenamiento } from '../components/condicionalmacenamiento';

const AgregarProducto: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    formula: '',
    concentracion: '',
    indicaciones: '',
    contraindicaciones: '',
    efectos_secundarios: '',
    id_forma_farmaceutica: 1,
    foto: '',
  });

  const [condiciones, setCondiciones] = useState<CondicionAlmacenamiento>({
    id: 0,
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

  const [selectedConditionId, setSelectedConditionId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formaFarmaceutica, setFormaFarmaceutica] = useState<any[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formasResponse = await api.get('/formafarmaceutica/');
        setFormaFarmaceutica(formasResponse.data);
      } catch (error) {
        // Error handled silently, user can see missing data
      }
    };
    fetchData();
  }, []);

  const handleRemoveImage = () => {
    setPreview(null);
    setFormData({ ...formData, foto: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectCondition = (condicion: CondicionAlmacenamiento) => {
    setCondiciones(condicion);
    setSelectedConditionId(condicion.id?.toString() || '');
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
      // Error handled silently, image upload fails
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    if (!condiciones.id) {
      setError('Debes seleccionar una condición de almacenamiento');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        id_condicion: condiciones.id
      };

      const response = await api.post('/productos/', payload);
      
      if (response.status === 200) {
        setSuccess('Producto registrado exitosamente');
        setFormData({
          nombre: '',
          formula: '',
          concentracion: '',
          indicaciones: '',
          contraindicaciones: '',
          efectos_secundarios: '',
          id_forma_farmaceutica: 1,
          foto: '',
        });
        setCondiciones({
          id: 0,
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
        setPreview(null);
      }
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Error al registrar el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <HeaderDashboard title="Agregar Producto" />

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
                    <span className="text-sm font-semibold text-blue-700">Nuevo Registro</span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    Registro de Producto
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-shift ml-2">
                      Farmacéutico
                    </span>
                  </h1>
                  <p className="text-base text-gray-600 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    Complete todos los campos requeridos para el registro
                  </p>
                </div>
              </div>
            </div>

            {/* Main Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="p-8">
                  
                  <div className="p-6 lg:p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sección Imagen */}
                        <div className="w-full lg:w-1/3 flex flex-col items-center">
                          <div className="relative group w-full">
                            <label
                              htmlFor="image-upload"
                              className="w-full aspect-square rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center cursor-pointer
                                transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-dashed border-blue-200 hover:border-blue-300
                                overflow-hidden shadow-sm relative group"
                            >
                              {preview ? (
                                <>
                                  <img
                                    src={preview}
                                    alt="Vista previa del producto"
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
                                  <div className="inline-flex p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full shadow-sm">
                                    <FaCube className="text-3xl text-blue-600 transition-colors" />
                                  </div>
                                  <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors font-medium">
                                    Subir imagen del producto
                                  </span>
                                </div>
                              )}
                              <div className="absolute inset-0 ring-1 ring-inset ring-blue-100/50 rounded-xl" />
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
                              label="Nombre del Producto"
                              name="nombre"
                              value={formData.nombre}
                              onChange={handleChange}
                              required
                              fullWidth
                              variant="outlined"
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
                                    <FaVial className="text-blue-500" />
                                  </InputAdornment>
                                ),
                              }}
                            />

                            <TextField
                              select
                              label="Forma Farmacéutica"
                              name="id_forma_farmaceutica"
                              value={formData.id_forma_farmaceutica}
                              onChange={handleChange}
                              required
                              fullWidth
                              variant="outlined"
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
                                    <FaPills className="text-blue-500" />
                                  </InputAdornment>
                                ),
                              }}
                            >
                              {formaFarmaceutica.map((forma) => (
                                <MenuItem 
                                  key={forma.id} 
                                  value={forma.id}
                                  sx={{ '&:hover': { backgroundColor: '#f0f9ff' } }}
                                >
                                  {forma.descripcion}
                                </MenuItem>
                              ))}
                            </TextField>

                            <TextField
                              label="Fórmula Química"
                              name="formula"
                              value={formData.formula}
                              onChange={handleChange}
                              required
                              fullWidth
                              variant="outlined"
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
                                    <FiActivity className="text-blue-500" />
                                  </InputAdornment>
                                ),
                              }}
                            />

                            <TextField
                              label="Concentración"
                              name="concentracion"
                              value={formData.concentracion}
                              onChange={handleChange}  // Validación removida
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
                                          <FaClipboardList className="text-blue-500" />
                                      </InputAdornment>
                                  ),
                              }}
                            />

                            <div className="md:col-span-2">
                              <CondicionAlmacenamientoList
                                onSelectCondition={handleSelectCondition}
                                selectedConditionId={selectedConditionId}
                              />
                            </div>

                            <TextField
                              label="Indicaciones Médicas"
                              name="indicaciones"
                              value={formData.indicaciones}
                              onChange={handleChange}
                              required
                              fullWidth
                              multiline
                              rows={3}
                              variant="outlined"
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
                                    <FaNotesMedical className="text-blue-500" />
                                  </InputAdornment>
                                ),
                              }}
                            />

                            <TextField
                              label="Contraindicaciones"
                              name="contraindicaciones"
                              value={formData.contraindicaciones}
                              onChange={handleChange}
                              required
                              fullWidth
                              multiline
                              rows={3}
                              variant="outlined"
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
                                    <FaBan className="text-blue-500" />
                                  </InputAdornment>
                                ),
                              }}
                            />

                            <TextField
                              label="Efectos Secundarios"
                              name="efectos_secundarios"
                              value={formData.efectos_secundarios}
                              onChange={handleChange}
                              required
                              fullWidth
                              multiline
                              rows={3}
                              variant="outlined"
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
                                    <FaExclamationTriangle className="text-blue-500" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </div>

                          <div className="mt-10 space-y-6">
                            <Button
                              type="submit"
                              variant="contained"
                              fullWidth
                              size="large"
                              disabled={isSubmitting}
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
                                'Registrar Producto Farmacéutico'
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

export default AgregarProducto;