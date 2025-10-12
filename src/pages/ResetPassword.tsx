import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Cambiar 'useHistory' por 'useNavigate'
import { FaLock } from 'react-icons/fa';
import { Alert, Button, TextField, Typography, InputAdornment } from '@mui/material';
import axios from 'axios';
import api from '../api';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Añadir estado para confirmar contraseña
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();  // Cambiar 'useHistory' a 'useNavigate'

  // Extraer el token de la URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  // Validar la existencia del token
  useEffect(() => {
    if (!token) {
      setError('El token es inválido o ha expirado.');
    }
  }, [token]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
  
    if (!newPassword || !confirmPassword) {
      setError('Por favor, ingresa ambas contraseñas.');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
  
    try {
      // Realizar la solicitud para restablecer la contraseña usando api.post
      const response = await api.post('/reset-password', {
        token, // Usamos el token de la URL
        new_password: newPassword, // Y la nueva contraseña
      });
  
      console.log(response); // Imprimir la respuesta
  
      // Verificar el estado de la respuesta
      if (response.status === 200 && response.data.message === 'Contraseña actualizada con éxito') {
        setSuccessMessage('Tu contraseña ha sido restablecida con éxito.');
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');  // Redirigir a la página de login
        }, 3000);
      } else {
        // Manejo de errores si no se cumple la condición
        setError('Hubo un problema al restablecer la contraseña. Intenta de nuevo.');
      }
    } catch (error: any) {
      console.error(error); // Imprimir el error
      // Manejo de errores
      setError('Hubo un problema al restablecer la contraseña. Intenta de nuevo.');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg flex overflow-hidden">
        <div className="w-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-8 flex flex-col items-center justify-center rounded-l-lg">
          <h2 className="text-3xl font-bold mb-4">Restablecer Contraseña</h2>
          <p className="text-lg mb-6 text-center">
            Introduce tu nueva contraseña para restablecer tu acceso a la cuenta.
          </p>
          <FaLock className="text-6xl" />
        </div>

        <div className="w-1/2 p-8">
          <form onSubmit={handleResetPassword} className="space-y-4">
            <TextField
              label="Nueva Contraseña"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaLock />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirmar Contraseña"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaLock />
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Restablecer Contraseña
            </Button>
          </form>
          {error && (
            <Alert severity="error" style={{ marginTop: '20px' }}>
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" style={{ marginTop: '20px' }}>
              {successMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
