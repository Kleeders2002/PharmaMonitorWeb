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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          background: 'linear-gradient(to bottom right, rgba(255,255,255,0.95), rgba(248,250,252,0.95))',
          backdropFilter: 'blur(20px)',
        }
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          color: theme.palette.common.white,
          py: 3,
          px: 3,
          borderRadius: '20px 20px 0 0',
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Editar Condición
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: theme.palette.common.white,
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
              transform: 'rotate(90deg)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <FaTimes />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 4, px: 3, borderColor: 'rgba(0,0,0,0.08)' }}>
        <TextField
          label="Nombre de la condición"
          name="nombre"
          value={condiciones.nombre}
          onChange={handleCondicionesChange}
          fullWidth
          variant="outlined"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          sx={{
            mb: 4,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(240, 147, 251, 0.15)',
              },
            },
          }}
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
            background: "linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(255, 87, 108, 0.1) 100%)",
            p: 3,
            borderRadius: 2,
            border: "2px solid",
            borderColor: theme.palette.error.main,
            fontWeight: 600,
            fontSize: '0.875rem',
            boxShadow: '0 4px 12px rgba(244, 67, 54, 0.15)',
          }}
        >
          <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>⚠️</span>
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

        <Typography variant="subtitle1" fontWeight="600" mb={2} sx={{ color: '#f5576c' }}>
          Parámetros Ambientales
        </Typography>
        <Grid container spacing={3}>
          {/* Temperatura */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" fontWeight={600}>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(240, 147, 251, 0.15)',
                      },
                    },
                  }}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(240, 147, 251, 0.15)',
                      },
                    },
                  }}
                  InputProps={{ endAdornment: <Typography variant="caption">°C</Typography> }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Humedad */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" fontWeight={600}>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(240, 147, 251, 0.15)',
                      },
                    },
                  }}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(240, 147, 251, 0.15)',
                      },
                    },
                  }}
                  InputProps={{ endAdornment: <Typography variant="caption">%</Typography> }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(0,0,0,0.08)' }} />

        <Typography variant="subtitle1" fontWeight="600" mt={2} mb={2} sx={{ color: '#f5576c' }}>
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(240, 147, 251, 0.15)',
                  },
                },
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(240, 147, 251, 0.15)',
                  },
                },
              }}
              InputProps={{ endAdornment: <Typography variant="caption">Lux</Typography> }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(0,0,0,0.08)' }} />

        <Typography variant="subtitle1" fontWeight="600" mt={2} mb={2} sx={{ color: '#f5576c' }}>
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(240, 147, 251, 0.15)',
                  },
                },
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(240, 147, 251, 0.15)',
                  },
                },
              }}
              InputProps={{ endAdornment: <Typography variant="caption">hPa</Typography> }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 3,
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: 'rgba(248, 250, 252, 0.5)',
        gap: 2,
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          sx={{
            width: { xs: "100%", sm: "auto" },
            mb: { xs: 1, sm: 0 },
            borderRadius: '12px',
            fontWeight: 600,
            px: 3,
            borderColor: '#d1d5db',
            '&:hover': {
              borderColor: '#9ca3af',
              backgroundColor: 'rgba(0,0,0,0.04)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleActualizar}
          variant="contained"
          sx={{
            width: { xs: "100%", sm: "auto" },
            ml: { sm: 2 },
            borderRadius: '12px',
            fontWeight: 600,
            px: 3,
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            '&:hover': {
              background: "linear-gradient(135deg, #e080eb 0%, #e1445a 100%)",
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 20px rgba(240, 147, 251, 0.4)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Actualizar Condición
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarCondicionDialog;