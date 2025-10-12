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
  IconButton,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="flex">
    {/* Sidebar Fijo */}
    <div className="fixed left-0 top-0 h-screen w-60 z-50">
      <Sidebar />
    </div>
    
    {/* Contenedor Principal con margen para el sidebar */}
    <div className="flex-1 flex flex-col ml-60">
      {/* Header Fijo */}
      <div className="fixed top-0 left-60 right-0 z-40 bg-white shadow-sm">
        <HeaderDashboard title="Agregar a Monitoreo" />
      </div>

      {/* Contenido Principal con scroll */}
      <main className="mt-16 flex-1 p-8 2xl:p-12 overflow-auto">
        <div className="max-w-8xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
                {/* Search Bar */}
                <div className="mb-8">
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaSearch className="text-gray-400" />
                        </InputAdornment>
                      ),
                      className: "rounded-xl bg-white shadow-sm",
                      style: { borderRadius: "1rem" }
                    }}
                  />
                </div>

                {/* Content */}
                {loading ? (
                  <div className="text-center py-20">
                    <CircularProgress size={60} className="text-blue-600" />
                    <Typography className="mt-4 text-gray-600">Cargando productos...</Typography>
                  </div>
                ) : error ? (
                  <Alert severity="error" className="rounded-xl">
                    {error}
                  </Alert>
                ) : (
                  <Grid container spacing={4}>
                    {filteredProducts.map((producto) => (
                      <Grid item xs={12} sm={6} lg={4} xl={3} key={producto.id}>
                        <Card className="h-full flex flex-col rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-out">
                          {/* Product Image */}
                          <CardMedia
                            component="div"
                            className="relative pt-[70%] bg-gray-100 rounded-t-2xl overflow-hidden"
                          >
                            <img
                              src={producto.foto}
                              alt={producto.nombre}
                              className="absolute top-0 left-0 w-full h-full object-cover"
                            />
                            <Chip
                              label={producto.formafarmaceutica}
                              size="small"
                              className="absolute top-4 right-4 bg-white/90 shadow-sm"
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
                          <CardActions className="p-4 bg-gray-50 border-t">
                            <Button
                              fullWidth
                              variant="contained"
                              startIcon={<FaPlusCircle />}
                              onClick={() => {
                                setSelectedProduct(producto);
                                setDialogOpen(true);
                              }}
                              className="rounded-xl py-2"
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
            </div>
          </main>

          {/* Dialog para monitoreo */}
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            fullWidth
            maxWidth="sm"
            PaperProps={{ className: "rounded-2xl" }}
          >
            <DialogTitle className="bg-blue-50 border-b p-6">
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
                  className="rounded-lg"
                />
                
                <TextField
                  fullWidth
                  type="number"
                  label="Cantidad inicial"
                  variant="outlined"
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  className="rounded-lg"
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
                className="rounded-lg"
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FaPlusCircle />}
                onClick={handleSubmit}
                className="rounded-lg shadow-sm hover:shadow-md"
              >
                Iniciar Monitoreo
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AgregarMonitoreo;