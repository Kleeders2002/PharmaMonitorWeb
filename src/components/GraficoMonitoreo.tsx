import { useState, useEffect } from "react";
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
  Avatar,
  Typography,
  Link,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  FiThermometer,
  FiDroplet,
  FiSun,
  FiAlertTriangle,
  FiBox,
  FiExternalLink,
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
  fecha_finalizacion_monitoreo: string;
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

const GraficoMonitoreo: React.FC = () => {
  const [data, setData] = useState<MonitoringData[]>([]);
  const [productos, setProductos] = useState<ProductoMonitoreado[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<
    "temperatura" | "humedad" | "lux" | "presion"
  >("temperatura");

  const metricConfig = {
    temperatura: {
      icon: FiThermometer,
      color: "#f97316",
      label: "Temperatura",
      unit: "°C"
    },
    humedad: {
      icon: FiDroplet,
      color: "#3b82f6",
      label: "Humedad",
      unit: "%"
    },
    lux: {
      icon: FiSun,
      color: "#eab308",
      label: "Luz",
      unit: "lux"
    },
    presion: {
      icon: FiAlertTriangle,
      color: "#8b5cf6",
      label: "Presión",
      unit: "hPa"
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/productosmonitoreados/detalles");
      const productosActivos = response.data.filter(
        (producto: ProductoMonitoreado) => 
          !producto.fecha_finalizacion_monitoreo || 
          producto.fecha_finalizacion_monitoreo === ""
      );
      setProductos(productosActivos);
      if (productosActivos.length > 0) {
        setSelectedProduct(productosActivos[0].id);
      }
    } catch (err) {
      console.error("Error al cargar productos:", err);
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
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener datos:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (selectedProduct) {
      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedProduct]);

  const MetricIndicator: React.FC<{ metric: keyof typeof metricConfig; index: number }> = ({ metric, index }) => {
    const currentData = data[data.length - 1];
    const currentProduct = productos.find(p => p.id === selectedProduct);
    const currentValue = currentData?.[metric] || 0;
    const min = currentProduct?.[`${metric}_min`] || 0;
    const max = currentProduct?.[`${metric}_max`] || 0;
    const isCritical = currentValue < min || currentValue > max;
    const { icon: Icon, color, unit } = metricConfig[metric];

    return (
      <div
        role="button"
        onClick={() => setSelectedMetric(metric)}
        className={`p-4 transition-all duration-300 rounded-2xl cursor-pointer animate-fade-in-up
          ${isCritical
            ? 'bg-gradient-to-br from-red-50 to-orange-50 ring-2 ring-red-400/50 shadow-lg shadow-red-500/20'
            : 'bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1'
          }
          ${selectedMetric === metric
            ? 'ring-2 ring-blue-400/50 shadow-lg shadow-blue-500/20 bg-gradient-to-br from-blue-50/50 to-cyan-50/50'
            : 'shadow-md'
          }`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl shadow-md transition-all duration-300 ${
            isCritical
              ? 'bg-gradient-to-br from-red-500 to-orange-500'
              : selectedMetric === metric
                ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                : `bg-gradient-to-br from-[${color}] to-[${color}]`
          } group-hover:scale-110`}>
            <Icon className="text-white w-5 h-5 drop-shadow-md" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className={`text-xl font-bold transition-all duration-300 ${
                isCritical
                  ? 'text-red-600'
                  : selectedMetric === metric
                    ? 'text-blue-600'
                    : 'text-gray-800'
              }`}>
                {currentValue?.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500 font-medium">{unit}</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5 font-medium">
              Rango: {min}-{max}
            </div>
          </div>
          {isCritical && (
            <div className="animate-pulse">
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Animated background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-400/5 to-blue-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      {/* Header */}
      <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <Avatar
              src={productos.find(p => p.id === selectedProduct)?.foto_producto}
              sx={{ width: 64, height: 64 }}
              className="relative shadow-xl border-2 border-white transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div>
            <Typography variant="h6" className="font-bold text-gray-800 text-lg">
              Monitoreo Ambiental
            </Typography>
            <Typography variant="body2" className="text-gray-500 font-medium">
              {productos.find(p => p.id === selectedProduct)?.nombre_producto || "Seleccionar producto"}
            </Typography>
          </div>
        </div>

        <Link
  href="/ConsultarMetricas"
  className="relative flex items-center gap-2 group transition-all duration-300 no-underline overflow-hidden"
  sx={{
    '&:hover': {
      textDecoration: 'none',
    }
  }}
>
  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
  <div className="relative inline-flex items-center">
    <span className="text-sm font-semibold text-gray-600 group-hover:text-blue-700 transition-colors duration-300 pr-1">
      Ver métricas completas
    </span>
    <div className="absolute -right-3 -top-3 opacity-0 group-hover:opacity-100 group-hover:-right-4 transition-all duration-300">
      <span className="text-xs font-bold text-blue-600">↗</span>
    </div>
  </div>
  <div className="relative w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-cyan-200 group-hover:scale-110 transition-all duration-300 shadow-md group-hover:shadow-lg">
    <FiExternalLink className="w-4 h-4 text-blue-600 group-hover:text-blue-800 transition-colors duration-300" />
  </div>
</Link>
      </div>

      {/* Product Selector */}
      <FormControl fullWidth className="mb-6 relative">
        <Select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value as number)}
          displayEmpty
          className="rounded-xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-md hover:shadow-lg transition-all duration-300"
          sx={{
            '&:hover': {
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }
          }}
          renderValue={(selected) => (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md">
                <FiBox className="text-white w-4 h-4" />
              </div>
              {selectedProduct ? (
                <>
                  <Avatar
                    src={productos.find(p => p.id === selected)?.foto_producto}
                    sx={{ width: 32, height: 32 }}
                    className="shadow-md border-2 border-white"
                  />
                  <span className="font-semibold text-gray-800 truncate">
                    {productos.find(p => p.id === selected)?.nombre_producto}
                  </span>
                </>
              ) : (
                <span className="text-gray-400 font-medium">Seleccionar producto</span>
              )}
            </div>
          )}
        >
          {productos.map((producto) => (
            <MenuItem
              key={producto.id}
              value={producto.id}
              className="py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200"
            >
              <div className="flex items-center gap-3 w-full">
                <Avatar
                  src={producto.foto_producto}
                  sx={{ width: 40, height: 40 }}
                  className="shadow-md border-2 border-white"
                />
                <div>
                  <div className="font-semibold text-gray-800">{producto.nombre_producto}</div>
                  <div className="text-xs text-gray-500">{producto.localizacion}</div>
                </div>
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Metric Indicators */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {(Object.keys(metricConfig) as (keyof typeof metricConfig)[]).map((metric, index) => (
          <MetricIndicator key={metric} metric={metric} index={index} />
        ))}
      </div>

      {/* Chart */}
      <div className="relative flex-1 min-h-[300px] rounded-2xl bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm border border-white/20 shadow-lg p-4 overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Animated gradient background for chart */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 rounded-2xl"></div>

        {loading ? (
          <div className="relative h-full flex items-center justify-center space-y-4">
            <div className="animate-pulse space-y-4 w-full">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3 animate-shimmer"></div>
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl animate-shimmer shadow-inner"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Line
              data={{
                labels: data.map((d) =>
                  format(new Date(d.fecha), "HH:mm", { locale: es })
                ),
                datasets: [{
                  label: metricConfig[selectedMetric].label,
                  data: data.map((d) => d[selectedMetric]),
                  borderColor: metricConfig[selectedMetric].color,
                  backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, `${metricConfig[selectedMetric].color}40`);
                    gradient.addColorStop(1, `${metricConfig[selectedMetric].color}05`);
                    return gradient;
                  },
                  tension: 0.4,
                  fill: true,
                  pointRadius: 0,
                  pointHoverRadius: 6,
                  borderWidth: 3,
                  pointHoverBackgroundColor: metricConfig[selectedMetric].color,
                  pointHoverBorderColor: '#fff',
                  pointHoverBorderWidth: 2
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  intersect: false,
                  mode: 'index',
                },
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    displayColors: false,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#1f2937',
                    bodyColor: '#1f2937',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    padding: 12,
                    titleFont: {
                      size: 13,
                      weight: 'bold',
                    },
                    bodyFont: {
                      size: 12,
                    },
                    cornerRadius: 8,
                    callbacks: {
                      title: (context) =>
                        format(
                          new Date(data[context[0].dataIndex].fecha),
                          "d MMM yyyy HH:mm:ss",
                          { locale: es }
                        ),
                      label: (context) =>
                        `${metricConfig[selectedMetric].label}: ${context.raw} ${metricConfig[selectedMetric].unit}`
                    }
                  }
                },
                scales: {
                  x: {
                    grid: {
                      display: false
                    },
                    ticks: {
                      maxTicksLimit: 6,
                      color: "#6b7280",
                      font: { size: 11, weight: 500 }
                    }
                  },
                  y: {
                    grid: {
                      color: "rgba(229, 231, 235, 0.5)"
                    },
                    ticks: {
                      color: "#6b7280",
                      font: { size: 11, weight: 500 },
                      padding: 10
                    }
                  }
                }
              }}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

GraficoMonitoreo.displayName = 'GraficoMonitoreo';

export default GraficoMonitoreo;