// EditarProductoDialog.tsx
import React, { useState, useRef, useEffect } from "react";
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
  MenuItem,
} from "@mui/material";
import { FaTimes } from "react-icons/fa";
import api from "../api";

export interface ProductoFarmaceutico {
  id?: number;
  nombre: string;
  formula: string;
  concentracion: string;
  indicaciones: string;
  contraindicaciones: string;
  efectos_secundarios: string;
  foto: string;
  id_forma_farmaceutica: number;
  id_condicion: number;
}

interface EditarProductoDialogProps {
  open: boolean;
  onClose: () => void;
  producto: ProductoFarmaceutico;
  formasFarmaceuticas: { id: number; nombre: string }[];
  condicionesAlmacenamiento: { id: number; nombre: string }[];
  handleProductoChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleActualizar: () => Promise<void>;
}

const EditarProductoDialog: React.FC<EditarProductoDialogProps> = ({
  open,
  onClose,
  producto,
  formasFarmaceuticas,
  condicionesAlmacenamiento,
  handleProductoChange,
  handleActualizar,
}) => {
  const theme = useTheme();

  // Estado para la vista previa de la imagen y referencia al file input
  const [preview, setPreview] = useState<string>(producto.foto);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cuando cambie la propiedad "foto" en el producto, actualizamos la preview
  useEffect(() => {
    setPreview(producto.foto);
  }, [producto.foto]);

  // Función para subir la imagen
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const response = await api.post("/upload-image/", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if ([200, 201].includes(response.status)) {
        setPreview(response.data.url);
        // Se envía un evento sintético para actualizar el campo "foto"
        const syntheticEvent = {
          target: { name: "foto", value: response.data.url },
        } as React.ChangeEvent<HTMLInputElement>;
        handleProductoChange(syntheticEvent);
      }
    } catch (error) {
      console.error("Error al subir la imagen", error);
    }
  };

  // Función para eliminar la imagen (vaciar el campo "foto")
  const handleRemoveImage = () => {
    setPreview("");
    const syntheticEvent = {
      target: { name: "foto", value: "" },
    } as React.ChangeEvent<HTMLInputElement>;
    handleProductoChange(syntheticEvent);
  };

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
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: theme.palette.common.white,
          py: 3,
          px: 3,
          borderRadius: '20px 20px 0 0',
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Editar Producto Farmacéutico
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
        <Grid container spacing={3}>
          {/* Sección Información Básica */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Nombre del producto"
              name="nombre"
              value={producto.nombre}
              onChange={handleProductoChange}
              fullWidth
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                  },
                },
              }}
            />

            <TextField
              select
              label="Forma Farmacéutica"
              name="id_forma_farmaceutica"
              value={producto.id_forma_farmaceutica}
              onChange={handleProductoChange}
              fullWidth
              variant="outlined"
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                  },
                },
              }}
            >
              {formasFarmaceuticas.map((forma) => (
                <MenuItem
                  key={forma.id}
                  value={forma.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    },
                  }}
                >
                  {forma.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Fórmula"
              name="formula"
              value={producto.formula}
              onChange={handleProductoChange}
              fullWidth
              variant="outlined"
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Condición de Almacenamiento"
              name="id_condicion"
              value={producto.id_condicion}
              onChange={handleProductoChange}
              fullWidth
              variant="outlined"
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                  },
                },
              }}
            >
              {condicionesAlmacenamiento.map((condicion) => (
                <MenuItem
                  key={condicion.id}
                  value={condicion.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    },
                  }}
                >
                  {condicion.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Concentración"
              name="concentracion"
              value={producto.concentracion}
              onChange={handleProductoChange}
              fullWidth
              variant="outlined"
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                  },
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Sección para subir y visualizar la imagen */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="600" mb={2} sx={{ color: '#667eea' }}>
              Imagen del Producto
            </Typography>
            <div
              style={{
                position: "relative",
                border: "2px dashed",
                borderColor: "#667eea",
                borderRadius: 16,
                padding: 16,
                textAlign: "center",
                cursor: "pointer",
                background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                transition: "all 0.3s ease",
              }}
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#764ba2";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.2)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#667eea";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Vista previa del producto"
                    style={{
                      width: "100%",
                      maxHeight: 300,
                      objectFit: "contain",
                      borderRadius: 12,
                    }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      borderRadius: '12px',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Eliminar
                  </Button>
                </>
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                  Haz clic para seleccionar una imagen
                </Typography>
              )}
              <input
                id="image-upload"
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
              />
            </div>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(0,0,0,0.08)' }} />

        {/* Sección Información Clínica */}
        <Typography variant="subtitle1" fontWeight="600" mb={2} sx={{ color: '#667eea' }}>
          Información Clínica
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Indicaciones"
              name="indicaciones"
              value={producto.indicaciones}
              onChange={handleProductoChange}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Contraindicaciones"
              name="contraindicaciones"
              value={producto.contraindicaciones}
              onChange={handleProductoChange}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Efectos Secundarios"
              name="efectos_secundarios"
              value={producto.efectos_secundarios}
              onChange={handleProductoChange}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                  },
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Advertencia */}
        <Typography
          variant="body2"
          sx={{
            mt: 4,
            mb: 2,
            p: 3,
            borderRadius: 2,
            background: "linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%)",
            color: theme.palette.warning.dark,
            border: "2px solid",
            borderColor: theme.palette.warning.main,
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(255, 152, 0, 0.15)',
          }}
        >
          ⚠️ Cambiar la condición de almacenamiento o forma farmacéutica podría:
          <ul style={{ margin: "8px 0 0 20px" }}>
            <li>Afectar los productos monitoreados asociados</li>
            <li>Requiere actualizar los protocolos de almacenamiento</li>
            <li>Podría necesitar revalidación de estabilidad</li>
          </ul>
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 3,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: 'rgba(248, 250, 252, 0.5)',
          gap: 2,
        }}
      >
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
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            '&:hover': {
              background: "linear-gradient(135deg, #5568d3 0%, #64418a 100%)",
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Actualizar Producto
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarProductoDialog;
