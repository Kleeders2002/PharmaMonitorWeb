import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Button, Typography } from '@mui/material';
import api from '../api';
import Sidebar from '../components/Sidebar';
import HeaderDashboard from '../components/HeaderDashboard';

const EliminarUsuario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleDelete = async () => {
    try {
      await api.delete(`/usuarios/${id}`);
      setSuccess('Usuario eliminado exitosamente');
      setError(null);
      // Redirigir después de un corto tiempo
      setTimeout(() => navigate('/consultar-usuarios'), 2000);
    } catch (err) {
      setError('Error al eliminar el usuario');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <HeaderDashboard title="Eliminar Usuario" />
        <main className="flex-1 p-6">
          <div className="max-w-6xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <Typography variant="h4" component="h1" className="text-3xl font-bold mb-6 text-blue-500">
              Eliminar Usuario
            </Typography>
            {error && <Alert severity="error" className="mb-4">{error}</Alert>}
            {success && <Alert severity="success" className="mb-4">{success}</Alert>}
            <Typography variant="h6" component="p" className="mb-4">
              ¿Estás seguro de que deseas eliminar el usuario con ID {id}?
            </Typography>
            <Button variant="contained" color="error" onClick={handleDelete} className="mr-2">
              Eliminar
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate('/consultar-usuarios')}>
              Cancelar
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EliminarUsuario;
