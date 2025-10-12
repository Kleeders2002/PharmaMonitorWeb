import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  DialogActions,
  IconButton,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { FaTimes } from "react-icons/fa";

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

interface CondicionAlmacenamientoDialogProps {
  open: boolean;
  onClose: () => void;
  existingConditions: CondicionAlmacenamiento[];
  selectedConditionId: string;
  handleSelectCondition: (e: SelectChangeEvent<string>) => void;
  handleAddCondition: () => Promise<void>;
  condiciones: CondicionAlmacenamiento;
  handleCondicionesChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const CondicionAlmacenamientoDialog: React.FC<CondicionAlmacenamientoDialogProps> = ({
  open,
  onClose,
  existingConditions,
  selectedConditionId,
  handleSelectCondition,
  handleAddCondition,
  condiciones,
  handleCondicionesChange,
}) => {
  const theme = useTheme();
  const isEditingExisting = selectedConditionId !== "";

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <Typography variant="subtitle1" fontWeight="600" mt={2} mb={1}>
      {children}
    </Typography>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        py: 2
      }}>
        <Typography variant="h6" component="div">
          {isEditingExisting ? "Gestión de Condiciones" : "Nueva Condición"}
        </Typography>
        <IconButton 
          onClick={onClose} 
          size="small" 
          sx={{ color: theme.palette.common.white }}
        >
          <FaTimes />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Seleccionar condición existente</InputLabel>
          <Select
            value={selectedConditionId}
            onChange={handleSelectCondition}
            label="Seleccionar condición existente"
            variant="outlined"
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 250,
                }
              }
            }}
          >
            <MenuItem value="">
              <em>Crear nueva condición</em>
            </MenuItem>
            {existingConditions.map((cond) => (
              <MenuItem key={cond.id} value={cond.id?.toString() || ""}>
                {cond.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider sx={{ my: 3 }} />

        <TextField
          label="Nombre de la condición"
          name="nombre"
          value={condiciones.nombre}
          onChange={handleCondicionesChange}
          fullWidth
          variant="outlined"
          margin="normal"
          disabled={isEditingExisting}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />

        <SectionTitle>Parámetros Ambientales</SectionTitle>
        <Grid container spacing={3}>
          {/* Temperatura */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  Temperatura (°C)
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Mínima"
                  name="temperatura_min"
                  value={condiciones.temperatura_min}
                  onChange={handleCondicionesChange}
                  fullWidth
                  variant="outlined"
                  type="number"
                  disabled={isEditingExisting}
                  InputProps={{
                    endAdornment: <Typography variant="caption">°C</Typography>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Máxima"
                  name="temperatura_max"
                  value={condiciones.temperatura_max}
                  onChange={handleCondicionesChange}
                  fullWidth
                  variant="outlined"
                  type="number"
                  disabled={isEditingExisting}
                  InputProps={{
                    endAdornment: <Typography variant="caption">°C</Typography>,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Humedad */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  Humedad Relativa (%)
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Mínima"
                  name="humedad_min"
                  value={condiciones.humedad_min}
                  onChange={handleCondicionesChange}
                  fullWidth
                  variant="outlined"
                  type="number"
                  disabled={isEditingExisting}
                  InputProps={{
                    endAdornment: <Typography variant="caption">%</Typography>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Máxima"
                  name="humedad_max"
                  value={condiciones.humedad_max}
                  onChange={handleCondicionesChange}
                  fullWidth
                  variant="outlined"
                  type="number"
                  disabled={isEditingExisting}
                  InputProps={{
                    endAdornment: <Typography variant="caption">%</Typography>,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Iluminación */}
        <SectionTitle>Control de Iluminación</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Nivel Mínimo (Lux)"
              name="lux_min"
              value={condiciones.lux_min}
              onChange={handleCondicionesChange}
              fullWidth
              variant="outlined"
              type="number"
              disabled={isEditingExisting}
              InputProps={{
                endAdornment: <Typography variant="caption">Lux</Typography>,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Nivel Máximo (Lux)"
              name="lux_max"
              value={condiciones.lux_max}
              onChange={handleCondicionesChange}
              fullWidth
              variant="outlined"
              type="number"
              disabled={isEditingExisting}
              InputProps={{
                endAdornment: <Typography variant="caption">Lux</Typography>,
              }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Presión */}
        <SectionTitle>Presión Atmosférica</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Mínima (hPa)"
              name="presion_min"
              value={condiciones.presion_min}
              onChange={handleCondicionesChange}
              fullWidth
              variant="outlined"
              type="number"
              disabled={isEditingExisting}
              InputProps={{
                endAdornment: <Typography variant="caption">hPa</Typography>,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Máxima (hPa)"
              name="presion_max"
              value={condiciones.presion_max}
              onChange={handleCondicionesChange}
              fullWidth
              variant="outlined"
              type="number"
              disabled={isEditingExisting}
              InputProps={{
                endAdornment: <Typography variant="caption">hPa</Typography>,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="secondary"
          sx={{ width: { xs: '100%', sm: 'auto' }, mb: { xs: 1, sm: 0 } }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleAddCondition}
          variant="contained"
          color="primary"
          sx={{ 
            width: { xs: '100%', sm: 'auto' },
            ml: { sm: 2 }
          }}
        >
          {isEditingExisting ? "Actualizar Condición" : "Guardar Nueva"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CondicionAlmacenamientoDialog;