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

  useEffect(() => {
    if (selectedProduct) {
      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedProduct]);

  const MetricIndicator: React.FC<{ metric: keyof typeof metricConfig }> = ({ metric }) => {
    const currentData = data[data.length - 1];
    const currentProduct = productos.find(p => p.id === selectedProduct);
    const currentValue = currentData?.[metric] || 0;
    const min = currentProduct?.[`${metric}_min`] || 0;
    const max = currentProduct?.[`${metric}_max`] || 0;
    const isCritical = currentValue < min || currentValue > max;
    const { icon: Icon, color, label, unit } = metricConfig[metric];

    return (
      <div
        role="button"
        onClick={() => setSelectedMetric(metric)}
        className={`p-3 transition-all rounded-xl cursor-pointer
          ${isCritical ? 'ring-2 ring-red-500 animate-pulse' : 'hover:bg-gray-50'}
          ${selectedMetric === metric ? 'bg-gray-50 ring-1 ring-gray-200' : ''}`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-[${color}10]`}>
            <Icon className={`text-[${color}] w-5 h-5`} />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold">{currentValue?.toFixed(1)}</span>
              <span className="text-sm text-gray-500">{unit}</span>
            </div>
            <div className="text-xs text-gray-400">
              Rango: {min}-{max}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="rounded-xl shadow-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Avatar
            src={productos.find(p => p.id === selectedProduct)?.foto_producto}
            sx={{ width: 56, height: 56 }}
            className="shadow-md border-2 border-white"
          />
          <div>
            <Typography variant="h6" className="font-bold text-gray-800">
              Monitoreo Ambiental
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              {productos.find(p => p.id === selectedProduct)?.nombre_producto || "Seleccionar producto"}
            </Typography>
          </div>
        </div>
        
        <Link
  href={`/consultarmetricas/${selectedProduct}`}
  className="flex items-center gap-2 group transition-all no-underline"
  sx={{
    '&:hover': {
      textDecoration: 'none',
      transform: 'translateY(-1px)'
    }
  }}
>
  <div className="relative inline-flex items-center">
    <span className="text-sm font-medium text-gray-600 group-hover:text-blue-700 transition-colors pr-1">
      Ver métricas completas
    </span>
    <div className="absolute -right-3 -top-3 opacity-0 group-hover:opacity-100 group-hover:-right-4 transition-all duration-300">
      <span className="text-xs font-semibold text-blue-600">↗</span>
    </div>
  </div>
  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
    <FiExternalLink className="w-3 h-3 text-blue-600 group-hover:text-blue-800" />
  </div>
</Link>
      </div>

      {/* Product Selector */}
      <FormControl fullWidth className="mb-6">
        <Select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value as number)}
          displayEmpty 
          className="rounded-lg bg-white"
          renderValue={(selected) => (
            <div className="flex items-center gap-3">
              <FiBox className="text-gray-500 w-5 h-5" />
              {selectedProduct ? (
                <>
                  <Avatar 
                    src={productos.find(p => p.id === selected)?.foto_producto} 
                    sx={{ width: 28, height: 28 }}
                  />
                  <span className="font-medium truncate">
                    {productos.find(p => p.id === selected)?.nombre_producto}
                  </span>
                </>
              ) : (
                <span className="text-gray-400">Seleccionar producto</span>
              )}
            </div>
          )}
        >
          {productos.map((producto) => (
            <MenuItem key={producto.id} value={producto.id} className="py-3">
              <div className="flex items-center gap-3 w-full">
                <Avatar src={producto.foto_producto} sx={{ width: 40, height: 40 }} />
                <div>
                  <div className="font-medium text-gray-800">{producto.nombre_producto}</div>
                  <div className="text-xs text-gray-500">{producto.localizacion}</div>
                </div>
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Metric Indicators */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {(Object.keys(metricConfig) as (keyof typeof metricConfig)[]).map((metric) => (
          <MetricIndicator key={metric} metric={metric} />
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[300px] rounded-xl bg-gray-50 p-4">
        {loading ? (
          <div className="h-full flex items-center justify-center space-y-4">
            <div className="animate-pulse space-y-3 w-full">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          <Line
            data={{
              labels: data.map((d) => 
                format(new Date(d.fecha), "HH:mm", { locale: es })
              ),
              datasets: [{
                label: metricConfig[selectedMetric].label,
                data: data.map((d) => d[selectedMetric]),
                borderColor: metricConfig[selectedMetric].color,
                backgroundColor: `${metricConfig[selectedMetric].color}20`,
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                borderWidth: 2
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  displayColors: false,
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
                  grid: { display: false },
                  ticks: {
                    maxTicksLimit: 6,
                    color: "#6b7280",
                    font: { size: 12 }
                  }
                },
                y: {
                  grid: { color: "#e5e7eb" },
                  ticks: {
                    color: "#6b7280",
                    font: { size: 12 },
                    padding: 8
                  }
                }
              }
            }}
          />
        )}
      </div>
    </Card>
  );
};

export default GraficoMonitoreo;