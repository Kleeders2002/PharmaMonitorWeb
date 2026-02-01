// ConsultarProductos.tsx
import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Alert,
  Typography,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
} from "@mui/material";
import {
  FaSearch,
  FaExclamationCircle,
  FaTrashAlt,
  FaEdit,
  FaPills,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import HeaderDashboard from "../components/HeaderDashboard";
import api from "../api";
import Tooltip from "@mui/material/Tooltip";
import EditarProductoDialog from "../components/EditarProductoFarmaceutico";

// Interfaz extendida del producto
interface ProductoFarmaceutico {
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
  // Propiedades de relación para visualización (se excluyen en la actualización)
  formafarmaceutica?: string;
  condicion?: string;
  is_related?: boolean;  // Nueva propiedad
}

const ConsultarProductos: React.FC = () => {
  // Estados para la lista de productos y búsqueda
  const [productos, setProductos] = useState<ProductoFarmaceutico[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<ProductoFarmaceutico[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Estados para el diálogo de eliminación
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  // Estados para el diálogo de edición
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [selectedProducto, setSelectedProducto] = useState<ProductoFarmaceutico | null>(null);

  // Estados para select de formas farmacéuticas y condiciones de almacenamiento
  const [formasFarmaceuticas, setFormasFarmaceuticas] = useState<{ id: number; nombre: string }[]>([]);
  const [condicionesAlmacenamiento, setCondicionesAlmacenamiento] = useState<{ id: number; nombre: string }[]>([]);

  const navigate = useNavigate();

  // Cargar productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get("/productos/");
        const productosData = response.data.map((producto: any) => ({
          ...producto,
          formafarmaceutica: producto.formafarmaceutica?.descripcion || "N/A",
          condicion: producto.condicion?.nombre || "N/A",
          contraindicaciones: producto.contraindicaciones || "",
          efectos_secundarios: producto.efectos_secundarios || "",
          id_forma_farmaceutica: producto.id_forma_farmaceutica || 0,
          id_condicion: producto.id_condicion || 0,
          foto: producto.foto || "",
          is_related: producto.is_related  // Mapear la nueva propiedad
        }));
        setProductos(productosData);
        setFilteredProductos(productosData);
        setError(null);
      } catch (err: any) {
        setError("Error al cargar la lista de productos farmacéuticos.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // Cargar formas farmacéuticas y condiciones de almacenamiento
  useEffect(() => {
    const fetchFormasFarmaceuticas = async () => {
      try {
        const response = await api.get("/formafarmaceutica/");
        const data = Array.isArray(response.data) ? response.data : [];
        // Mapea para que cada objeto tenga la propiedad "nombre" a partir de "descripcion"
        const mappedFormas = data.map((item: any) => ({
          ...item,
          nombre: item.descripcion,
        }));
        setFormasFarmaceuticas(mappedFormas);
      } catch (err) {
        // Manejo de error si se requiere
      }
    };

    const fetchCondicionesAlmacenamiento = async () => {
      try {
        const response = await api.get("/condiciones/");
        setCondicionesAlmacenamiento(response.data);
      } catch (err) {
        // Manejo de error si se requiere
      }
    };

    fetchFormasFarmaceuticas();
    fetchCondicionesAlmacenamiento();
  }, []);

  // Función de búsqueda
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setFilteredProductos(
      productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(value.toLowerCase()) ||
        producto.formula.toLowerCase().includes(value.toLowerCase()) ||
        producto.concentracion.toLowerCase().includes(value.toLowerCase()) ||
        producto.formafarmaceutica?.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  // Abrir diálogo de edición
  const handleEdit = (id: number) => {
    const producto = productos.find((p) => p.id === id);
    if (producto) {
      setSelectedProducto(producto);
      setOpenEditDialog(true);
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedProducto(null);
  };

  // Actualizar producto: construir el payload excluyendo propiedades de relación
  const handleActualizar = async () => {
    if (selectedProducto && selectedProducto.id) {
      try {
        // Excluir propiedades de relación
        const { id, formafarmaceutica, condicion, ...payload } = selectedProducto;
        await api.put(`/productos/${selectedProducto.id}`, payload);
  
        // Obtener los nombres actualizados de las relaciones
        const formaActual = formasFarmaceuticas.find(
          f => f.id === selectedProducto.id_forma_farmaceutica
        )?.nombre || 'N/A';
        
        const condicionActual = condicionesAlmacenamiento.find(
          c => c.id === selectedProducto.id_condicion
        )?.nombre || 'N/A';
  
        // Crear el producto actualizado con las relaciones mapeadas
        const productoActualizado = {
          ...selectedProducto,
          formafarmaceutica: formaActual,
          condicion: condicionActual
        };
  
        // Actualizar el estado
        const updatedProductos = productos.map((prod) =>
          prod.id === selectedProducto.id ? productoActualizado : prod
        );
  
        setProductos(updatedProductos);
        setFilteredProductos(
          updatedProductos.filter((producto) =>
            producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            producto.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
            producto.concentracion.toLowerCase().includes(searchTerm.toLowerCase()) ||
            producto.formafarmaceutica?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        handleCloseEditDialog();
      } catch (err) {
        console.error("Error updating product", err);
      }
    }
  };

  // Funciones para el diálogo de eliminación
  const handleClickOpenDelete = (id: number) => {
    setSelectedProductId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedProductId(null);
    setDeleteError(null);
  };

  const handleDelete = async () => {
    if (selectedProductId !== null) {
      try {
        await api.delete(`/productos/${selectedProductId}`);
        setDeleteSuccess("Producto eliminado exitosamente");
        setDeleteError(null);
        setOpenDeleteDialog(false);
        const updatedProductos = productos.filter((producto) => producto.id !== selectedProductId);
        setProductos(updatedProductos);
        setFilteredProductos(updatedProductos);
      } catch (err) {
        setDeleteError("Error al eliminar el producto. Verifique que no tenga registros asociados.");
      }
    }
  };

  // Definición de las columnas del DataGrid
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      headerAlign: "center",
      align: "center",
      cellClassName: "text-center",
    },
    {
      field: "foto",
      headerName: "Foto",
      width: 120,
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex justify-center items-center w-full h-full">
          {params.row.foto ? (
            <img
              src={params.row.foto}
              alt="Producto"
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <span className="text-gray-400">Sin imagen</span>
          )}
        </div>
      ),
    },
    {
      field: "nombre",
      headerName: "Nombre del Producto",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <div className="flex flex-wrap items-center justify-center h-full text-center whitespace-normal leading-relaxed p-2">
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "formula",
      headerName: "Fórmula del Compuesto",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <div className="flex flex-wrap items-center justify-center h-full text-center whitespace-normal leading-relaxed p-2">
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "concentracion",
      headerName: "Concentración del Producto",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <div className="flex flex-wrap items-center justify-center h-full text-center whitespace-normal leading-relaxed p-2">
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "formafarmaceutica",
      headerName: "Forma Farmacéutica",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <div className="flex flex-wrap items-center justify-center h-full text-center whitespace-normal leading-relaxed p-2">
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "condicion",
      headerName: "Condiciones de Almacenamiento",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <div className="flex flex-wrap items-center justify-center h-full text-center whitespace-normal leading-relaxed p-2">
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "edit",
      headerName: "Editar",
      width: 120,
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex justify-center items-center w-full h-full">
          <Button
            variant="contained"
            size="small"
            startIcon={<FaEdit />}
            className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-lg"
            onClick={() => handleEdit(params.row.id)}
          >
            Editar
          </Button>
        </div>
      ),
    },
    {
      field: "delete",
      headerName: "Eliminar",
      width: 120,
      headerAlign: "center",
      renderCell: (params) => {
        const isRelated = params.row.is_related;
        return (
          <div className="flex justify-center items-center w-full h-full">
            <Tooltip title={isRelated ? "No se puede eliminar porque tiene productos monitoreados asociados" : ""}>
              <span>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<FaTrashAlt />}
                  className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isRelated}
                  onClick={() => !isRelated && handleClickOpenDelete(params.row.id)}
                >
                  Eliminar
                </Button>
              </span>
            </Tooltip>
          </div>
        );
      }
    }
  ];

  return (
    <>
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <HeaderDashboard title="Gestión de Productos Farmacéuticos" />
          <main className="flex-1 overflow-y-auto">
            <div className="w-full p-8 2xl:px-12">
              <div className="max-w-9xl mx-auto">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 transition-all duration-300 ease-in-out">
                  <div className="px-8 py-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                          Consulta de Productos
                        </h1>
                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                          {filteredProductos.length} resultados encontrados
                        </p>
                      </div>
                      <div className="w-full md:w-96">
                        <TextField
                          fullWidth
                          variant="outlined"
                          label="Buscar producto"
                          size="small"
                          value={searchTerm}
                          onChange={handleSearch}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FaSearch className="text-gray-400" />
                              </InputAdornment>
                            ),
                            className:
                              "bg-white/80 backdrop-blur rounded-xl shadow-sm hover:shadow-md transition-all duration-300",
                            sx: {
                              borderRadius: "1rem",
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#3b82f6",
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#e2e8f0",
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8">
                    {loading ? (
                      <div className="flex justify-center items-center min-h-[500px]">
                        <div className="text-center">
                          <CircularProgress
                            size={80}
                            thickness={2.5}
                            className="text-blue-600"
                            sx={{ animationDuration: "800ms" }}
                          />
                          <p className="mt-4 text-gray-600 font-medium animate-pulse">Cargando productos...</p>
                        </div>
                      </div>
                    ) : error ? (
                      <Alert
                        severity="error"
                        className="rounded-xl border-l-4 border-red-600 bg-red-50 backdrop-blur-sm"
                        icon={<FaExclamationTriangle className="mt-1" />}
                      >
                        <Typography variant="body1" className="font-semibold text-red-800">
                          Error de carga
                        </Typography>
                        <Typography variant="body2" className="text-red-700">
                          {error}
                        </Typography>
                      </Alert>
                    ) : filteredProductos.length === 0 ? (
                      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4 text-gray-400">
                        <FaPills className="text-6xl" />
                        <span className="text-xl font-medium">No se encontraron productos</span>
                        <span className="text-sm">Intenta con otro término de búsqueda</span>
                      </div>
                    ) : (
                      <>
                        {/* Vista de Tarjetas - Móvil */}
                        <div className="md:hidden space-y-4">
                          {filteredProductos.map((producto) => (
                            <div
                              key={producto.id}
                              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
                            >
                              {/* Header de la tarjeta */}
                              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 flex items-center gap-3 border-b border-blue-100">
                                {producto.foto ? (
                                  <img
                                    src={producto.foto}
                                    alt={producto.nombre}
                                    className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-sm"
                                  />
                                ) : (
                                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center border-2 border-white shadow-sm">
                                    <FaPills className="text-2xl text-blue-600" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-gray-900 truncate">{producto.nombre}</h3>
                                  <p className="text-sm text-gray-600 truncate">{producto.formula}</p>
                                  <p className="text-xs text-gray-500 truncate">{producto.concentracion}</p>
                                </div>
                              </div>

                              {/* Contenido de la tarjeta */}
                              <div className="p-4 space-y-2 text-sm">
                                <div className="flex justify-between items-start">
                                  <span className="text-gray-500">Forma:</span>
                                  <span className="font-medium text-gray-900 text-right">{producto.formafarmaceutica}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                  <span className="text-gray-500">Condición:</span>
                                  <span className="font-medium text-gray-900 text-right">{producto.condicion}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                  <span className="text-gray-500">Concentración:</span>
                                  <span className="font-medium text-gray-900 text-right">{producto.concentracion}</span>
                                </div>

                                {/* Acciones */}
                                <div className="flex gap-2 pt-3 border-t border-gray-100">
                                  <button
                                    onClick={() => handleEdit(producto.id!)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md text-xs font-semibold"
                                  >
                                    <FaEdit className="text-xs" />
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handleClickOpenDelete(producto.id!)}
                                    disabled={producto.is_related}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all shadow-sm hover:shadow-md text-xs font-semibold ${
                                      producto.is_related
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                                    }`}
                                  >
                                    <FaTrashAlt className="text-xs" />
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Vista de Tabla - Desktop */}
                        <div className="hidden md:block border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                          <DataGrid
                            rows={filteredProductos}
                            columns={columns}
                            getRowId={(row) => row.id!}
                            autoHeight
                            rowHeight={80}
                            initialState={{
                              pagination: {
                                paginationModel: { page: 0, pageSize: 8 },
                              },
                            }}
                            pageSizeOptions={[8, 25, 50]}
                            slots={{
                              noRowsOverlay: () => (
                                <div className="flex flex-col justify-center items-center h-48 gap-2 text-gray-400">
                                  <FaPills className="text-4xl" />
                                  <span className="text-lg">No se encontraron productos</span>
                                </div>
                              ),
                            }}
                            sx={{
                              "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#f8fafc",
                                fontSize: "0.675rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                color: "#64748b",
                                borderBottom: "2px solid #e2e8f0",
                                minHeight: "80px",
                              },
                              "& .MuiDataGrid-columnHeaderTitle": {
                                whiteSpace: "normal",
                                lineHeight: "1.2",
                                textAlign: "center",
                              },
                              "& .MuiDataGrid-cell": {
                                borderRight: "1px solid #f1f5f9",
                                "&:focus": {
                                  outline: "none",
                                },
                              },
                              "& .MuiDataGrid-row": {
                                transition: "all 0.2s ease",
                                animation: "fadeInUp 0.3s ease-out",
                                "&:hover": {
                                  backgroundColor: "rgba(59, 130, 246, 0.04)",
                                  transform: "scale(1.01)",
                                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                },
                              },
                              "& .MuiDataGrid-virtualScroller": {
                                minHeight: "500px",
                                scrollbarWidth: "thin",
                                "&::-webkit-scrollbar": {
                                  width: "8px",
                                  height: "8px",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                  backgroundColor: "#cbd5e1",
                                  borderRadius: "4px",
                                },
                              },
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Dialog
            open={openDeleteDialog}
            onClose={handleCloseDelete}
            PaperProps={{
              className: "rounded-2xl max-w-md w-full mx-4 shadow-2xl",
            }}
          >
            <DialogTitle className="bg-blue-50 px-8 py-6 border-b border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaExclamationCircle className="text-red-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Confirmar eliminación</h2>
                  <p className="text-sm text-gray-500 mt-1">Esta acción no se puede deshacer</p>
                </div>
              </div>
            </DialogTitle>
            <DialogContent className="px-8 py-6">
              <DialogContentText className="text-gray-700 leading-relaxed">
                Estás a punto de eliminar permanentemente el producto con ID{" "}
                <span className="font-semibold text-red-600">{selectedProductId}</span>.
                ¿Deseas continuar con esta acción?
              </DialogContentText>
              <div className="mt-6 space-y-3">
                {deleteError && (
                  <Alert
                    severity="error"
                    className="rounded-lg border-l-4 border-red-600 bg-red-50"
                    icon={<FaExclamationCircle />}
                  >
                    <span className="text-red-800">{deleteError}</span>
                  </Alert>
                )}
                {deleteSuccess && (
                  <Alert
                    severity="success"
                    className="rounded-lg border-l-4 border-green-600 bg-green-50"
                    icon={<FaCheckCircle />}
                  >
                    <span className="text-green-800">{deleteSuccess}</span>
                  </Alert>
                )}
              </div>
            </DialogContent>
            <DialogActions className="px-8 py-5 bg-gray-50 border-t border-gray-100">
              <div className="flex w-full justify-between">
                <Button
                  onClick={handleCloseDelete}
                  variant="text"
                  className="text-gray-600 hover:bg-gray-100 px-5 py-2 rounded-lg"
                  startIcon={<FaTimes />}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="contained"
                  color="error"
                  className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white shadow-sm hover:shadow-md transition-all"
                  startIcon={<FaTrashAlt />}
                >
                  Confirmar Eliminación
                </Button>
              </div>
            </DialogActions>
          </Dialog>
          {selectedProducto && (
            <EditarProductoDialog
              open={openEditDialog}
              onClose={handleCloseEditDialog}
              producto={selectedProducto}
              formasFarmaceuticas={formasFarmaceuticas}
              condicionesAlmacenamiento={condicionesAlmacenamiento}
              handleProductoChange={(e) =>
                setSelectedProducto({
                  ...selectedProducto,
                  [e.target.name]: e.target.value,
                })
              }
              handleActualizar={handleActualizar}
            />
          )}
        </div>
      </div>
    </div>

    <style>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
    </>
  );
};

export default ConsultarProductos;
