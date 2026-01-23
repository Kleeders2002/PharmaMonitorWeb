import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Grid,
  Skeleton,
  Chip,
  Avatar,
  Button,
  Tabs,
  Tab,
  Typography,
  Alert,
} from "@mui/material";
import {
  FiThermometer,
  FiDroplet,
  FiSun,
  FiAlertTriangle,
  FiMapPin,
  FiCalendar,
  FiStopCircle,
  FiArrowLeft,
  FiClock,
} from "react-icons/fi";
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
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import api from "../api";
import { format, parseISO, isWithinInterval, isValid, isBefore, differenceInDays } from "date-fns";
import es from "date-fns/locale/es";
import Sidebar from "../components/Sidebar";
import HeaderDashboard from "../components/HeaderDashboard";

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
  fecha_finalizacion_monitoreo: string | null;
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

const HistoricoMonitoreo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<ProductoMonitoreado | null>(null);
  const [fullData, setFullData] = useState<MonitoringData[]>([]);
  const [filteredData, setFilteredData] = useState<MonitoringData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<
    "temperatura" | "humedad" | "lux" | "presion"
  >("temperatura");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [monitoreoActivo, setMonitoreoActivo] = useState(false);

  const metricColors = {
    temperatura: { bg: "bg-orange-100", text: "text-orange-600", chart: "#f97316" },
    humedad: { bg: "bg-blue-100", text: "text-blue-600", chart: "#3b82f6" },
    lux: { bg: "bg-yellow-100", text: "text-yellow-600", chart: "#eab308" },
    presion: { bg: "bg-purple-100", text: "text-purple-600", chart: "#8b5cf6" },
  };

  const safeFormatDate = (dateString: string | null, formatString: string) => {
    if (!dateString) return 'En curso';
    try {
      return format(new Date(dateString), formatString, { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  const handleDateChange = (newStart: Date | null, newEnd: Date | null) => {
    if (!newStart || !newEnd || !isValid(newStart) || !isValid(newEnd)) {
      setDateError("Fechas inválidas");
      return;
    }

    if (isBefore(newEnd, newStart)) {
      setDateError("La fecha final no puede ser anterior a la inicial");
      [newStart, newEnd] = [newEnd, newStart];
    } else {
      setDateError(null);
    }

    setStartDate(newStart);
    setEndDate(newEnd);
  };

  const handleStartDateChange = (newValue: Date | null) => {
    handleDateChange(newValue, endDate);
  };

  const handleEndDateChange = (newValue: Date | null) => {
    handleDateChange(startDate, newValue);
  };

  const fetchData = useCallback(async () => {
    try {
      const [productResponse, dataResponse] = await Promise.all([
        api.get(`/productosmonitoreados/detalles/${id}`),
        api.get(`/datosmonitoreo/${id}`),
      ]);

      if (!productResponse.data || !dataResponse.data) {
        throw new Error("Datos no encontrados");
      }

      const sortedData = dataResponse.data.sort((a: MonitoringData, b: MonitoringData) =>
        new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );

      const productoData = productResponse.data;
      const isActive = !productoData.fecha_finalizacion_monitoreo || 
        new Date(productoData.fecha_finalizacion_monitoreo) > new Date();

      setMonitoreoActivo(isActive);
      setProducto(productoData);

      setFullData(sortedData);
      setFilteredData(sortedData);

      const initialStart = new Date(productoData.fecha_inicio_monitoreo);
      const initialEnd = productoData.fecha_finalizacion_monitoreo 
        ? new Date(productoData.fecha_finalizacion_monitoreo)
        : new Date();

      if (isActive) {
        initialStart.setDate(initialEnd.getDate() - 7);
      }

      setStartDate(initialStart);
      setEndDate(initialEnd);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchData();
  }, [id, fetchData]);

  useEffect(() => {
    if (monitoreoActivo) {
      const interval = setInterval(() => {
        if (endDate && differenceInDays(new Date(), endDate) > 0) {
          setEndDate(new Date());
        }
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [monitoreoActivo, endDate]);

  useEffect(() => {
    if (startDate && endDate && isValid(startDate) && isValid(endDate)) {
      const filtered = fullData.filter((d) => {
        const fecha = new Date(d.fecha);
        return isWithinInterval(fecha, {
          start: startDate,
          end: endDate,
        });
      });
      setFilteredData(filtered);
    }
  }, [startDate, endDate, fullData]);

  const downsampleData = (data: MonitoringData[], factor: number) => {
    if (data.length <= 100) return data;
    const downsampled = [];
    for (let i = 0; i < data.length; i += factor) {
      downsampled.push(data[i]);
    }
    return downsampled;
  };

  const chartData = useMemo(() => {
    const sampleFactor = Math.ceil(filteredData.length / 100) || 1;
    const sampledData = downsampleData(filteredData, sampleFactor);
    
    return {
      labels: sampledData.map((d) => format(new Date(d.fecha), "dd MMM HH:mm", { locale: es })),
      datasets: [{
        label: selectedMetric.toUpperCase(),
        data: sampledData.map((d) => d[selectedMetric]),
        borderColor: metricColors[selectedMetric].chart,
        backgroundColor: `${metricColors[selectedMetric].chart}20`,
        tension: 0.4,
        fill: true,
        pointRadius: 0.5,
      }]
    };
  }, [filteredData, selectedMetric]);

  if (!producto && !loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <Typography variant="h5" className="mb-4">
            Producto no encontrado
          </Typography>
          <Button
            variant="contained"
            startIcon={<FiArrowLeft />}
            onClick={() => navigate(-1)}
          >
            Volver al historial
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <>
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="flex h-full">
        <Sidebar />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <HeaderDashboard title="Monitoreo Histórico" />

          <main className="flex-1 overflow-y-auto">
            <div className="w-full p-8 2xl:px-12">
              <div className="max-w-9xl mx-auto">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 transition-all duration-300 ease-in-out">
                  <div className="px-8 py-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                          {producto?.nombre_producto || "Cargando..."}
                        </h1>
                        <div className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                          <p>Datos registrados: {fullData.length}</p>
                          <span className="mx-1">•</span>
                          <p>Datos máximos mostrados: 100</p>
                          <span className="mx-1">•</span>
                          <p>Estado: {monitoreoActivo ? "Activo" : "Completado"}</p>
                        </div>
                        {dateError && (
                          <Alert severity="error" className="mt-2">
                            {dateError}
                          </Alert>
                        )}
                      </div>

                      <div className="w-full md:w-auto flex flex-col gap-2">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <div className="flex gap-2 flex-wrap items-center">
                            <DateTimePicker
                              label="Fecha/hora inicial"
                              value={startDate}
                              onChange={handleStartDateChange}
                              maxDateTime={endDate || undefined}
                              format="dd/MM/yyyy HH:mm"
                              ampm={false}
                              slots={{
                                openPickerIcon: FiClock,
                              }}
                              className="w-64"
                            />
                            <DateTimePicker
                              label="Fecha/hora final"
                              value={endDate}
                              onChange={handleEndDateChange}
                              minDateTime={startDate || undefined}
                              maxDateTime={monitoreoActivo ? new Date() : undefined}
                              disabled={monitoreoActivo}
                              format="dd/MM/yyyy HH:mm"
                              ampm={false}
                              slots={{
                                openPickerIcon: FiClock,
                              }}
                              className="w-64"
                            />
                            <Button
                              variant="outlined"
                              onClick={() => {
                                if (producto) {
                                  const newEnd = monitoreoActivo ? new Date() :
                                    producto.fecha_finalizacion_monitoreo
                                      ? new Date(producto.fecha_finalizacion_monitoreo)
                                      : new Date();

                                  const newStart = new Date(newEnd);
                                  newStart.setDate(newEnd.getDate() - 7);

                                  setStartDate(newStart);
                                  setEndDate(newEnd);
                                  setDateError(null);
                                }
                              }}
                              className="h-[56px]"
                            >
                              Restablecer
                            </Button>
                          </div>
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 lg:p-8">
                    {loading ? (
                      <Skeleton variant="rectangular" height={400} />
                    ) : producto ? (
                      <div className="p-8">
                        <Grid container spacing={4}>
                          <Grid item xs={12} lg={4}>
                            <Card className="p-6 h-full">
                              <div className="flex flex-col items-center text-center mb-6">
                                <Avatar
                                  src={producto.foto_producto}
                                  sx={{ width: 120, height: 120 }}
                                  className="mb-4 shadow-lg"
                                />
                                <Typography variant="h5" className="font-bold">
                                  {producto.nombre_producto}
                                </Typography>
                                <Chip
                                  label={monitoreoActivo ? "En Monitoreo" : "Monitoreo Finalizado"}
                                  color={monitoreoActivo ? "primary" : "secondary"}
                                  className="mt-2"
                                  variant="outlined"
                                />
                              </div>

                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <FiMapPin className="text-gray-500" />
                                  <Typography>{producto.localizacion}</Typography>
                                </div>
                                <div className="flex items-center gap-3">
                                  <FiCalendar className="text-gray-500" />
                                  <Typography>
                                    Inicio: {safeFormatDate(
                                      producto.fecha_inicio_monitoreo,
                                      "dd MMM yyyy HH:mm"
                                    )}
                                  </Typography>
                                </div>
                                <div className="flex items-center gap-3">
                                  <FiStopCircle className="text-gray-500" />
                                  <Typography>
                                    {monitoreoActivo ? 
                                      "Monitoreo en curso" : 
                                      `Fin: ${safeFormatDate(
                                        producto.fecha_finalizacion_monitoreo,
                                        "dd MMM yyyy HH:mm"
                                      )}`
                                    }
                                  </Typography>
                                </div>
                              </div>
                            </Card>
                          </Grid>

                          <Grid item xs={12} lg={8}>
                            <Card className="p-6 h-full">
                              <div className="mb-4">
                                <Tabs
                                  value={selectedMetric}
                                  onChange={(_, newValue) => setSelectedMetric(newValue)}
                                >
                                  <Tab label="Temperatura" value="temperatura" icon={<FiThermometer />} />
                                  <Tab label="Humedad" value="humedad" icon={<FiDroplet />} />
                                  <Tab label="Luz" value="lux" icon={<FiSun />} />
                                  <Tab label="Presión" value="presion" icon={<FiAlertTriangle />} />
                                </Tabs>
                              </div>

                              <div className="h-96">
                                <Line
                                  data={chartData}
                                  options={{
                                    responsive: true,
                                    plugins: {
                                      legend: { display: false },
                                      tooltip: {
                                        intersect: false,
                                        mode: 'index',
                                        callbacks: {
                                          title: (context) => {
                                            const originalIndex = context[0].dataIndex * Math.ceil(filteredData.length / 100);
                                            return format(
                                              new Date(filteredData[originalIndex].fecha),
                                              "dd MMM yyyy HH:mm:ss",
                                              { locale: es }
                                            );
                                          }
                                        }
                                      },
                                    },
                                    scales: {
                                      x: {
                                        grid: { display: false },
                                        ticks: {
                                          maxRotation: 0,
                                          autoSkip: true,
                                          maxTicksLimit: 12,
                                          callback: (value) => {
                                            const originalIndex = Number(value) * Math.ceil(filteredData.length / 100);
                                            return format(new Date(filteredData[originalIndex].fecha), "HH:mm");
                                          }
                                        }
                                      },
                                      y: {
                                        title: {
                                          display: true,
                                          text: selectedMetric === "temperatura"
                                            ? "°C"
                                            : selectedMetric === "humedad"
                                            ? "%"
                                            : selectedMetric === "lux"
                                            ? "lux"
                                            : "hPa",
                                        },
                                      },
                                    },
                                    interaction: {
                                      mode: 'index',
                                      axis: 'x'
                                    }
                                  }}
                                />
                              </div>

                              <Grid container spacing={2} className="mt-4">
                                {(["temperatura", "humedad", "lux", "presion"] as const).map((metric) => (
                                  <Grid item xs={6} sm={3} key={metric}>
                                    <Card className="p-3">
                                      <Typography variant="body2" className="font-semibold text-gray-600">
                                        {metric === "lux" ? "Luz" : metric.charAt(0).toUpperCase() + metric.slice(1)}
                                      </Typography>
                                      <div className="flex justify-between items-center mt-2">
                                        <Typography variant="h6" className="font-bold">
                                          {filteredData.length > 0 
                                            ? Math.min(...filteredData.map(d => d[metric])).toFixed(1)
                                            : 'N/A'}
                                        </Typography>
                                        <Typography variant="h6" className="font-bold">
                                          {filteredData.length > 0 
                                            ? Math.max(...filteredData.map(d => d[metric])).toFixed(1)
                                            : 'N/A'}
                                        </Typography>
                                      </div>
                                      <Typography variant="caption" className="text-gray-500">
                                        Mín / Máx
                                      </Typography>
                                    </Card>
                                  </Grid>
                                ))}
                              </Grid>
                            </Card>
                          </Grid>
                        </Grid>
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <Typography variant="h5" className="text-red-500">
                          {error || "Producto no encontrado"}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
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

export default HistoricoMonitoreo;