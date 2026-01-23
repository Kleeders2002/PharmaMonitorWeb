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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <HeaderDashboard title="Eliminar Usuario" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-2xl mx-auto w-full">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center animate-fade-in-up border border-white/50 hover:shadow-2xl transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center border-2 border-red-200 animate-pulse-slow">
                <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>

              <Typography variant="h4" component="h1" className="text-3xl font-bold mb-3 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Eliminar Usuario
              </Typography>

              <Typography variant="body1" component="p" className="mb-8 text-gray-600">
                Esta acción no se puede deshacer. Se eliminará permanentemente el usuario con ID <span className="font-semibold text-gray-800">{id}</span>
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  className="mb-6"
                  sx={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
                    border: '2px solid rgba(239, 68, 68, 0.2)',
                  }}
                >
                  {error}
                </Alert>
              )}

              {success && (
                <Alert
                  severity="success"
                  className="mb-6"
                  sx={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)',
                    border: '2px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  {success}
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  sx={{
                    px: 6,
                    py: 1.8,
                    borderRadius: '14px',
                    fontWeight: 600,
                    fontSize: '16px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Eliminar Usuario
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/consultar-usuarios')}
                  sx={{
                    px: 6,
                    py: 1.8,
                    borderRadius: '14px',
                    fontWeight: 600,
                    fontSize: '16px',
                    borderColor: '#d1d5db',
                    color: '#374151',
                    '&:hover': {
                      borderColor: '#9ca3af',
                      backgroundColor: 'rgba(0,0,0,0.04)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EliminarUsuario;
