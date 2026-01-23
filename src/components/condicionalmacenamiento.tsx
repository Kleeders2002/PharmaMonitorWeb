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
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
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
          gap: 1,
          p: 1.5,
          bgcolor: `${color}10`,
          borderRadius: 2,
          border: `1px solid ${color}30`,
        }}
      >
        <Box sx={{ color, fontSize: 24 }}>{icon}</Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="textSecondary" display="block">
            {label}
          </Typography>
          <Typography variant="body2" fontWeight="600">
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
        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
        background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          {condition.nombre}
          <Typography component="span" variant="caption" color="textSecondary" sx={{ ml: 2 }}>
            ID: {condition.id}
          </Typography>
        </Typography>
        <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
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
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight="600">
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
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            "&:hover": {
              boxShadow: "0 6px 8px rgba(0,0,0,0.15)",
              transform: "translateY(-1px)",
            },
          }}
        >
          Nueva Condición
        </Button>
      </Box>

      {condiciones.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="textSecondary">
              No hay condiciones registradas
            </Typography>
            <Button
              variant="outlined"
              startIcon={<FaPlus />}
              onClick={handleCreateNew}
              sx={{ mt: 2 }}
            >
              Crear Primera Condición
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Dropdown para seleccionar condición */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <FormControl fullWidth>
                <InputLabel>Seleccionar Condición</InputLabel>
                <Select
                  value={selectedDropdownValue}
                  label="Seleccionar Condición"
                  onChange={handleDropdownChange}
                >
                  <MenuItem value="">
                    <em>Seleccione una condición...</em>
                  </MenuItem>
                  {condiciones.map((cond) => (
                    <MenuItem key={cond.id} value={cond.id?.toString() || ""}>
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
