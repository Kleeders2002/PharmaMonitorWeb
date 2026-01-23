import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  FiThermometer,
  FiDroplet,
  FiSun,
} from "react-icons/fi";
import { FaPlus, FaWeight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api";

export interface CondicionAlmacenamiento {
  id?: number;
  nombre: string;
  temperatura_min: string;
  temperatura_max: string;
  humedad_min: string;
  humedad_max: string;
  lux_min: string;
  lux_max: string;
  presion_min: string;
  presion_max: string;
}

interface CondicionListProps {
  onSelectCondition?: (condicion: CondicionAlmacenamiento) => void;
  selectedConditionId?: string;
}

const CondicionAlmacenamientoList: React.FC<CondicionListProps> = ({
  onSelectCondition,
  selectedConditionId,
}) => {
  const [condiciones, setCondiciones] = useState<CondicionAlmacenamiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCondiciones = async () => {
      try {
        const response = await api.get<CondicionAlmacenamiento[]>("/condiciones/");
        setCondiciones(response.data);
        setError(null);
      } catch (err) {
        setError("Error al cargar las condiciones de almacenamiento");
        console.error("Error fetching condiciones:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCondiciones();
  }, []);

  useEffect(() => {
    // Sincronizar con el selectedConditionId externo
    if (selectedConditionId) {
      setSelectedDropdownValue(selectedConditionId);
    }
  }, [selectedConditionId]);

  const handleCreateNew = () => {
    navigate("/AgregarCondicionAmbiental");
  };

  const handleDropdownChange = (event: any) => {
    const value = event.target.value;
    setSelectedDropdownValue(value);

    if (value && onSelectCondition) {
      const selected = condiciones.find((cond) => cond.id?.toString() === value);
      if (selected) {
        onSelectCondition(selected);
      }
    }
  };

  const getSelectedCondition = () => {
    if (selectedDropdownValue) {
      return condiciones.find((cond) => cond.id?.toString() === selectedDropdownValue);
    }
    return null;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
        gap={2}
        sx={{
          background: 'linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(248,250,252,0.8))',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          p: 4,
        }}
      >
        <CircularProgress
          sx={{
            color: '#667eea',
          }}
        />
        <Typography variant="body2" color="textSecondary" fontWeight={500}>
          Cargando condiciones...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          mb: 2,
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
          border: '2px solid rgba(239, 68, 68, 0.2)',
        }}
      >
        {error}
      </Alert>
    );
  }

  const ParameterRange: React.FC<{
    icon: React.ReactNode;
    label: string;
    min: string;
    max: string;
    unit: string;
    color: string;
  }> = ({ icon, label, min, max, unit, color }) => (
    <Grid item xs={12} sm={6} md={3}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 2,
          bgcolor: `${color}10`,
          borderRadius: 3,
          border: `2px solid ${color}30`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 20px ${color}30`,
            borderColor: color,
          },
        }}
      >
        <Box sx={{ color, fontSize: 28 }}>{icon}</Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="textSecondary" display="block" fontWeight={600}>
            {label}
          </Typography>
          <Typography variant="body2" fontWeight="700" color="textPrimary">
            {min} - {max} {unit}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );

  const SelectedConditionCard = ({ condition }: { condition: CondicionAlmacenamiento }) => (
    <Card
      sx={{
        border: "2px solid #667eea",
        boxShadow: "0 8px 24px rgba(102, 126, 234, 0.25)",
        background: "linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)",
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: "0 12px 32px rgba(102, 126, 234, 0.35)",
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="700" gutterBottom sx={{ color: '#667eea' }}>
          {condition.nombre}
          <Typography component="span" variant="caption" color="textSecondary" sx={{ ml: 2, fontWeight: 500 }}>
            ID: {condition.id}
          </Typography>
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 3, color: '#764ba2', fontWeight: 600 }}>
          Condición Seleccionada
        </Typography>
        <Grid container spacing={2}>
          <ParameterRange
            icon={<FiThermometer />}
            label="Temperatura"
            min={condition.temperatura_min}
            max={condition.temperatura_max}
            unit="°C"
            color="#f44336"
          />
          <ParameterRange
            icon={<FiDroplet />}
            label="Humedad"
            min={condition.humedad_min}
            max={condition.humedad_max}
            unit="%"
            color="#2196f3"
          />
          <ParameterRange
            icon={<FiSun />}
            label="Iluminación"
            min={condition.lux_min}
            max={condition.lux_max}
            unit="Lux"
            color="#ff9800"
          />
          <ParameterRange
            icon={<FaWeight />}
            label="Presión"
            min={condition.presion_min}
            max={condition.presion_max}
            unit="hPa"
            color="#9c27b0"
          />
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h6" fontWeight="700" sx={{ color: '#667eea' }}>
          Condiciones de Almacenamiento
        </Typography>
        <Button
          variant="contained"
          startIcon={<FaPlus />}
          onClick={handleCreateNew}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: '14px',
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
            "&:hover": {
              boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
              transform: "translateY(-2px)",
              background: "linear-gradient(135deg, #5568d3 0%, #64418a 100%)",
            },
            transition: 'all 0.3s ease',
          }}
        >
          Nueva Condición
        </Button>
      </Box>

      {condiciones.length === 0 ? (
        <Card
          sx={{
            borderRadius: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            background: 'linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(248,250,252,0.8))',
            backdropFilter: 'blur(20px)',
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaPlus style={{ fontSize: 32, color: '#667eea' }} />
            </Box>
            <Typography variant="body1" color="textSecondary" fontWeight={500} mb={2}>
              No hay condiciones registradas
            </Typography>
            <Button
              variant="outlined"
              startIcon={<FaPlus />}
              onClick={handleCreateNew}
              sx={{
                mt: 2,
                borderRadius: '12px',
                fontWeight: 600,
                px: 3,
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': {
                  borderColor: '#764ba2',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Crear Primera Condición
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Dropdown para seleccionar condición */}
          <Card
            sx={{
              mb: 3,
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              background: 'linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(248,250,252,0.8))',
              backdropFilter: 'blur(20px)',
            }}
          >
            <CardContent>
              <FormControl fullWidth>
                <InputLabel sx={{ fontWeight: 600 }}>Seleccionar Condición</InputLabel>
                <Select
                  value={selectedDropdownValue}
                  label="Seleccionar Condición"
                  onChange={handleDropdownChange}
                  sx={{
                    borderRadius: '12px',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccione una condición...</em>
                  </MenuItem>
                  {condiciones.map((cond) => (
                    <MenuItem
                      key={cond.id}
                      value={cond.id?.toString() || ""}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        },
                      }}
                    >
                      {cond.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          {/* Tarjeta destacada con la condición seleccionada */}
          {selectedDropdownValue && getSelectedCondition() && (
            <SelectedConditionCard condition={getSelectedCondition()!} />
          )}
        </>
      )}
    </Box>
  );
};

export default CondicionAlmacenamientoList;
