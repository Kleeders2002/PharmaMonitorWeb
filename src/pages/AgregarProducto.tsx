import React, { useState, useEffect, useRef } from 'react';
import { 
  FaPills, FaVial, FaFlask, FaClipboardList, FaTimes, FaPlus,
  FaNotesMedical, FaBan, FaExclamationTriangle, FaCube
} from 'react-icons/fa';
import { Alert, Button, TextField, InputAdornment, IconButton, CircularProgress, SelectChangeEvent } from '@mui/material';
import api from '../api';
import HeaderDashboard from '../components/HeaderDashboard';
import Sidebar from '../components/Sidebar';
import CondicionAlmacenamientoDialog, { CondicionAlmacenamiento } from '../components/condicionalmacenamiento';
import MenuItem from '@mui/material/MenuItem';

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

  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedConditionId, setSelectedConditionId] = useState<string>('');
  const [formaFarmaceutica, setFormaFarmaceutica] = useState<any[]>([]);
  const [existingConditions, setExistingConditions] = useState<CondicionAlmacenamiento[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [conditionsResponse, formasResponse] = await Promise.all([
          api.get('/condiciones/'),
          api.get('/formafarmaceutica/')
        ]);
        setExistingConditions(conditionsResponse.data);
        setFormaFarmaceutica(formasResponse.data);
      } catch (error) {
        // Error handled silently, user can see missing data
      }
    };
    fetchData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedConditionId('');
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFormData({ ...formData, foto: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCondicionesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCondiciones(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectCondition = (e: SelectChangeEvent<string>) => {
    const conditionId = e.target.value;
    setSelectedConditionId(conditionId);
    const selected = existingConditions.find(cond => cond.id === parseInt(conditionId));
    selected && setCondiciones(selected);
  };

  const handleSaveCondition = async () => {
    if (selectedConditionId) {
      handleClose();
      return;
    }

    try {
      const { id, ...nuevaCondicion } = condiciones;
      const response = await api.post('/condiciones/', nuevaCondicion);
      if ([200, 201].includes(response.status)) {
        setExistingConditions([...existingConditions, response.data]);
        setCondiciones(response.data);
        handleClose();
      }
    } catch (error) {
      setError('Error al guardar la condición ambiental');
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
    <div className="h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex h-full">
        <Sidebar />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <HeaderDashboard title="Agregar Producto" />
          
          <main className="flex-1 overflow-y-auto">
            <div className="w-full p-8 2xl:px-12">
              <div className="max-w-9xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl transition-all duration-300 ease-in-out">
                  <div className="px-8 py-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          Registro de Nuevo Producto
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                          Complete todos los campos requeridos para el registro
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 lg:p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sección Imagen */}
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
                                    alt="Vista previa del producto" 
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
                                  <FaCube className="text-3xl text-blue-400 mb-2 mx-auto transition-colors" />
                                  <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                                    Subir imagen del producto
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
                                  '&:hover fieldset': {
                                    borderColor: '#2563eb',
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
                                  '&:hover fieldset': {
                                    borderColor: '#2563eb',
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
                                  '&:hover fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                }
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <FaFlask className="text-blue-500" />
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
                              <Button
                                variant="outlined"
                                color="primary"
                                fullWidth
                                onClick={handleOpen}
                                sx={{
                                  height: '50px',
                                  borderRadius: '12px',
                                  textTransform: 'none',
                                  fontSize: '16px',
                                  borderColor: '#e5e7eb',
                                  '&:hover': {
                                    borderColor: '#bfdbfe',
                                    backgroundColor: '#f0f9ff'
                                  }
                                }}
                                startIcon={<FaPlus className="text-blue-500" />}
                              >
                                {condiciones.nombre
                                  ? `Condición: ${condiciones.nombre}`
                                  : 'Definir Condiciones de Almacenamiento'}
                              </Button>
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
                                  '&:hover fieldset': {
                                    borderColor: '#2563eb',
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
                                  '&:hover fieldset': {
                                    borderColor: '#2563eb',
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
                                  '&:hover fieldset': {
                                    borderColor: '#2563eb',
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

          <CondicionAlmacenamientoDialog
            open={open}
            onClose={handleClose}
            existingConditions={existingConditions}
            selectedConditionId={selectedConditionId}
            handleSelectCondition={handleSelectCondition}
            handleAddCondition={handleSaveCondition}
            condiciones={condiciones}
            handleCondicionesChange={handleCondicionesChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AgregarProducto;