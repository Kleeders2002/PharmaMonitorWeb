// AgregarMonitoreo.tsx
import React, { useEffect, useState } from "react";
import {
  Alert,
  Typography,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Divider,
} from "@mui/material";
import { FaSearch, FaPlusCircle, FaTimes, FaInfoCircle } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import HeaderDashboard from "../components/HeaderDashboard";
import api from "../api";

interface ProductoFarmaceutico {
  id: number;
  nombre: string;
  formula: string;
  concentracion: string;
  formafarmaceutica: string;
  foto: string;
  indicaciones: string;
}

const AgregarMonitoreo: React.FC = () => {
  const [productos, setProductos] = useState<ProductoFarmaceutico[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductoFarmaceutico | null>(null);
  const [localizacion, setLocalizacion] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get("/productos/");
        const products = response.data.map((p: any) => ({
          ...p,
          formafarmaceutica: p.formafarmaceutica?.descripcion || "N/A",
          foto: p.foto || "/placeholder-pharma.png",
        }));
        setProductos(products);
      } catch (err) {
        setError("Error cargando productos");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.formula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedProduct) return;
    
    try {
      await api.post("/productosmonitoreados/", {
        id_producto: selectedProduct.id,
        localizacion,
        cantidad,
        fecha_inicio_monitoreo: new Date().toISOString()
      });
      setDialogOpen(false);
      // Redirigir o mostrar notificación de éxito
    } catch (err) {
      setError("Error agregando producto al monitoreo");
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <Sidebar />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <HeaderDashboard title="Agregar a Monitoreo" />

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
                    <span className="text-sm font-semibold text-blue-700">Monitoreo Activo</span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    Agregar al
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-shift ml-2">
                      Monitoreo
                    </span>
                  </h1>
                  <p className="text-base text-gray-600 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    Selecciona un producto para comenzar su monitoreo ambiental
                  </p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '14px',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.15)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
                        },
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaSearch className="text-blue-500" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                {/* Content */}
                {loading ? (
                  <div className="text-center py-20">
                    <div className="inline-block">
                      <CircularProgress size={60} className="text-blue-600" />
                    </div>
                    <Typography className="mt-4 text-gray-600 font-medium">Cargando productos...</Typography>
                  </div>
                ) : error ? (
                  <Alert severity="error" className="rounded-xl" sx={{ boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
                    {error}
                  </Alert>
                ) : (
                  <Grid container spacing={4}>
                    {filteredProducts.map((producto) => (
                      <Grid item xs={12} sm={6} lg={4} xl={3} key={producto.id}>
                        <Card
                          className="h-full flex flex-col rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out hover:-translate-y-2"
                          sx={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          {/* Product Image */}
                          <CardMedia
                            component="div"
                            className="relative pt-[70%] bg-gradient-to-br from-gray-50 to-blue-50 rounded-t-2xl overflow-hidden"
                          >
                            <img
                              src={producto.foto}
                              alt={producto.nombre}
                              className="absolute top-0 left-0 w-full h-full object-cover"
                            />
                            <Chip
                              label={producto.formafarmaceutica}
                              size="small"
                              className="absolute top-4 right-4"
                              sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                fontWeight: 600,
                                color: '#2563eb',
                              }}
                            />
                          </CardMedia>

                          {/* Product Info */}
                          <CardContent className="flex-1 p-6">
                            <Typography variant="h6" className="font-bold mb-2">
                              {producto.nombre}
                            </Typography>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div>
                                <span className="font-semibold">Fórmula:</span> {producto.formula}
                              </div>
                              <div>
                                <span className="font-semibold">Concentración:</span>{" "}
                                {producto.concentracion}
                              </div>
                            </div>
                          </CardContent>

                          {/* Actions */}
                          <CardActions className="p-4 border-t">
                            <Button
                              fullWidth
                              variant="contained"
                              startIcon={<FaPlusCircle />}
                              onClick={() => {
                                setSelectedProduct(producto);
                                setDialogOpen(true);
                              }}
                              sx={{
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 600,
                                py: 1.5,
                                background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)',
                                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #1d4ed8 0%, #0e7490 100%)',
                                  boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                                  transform: 'translateY(-2px)',
                                },
                              }}
                            >
                              Monitorear Producto
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </div>
            </main>

            {/* Dialog para monitoreo */}
            <Dialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              fullWidth
              maxWidth="sm"
              PaperProps={{
                sx: {
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                }
              }}
            >
              <DialogTitle className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b p-6">
                <div className="flex items-center space-x-3">
                  <FaInfoCircle className="text-blue-600 text-xl" />
                  <Typography variant="h6" className="font-bold">
                    Configurar Monitoreo
                  </Typography>
                </div>
              </DialogTitle>

              <DialogContent className="p-6 space-y-6">
                {selectedProduct && (
                  <div className="flex space-x-4">
                    <img
                      src={selectedProduct.foto}
                      alt={selectedProduct.nombre}
                      className="w-24 h-24 rounded-xl object-cover border"
                    />
                    <div>
                      <Typography variant="h6" className="font-bold">
                        {selectedProduct.nombre}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        {selectedProduct.formula}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        {selectedProduct.concentracion}
                      </Typography>
                    </div>
                  </div>
                )}

                <Divider />

                <div className="space-y-4">
                  <TextField
                    fullWidth
                    label="Ubicación en almacén"
                    variant="outlined"
                    value={localizacion}
                    onChange={(e) => setLocalizacion(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
                        },
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    type="number"
                    label="Cantidad inicial"
                    variant="outlined"
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
                        },
                      }
                    }}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </div>

                {error && (
                  <Alert severity="error" className="rounded-lg">
                    {error}
                  </Alert>
                )}
              </DialogContent>

              <DialogActions className="p-6 border-t">
                <Button
                  variant="outlined"
                  startIcon={<FaTimes />}
                  onClick={() => setDialogOpen(false)}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<FaPlusCircle />}
                  onClick={handleSubmit}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #0e7490 100%)',
                      boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Iniciar Monitoreo
                </Button>
              </DialogActions>
            </Dialog>
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

export default AgregarMonitoreo;