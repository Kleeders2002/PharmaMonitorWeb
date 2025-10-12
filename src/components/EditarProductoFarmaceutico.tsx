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
          Editar Producto Farmacéutico
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
            >
              {formasFarmaceuticas.map((forma) => (
                <MenuItem key={forma.id} value={forma.id}>
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
            >
              {condicionesAlmacenamiento.map((condicion) => (
                <MenuItem key={condicion.id} value={condicion.id}>
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
            />
            {/* Se elimina el TextField para la URL de imagen */}
          </Grid>
        </Grid>

        {/* Sección para subir y visualizar la imagen */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="600" mb={1}>
              Imagen del Producto
            </Typography>
            <div
              style={{
                position: "relative",
                border: "2px dashed #ccc",
                borderRadius: 8,
                padding: 8,
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => fileInputRef.current?.click()}
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
                    }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    Eliminar
                  </Button>
                </>
              ) : (
                <Typography variant="body2" color="textSecondary">
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

        <Divider sx={{ my: 3 }} />

        {/* Sección Información Clínica */}
        <Typography variant="subtitle1" fontWeight="600" mb={2}>
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
            />
          </Grid>
        </Grid>

        {/* Advertencia */}
        <Typography
          variant="body2"
          sx={{
            mt: 3,
            mb: 2,
            p: 2,
            borderRadius: 1,
            backgroundColor: theme.palette.warning.light,
            color: theme.palette.warning.dark,
            border: `1px solid ${theme.palette.warning.main}`,
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
          py: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default,
        }}
      >
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
          Actualizar Producto
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarProductoDialog;
