import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import HeaderDashboard from "../components/HeaderDashboard";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  Card,
  Grid,
  Skeleton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  Button,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import {
  FiThermometer,
  FiDroplet,
  FiSun,
  FiAlertTriangle,
  FiBox,
  FiMapPin,
  FiPackage,
  FiCalendar,
  FiStopCircle,
  FiArchive,
  FiClock,
} from "react-icons/fi";
import api from "../api";
import { format } from "date-fns";
import es from "date-fns/locale/es";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MonitoringData {
  id: number;
  id_producto_monitoreado: number;
  fecha: string;
  humedad: number;
  presion: number;
  temperatura: number;
  lux: number;
}

interface ProductoMonitoreado {
  id: number;
  id_producto: number;
  cantidad: number;
  localizacion: string;
  fecha_inicio_monitoreo: string;
  fecha_finalizacion_monitoreo?: string;
  nombre_producto: string;
  foto_producto: string;
  temperatura_min: number;
  temperatura_max: number;
  humedad_min: number;
  humedad_max: number;
  lux_min: number;
  lux_max: number;
  presion_min: number;
  presion_max: number;
}

const DashboardMonitoreo: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<MonitoringData[]>([]);
  const [productos, setProductos] = useState<ProductoMonitoreado[]>([]);
  const [activeProducts, setActiveProducts] = useState<ProductoMonitoreado[]>([]);
  const [historicalProducts, setHistoricalProducts] = useState<ProductoMonitoreado[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<
    "temperatura" | "humedad" | "lux" | "presion"
  >("temperatura");
  const [isStopping, setIsStopping] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const metricColors = {
    temperatura: { bg: "bg-orange-100", text: "text-orange-600", chart: "#f97316" },
    humedad: { bg: "bg-blue-100", text: "text-blue-600", chart: "#3b82f6" },
    lux: { bg: "bg-yellow-100", text: "text-yellow-600", chart: "#eab308" },
    presion: { bg: "bg-purple-100", text: "text-purple-600", chart: "#8b5cf6" },
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/productosmonitoreados/detalles");
      const productos = response.data;

      const active = productos.filter((p: ProductoMonitoreado) => 
        !p.fecha_finalizacion_monitoreo
      );
      const historical = productos.filter((p: ProductoMonitoreado) => 
        p.fecha_finalizacion_monitoreo
      );

      setActiveProducts(active);
      setHistoricalProducts(historical);

      if (active.length > 0) {
        setSelectedProduct(active[0].id);
      } else {
        setSelectedProduct("");
      }
    } catch (err) {
      setError("Error al cargar productos monitoreados");
    }
  };

  const handleStopMonitoring = async () => {
    if (!selectedProduct) return;
    
    try {
      setIsStopping(true);
      await api.patch(`/productosmonitoreados/${selectedProduct}/detener`);
      await fetchProducts();
      setSelectedProduct("");
    } catch (err) {
      setError("Error al detener el monitoreo");
    } finally {
      setIsStopping(false);
    }
  };

  const fetchData = async () => {
    if (!selectedProduct) return;

    try {
      const response = await api.get(`/datosmonitoreo/${selectedProduct}`);
      const sortedData = response.data.sort(
        (a: MonitoringData, b: MonitoringData) =>
          new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );
      setData(sortedData.slice(-30));
      setError(null);
    } catch (err: any) {
      setError("Error al obtener datos de monitoreo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedProduct]);

  const MetricCard = ({ metric }: { metric: keyof typeof metricColors }) => {
    const currentData = data[data.length - 1];
    const currentProduct = activeProducts.find(p => p.id === selectedProduct);
    const currentValue = currentData?.[metric] || 0;
    const min = currentProduct?.[`${metric}_min`] || 0;
    const max = currentProduct?.[`${metric}_max`] || 0;
    const isOutOfRange = currentValue < min || currentValue > max;
    const previousData = data[data.length - 2];
    const trend = currentData && previousData
      ? currentData[metric] - previousData[metric]
      : 0;

    return (
      <Card
        className={`p-4 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer ${
          selectedMetric === metric ? "ring-2 ring-blue-500" : ""
        } ${isOutOfRange ? "ring-2 ring-red-500 animate-pulse" : ""}`}
        onClick={() => setSelectedMetric(metric)}
      >
        <div className="flex justify-between items-start">
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-lg ${metricColors[metric].bg} ${metricColors[metric].text}`}
                >
                  {metric === "temperatura" && <FiThermometer size={20} />}
                  {metric === "humedad" && <FiDroplet size={20} />}
                  {metric === "lux" && <FiSun size={20} />}
                  {metric === "presion" && <FiAlertTriangle size={20} />}
                </div>
                <span className="font-semibold text-gray-600">
                  {metric === "lux" ? "Luz" : metric.charAt(0).toUpperCase() + metric.slice(1)}
                </span>
              </div>
              {isOutOfRange && (
                <Chip
                  label="Alerta"
                  color="error"
                  size="small"
                  className="animate-pulse"
                />
              )}
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold">
                {currentValue?.toFixed(1) || "0.0"}
              </span>
              <span className="text-gray-500">
                {metric === "temperatura"
                  ? "°C"
                  : metric === "humedad"
                  ? "%"
                  : metric === "lux"
                  ? "lux"
                  : "hPa"}
              </span>
              <span
                className={`text-sm ${
                  trend >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend >= 0 ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}
              </span>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full ${metricColors[metric].bg}`}
                style={{ 
                  width: `${((currentValue - min) / (max - min)) * 100}%`,
                  maxWidth: '100%'
                }}
              />
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span>Mín: {min}</span>
              <span>Máx: {max}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const ProductInfoCard = () => {
    const product = activeProducts.find(p => p.id === selectedProduct);
    if (!product) return null;

    return (
      <Card className="p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar
            src={product.foto_producto}
            variant="rounded"
            sx={{ width: 120, height: 120 }}
            className="shadow-lg"
          />
          
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold mb-2">{product.nombre_producto}</h2>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <FiPackage className="text-blue-500" />
                <span>Existencias: {product.cantidad} unidades</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <FiMapPin className="text-green-500" />
                <span>Ubicación: {product.localizacion}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiCalendar className="text-purple-500" />
                <span>Monitoreo desde: {format(
                  new Date(product.fecha_inicio_monitoreo), 
                  "d MMM yyyy HH:mm", 
                  { locale: es }
                )}</span>
              </div>
            </div>
            
            <div className="border-l pl-4 border-gray-100">
              <h3 className="font-semibold mb-2">Especificaciones:</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Temperatura:</span>
                  <span>{product.temperatura_min}°C - {product.temperatura_max}°C</span>
                </div>
                <div className="flex justify-between">
                  <span>Humedad:</span>
                  <span>{product.humedad_min}% - {product.humedad_max}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Luz:</span>
                  <span>{product.lux_min} - {product.lux_max} lux</span>
                </div>
                <div className="flex justify-between">
                  <span>Presión:</span>
                  <span>{product.presion_min} - {product.presion_max} hPa</span>
                </div>
              </div>
              <Button
                variant="outlined"
                startIcon={<FiClock />}
                onClick={() => navigate(`/HistoricoMonitoreo/${product.id}`)}
                sx={{ mt: 2 }}
                fullWidth
              >
                Ver Registro Histórico
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <>
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <HeaderDashboard title="Monitor de Condiciones Ambientales" />

          <main className="flex-1 overflow-y-auto">
            <div className="w-full p-8 2xl:px-12">
              <div className="max-w-9xl mx-auto space-y-6">
                <Tabs
                  value={tabValue}
                  onChange={(_, newValue) => setTabValue(newValue)}
                  sx={{
                    '& .MuiTabs-indicator': { backgroundColor: '#3b82f6' },
                    '& .Mui-selected': { color: '#1e40af !important' }
                  }}
                >
                  <Tab
                    label={`Monitoreo Activo (${activeProducts.length})`}
                    icon={<FiBox className="text-blue-600" />}
                    iconPosition="start"
                  />
                  <Tab
                    label={`Histórico (${historicalProducts.length})`}
                    icon={<FiArchive className="text-gray-600" />}
                    iconPosition="start"
                  />
                </Tabs>

                {tabValue === 0 ? (
                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 transition-all duration-300 ease-in-out">
                    <div className="px-8 py-6 border-b border-gray-100">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                            Monitoreo en Tiempo Real
                          </h1>
                          <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            {selectedProduct &&
                              `Última actualización: ${format(new Date(), "d MMM yyyy HH:mm:ss", { locale: es })}`}
                          </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 items-end w-full md:w-auto">
                          <div className="flex gap-4">
                            <Button
                              variant="contained"
                              startIcon={<FiStopCircle />}
                              onClick={handleStopMonitoring}
                              disabled={!selectedProduct || isStopping}
                              sx={{
                                height: '56px',
                                minWidth: '180px',
                                order: { xs: 0, md: 0 },
                                background: 'linear-gradient(to right, #ef4444, #dc2626)',
                                '&:hover': {
                                  background: 'linear-gradient(to right, #dc2626, #b91c1c)',
                                },
                              }}
                            >
                              {isStopping ? 'Deteniendo...' : 'Detener Monitoreo'}
                            </Button>

                            <Button
                              variant="outlined"
                              startIcon={<FiClock />}
                              onClick={() => navigate(`/HistoricoMonitoreo/${selectedProduct}`)}
                              disabled={!selectedProduct}
                              sx={{
                                height: '56px',
                                minWidth: '200px',
                                order: { xs: 1, md: 1 },
                              }}
                            >
                              Histórico Completo
                            </Button>
                          </div>

                          <FormControl className="min-w-[300px]">
                            <InputLabel>Producto Monitoreado</InputLabel>
                            <Select
                              value={selectedProduct}
                              onChange={(e) =>
                                setSelectedProduct(e.target.value as number)
                              }
                              label="Producto Monitoreado"
                              startAdornment={
                                <FiBox className="text-gray-500 mr-2" size={18} />
                              }
                            >
                              {activeProducts.map((producto) => (
                                <MenuItem key={producto.id} value={producto.id}>
                                  <div className="flex items-center gap-3 w-full">
                                    <Avatar
                                      src={producto.foto_producto}
                                      sx={{ width: 40, height: 40 }}
                                    />
                                    <div>
                                      <div className="font-medium">{producto.nombre_producto}</div>
                                      <div className="text-sm text-gray-500">
                                        {producto.localizacion} (ID: {producto.id_producto})
                                      </div>
                                    </div>
                                  </div>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                    </div>

                    {selectedProduct ? (
                      <div className="p-6 lg:p-8 space-y-6">
                        <ProductInfoCard />

                        <Grid container spacing={3}>
                          {loading ? (
                            Array(4)
                              .fill(0)
                              .map((_, i) => (
                                <Grid item xs={12} sm={6} lg={3} key={i}>
                                  <Skeleton variant="rounded" height={150} />
                                </Grid>
                              ))
                          ) : (
                            <>
                              <Grid item xs={12} sm={6} lg={3}>
                                <MetricCard metric="temperatura" />
                              </Grid>
                              <Grid item xs={12} sm={6} lg={3}>
                                <MetricCard metric="humedad" />
                              </Grid>
                              <Grid item xs={12} sm={6} lg={3}>
                                <MetricCard metric="lux" />
                              </Grid>
                              <Grid item xs={12} sm={6} lg={3}>
                                <MetricCard metric="presion" />
                              </Grid>
                            </>
                          )}
                        </Grid>

                        <div className="mt-8 h-96 bg-gray-50 rounded-xl p-4 shadow-sm">
                          <Line
                            data={{
                              labels: data.map((d) =>
                                format(new Date(d.fecha), "HH:mm:ss", { locale: es })
                              ),
                              datasets: [
                                {
                                  label: selectedMetric.toUpperCase(),
                                  data: data.map((d) => d[selectedMetric]),
                                  borderColor: metricColors[selectedMetric].chart,
                                  backgroundColor: `${metricColors[selectedMetric].chart}20`,
                                  tension: 0.4,
                                  fill: true,
                                  pointRadius: 2,
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { display: true },
                                tooltip: {
                                  enabled: true,
                                  callbacks: {
                                    title: (context) =>
                                      format(
                                        new Date(data[context[0].dataIndex].fecha),
                                        "d MMM yyyy HH:mm:ss",
                                        { locale: es }
                                      ),
                                  },
                                },
                              },
                              scales: {
                                x: {
                                  display: true,
                                  title: { display: true, text: "Hora" },
                                  grid: { display: false },
                                  ticks: {
                                    autoSkip: true,
                                    maxTicksLimit: 10,
                                  },
                                },
                                y: {
                                  display: true,
                                  title: {
                                    display: true,
                                    text:
                                      selectedMetric === "temperatura"
                                        ? "°C"
                                        : selectedMetric === "humedad"
                                        ? "%"
                                        : selectedMetric === "lux"
                                        ? "lux"
                                        : "hPa",
                                  },
                                  grid: { color: "#e5e7eb" },
                                },
                              },
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="h-96 flex items-center justify-center text-gray-400">
                        {activeProducts.length === 0 ? (
                          <p>No hay productos en monitoreo activo</p>
                        ) : (
                          <p>Seleccione un producto para comenzar el monitoreo</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
  <div className="mb-6 flex items-center justify-between">
    <div>
      <Typography variant="h5" className="font-bold text-gray-800">
        Historial de Monitoreos
      </Typography>
      <Typography variant="body2" className="text-gray-500">
        {historicalProducts.length} productos monitoreados anteriormente
      </Typography>
    </div>
    <FiArchive className="text-2xl text-gray-400" />
  </div>

  <Grid container spacing={3}>
    {historicalProducts.map((producto, index) => (
      <Grid item xs={12} md={6} lg={4} key={producto.id}>
        <Card className="group relative h-full p-4 transition-all hover:shadow-xl hover:border-blue-100 hover:border-2 animate-fadeIn" sx={{ animationDelay: `${index * 0.05}s` }}>
          <div className="flex gap-4">
            <Avatar
              src={producto.foto_producto}
              variant="rounded"
              sx={{ width: 80, height: 80 }}
              className="rounded-xl shadow-md"
            />
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <Typography 
                  variant="subtitle1" 
                  className="font-semibold text-gray-800 line-clamp-1"
                >
                  {producto.nombre_producto}
                </Typography>
                <Chip
                  label="Finalizado"
                  size="small"
                  color="error"
                  variant="outlined"
                  icon={<FiStopCircle className="text-red-500" />}
                />
              </div>

              <div className="mt-2 space-y-1">
                <div className="flex items-center text-sm text-gray-600">
                  <FiMapPin className="mr-2 text-green-500" />
                  <span className="line-clamp-1">{producto.localizacion}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <FiCalendar className="mr-2 text-purple-500" />
                  <span>
                    {format(
                      new Date(producto.fecha_inicio_monitoreo),
                      "dd MMM yyyy",
                      { locale: es }
                    )} -{" "}
                    {producto.fecha_finalizacion_monitoreo
                      ? format(
                          new Date(producto.fecha_finalizacion_monitoreo),
                          "dd MMM yyyy",
                          { locale: es }
                        )
                      : "Presente"}
                  </span>
                </div>
              </div>

              <Button
                variant="outlined"
                fullWidth
                size="small"
                startIcon={<FiClock className="text-blue-500" />}
                onClick={() => navigate(`/HistoricoMonitoreo/${producto.id}`)}
                sx={{ mt: 2 }}
                className="hover:bg-blue-50"
              >
                Ver Detalles Completos
              </Button>
            </div>
          </div>

          <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <FiBox className="text-gray-200 text-xl" />
          </div>
        </Card>
      </Grid>
    ))}
    
    {historicalProducts.length === 0 && (
      <Grid item xs={12}>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FiArchive className="text-4xl text-gray-400 mb-4" />
          <Typography variant="body1" className="text-gray-500 mb-2">
            No hay registros históricos disponibles
          </Typography>
          <Typography variant="body2" className="text-gray-400">
            Los productos monitoreados aparecerán aquí una vez finalizados
          </Typography>
        </div>
      </Grid>
    )}
  </Grid>
</div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <style>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out forwards;
        opacity: 0;
      }
    `}</style>
    </>
  );
};

export default DashboardMonitoreo;