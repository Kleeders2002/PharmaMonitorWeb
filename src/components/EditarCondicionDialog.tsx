// EditarCondicionDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
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

interface EditarCondicionDialogProps {
  open: boolean;
  onClose: () => void;
  condiciones: CondicionAlmacenamiento;
  handleCondicionesChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleActualizar: () => Promise<void>;
}

const EditarCondicionDialog: React.FC<EditarCondicionDialogProps> = ({
  open,
  onClose,
  condiciones,
  handleCondicionesChange,
  handleActualizar,
}) => {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
          py: 2,
        }}
      >
        <Typography variant="h6" component="div">
          Editar Condición
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: theme.palette.common.white }}>
          <FaTimes />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <TextField
          label="Nombre de la condición"
          name="nombre"
          value={condiciones.nombre}
          onChange={handleCondicionesChange}
          fullWidth
          variant="outlined"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />

        {/* Advertencia en flujo normal */}
        <Typography 
          variant="body2" 
          sx={{
            mb: 4,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
            color: theme.palette.error.dark,
            backgroundColor: theme.palette.error.light,
            p: 2,
            borderRadius: 1,
            border: `1px solid ${theme.palette.error.main}`,
            fontWeight: 600,
            fontSize: '0.875rem',
            boxShadow: theme.shadows[1]
          }}
        >
          <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>⚠️</span>
          <div>
            <strong>Impacto en monitoreo:</strong> Cualquier modificación en estos parámetros:
            <ul style={{ 
              margin: '8px 0 0 0', 
              paddingLeft: 24,
              listStyleType: 'disc' 
            }}>
              <li>Actualizará automáticamente los protocolos vinculados</li>
              <li>Generará recalibración de sensores asociados</li>
              <li>Podría invalidar lotes farmacéuticos en auditoría</li>
            </ul>
          </div>
        </Typography>

        {/* Resto del contenido... (Mantener igual que la versión anterior) */}
        <Typography variant="subtitle1" fontWeight="600" mb={1}>
          Parámetros Ambientales
        </Typography>
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
                  InputProps={{ endAdornment: <Typography variant="caption">°C</Typography> }}
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
                  InputProps={{ endAdornment: <Typography variant="caption">°C</Typography> }}
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
                  InputProps={{ endAdornment: <Typography variant="caption">%</Typography> }}
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
                  InputProps={{ endAdornment: <Typography variant="caption">%</Typography> }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" fontWeight="600" mt={2} mb={1}>
          Control de Iluminación
        </Typography>
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
              InputProps={{ endAdornment: <Typography variant="caption">Lux</Typography> }}
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
              InputProps={{ endAdornment: <Typography variant="caption">Lux</Typography> }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" fontWeight="600" mt={2} mb={1}>
          Presión Atmosférica
        </Typography>
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
              InputProps={{ endAdornment: <Typography variant="caption">hPa</Typography> }}
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
              InputProps={{ endAdornment: <Typography variant="caption">hPa</Typography> }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ 
        px: 3, 
        py: 2, 
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default 
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          sx={{ width: { xs: "100%", sm: "auto" }, mb: { xs: 1, sm: 0 } }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleActualizar}
          variant="contained"
          color="primary"
          sx={{ width: { xs: "100%", sm: "auto" }, ml: { sm: 2 } }}
        >
          Actualizar Condición
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarCondicionDialog;