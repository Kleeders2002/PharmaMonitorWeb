import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiLock, FiArrowLeft } from 'react-icons/fi';
import { Alert, Button, TextField, InputAdornment, CircularProgress } from '@mui/material';
import api from '../api';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Extraer el token de la URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Validar la existencia del token
  useEffect(() => {
    if (!token) {
      setError('El enlace de restablecimiento es inválido o ha expirado.');
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

    setIsSubmitting(true);

    try {
      const response = await api.post('/reset-password', {
        token,
        new_password: newPassword,
      });

      if (response.status === 200 && response.data.message === 'Contraseña actualizada con éxito') {
        setSuccessMessage('¡Tu contraseña ha sido restablecida con éxito!');

        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError('Hubo un problema al restablecer la contraseña. Intenta de nuevo.');
      }
    } catch (error: any) {
      setError('Hubo un problema al restablecer la contraseña. El enlace puede haber expirado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-white/20 animate-fade-in">
        {/* Image Section */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 hidden md:flex relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTYgMi42ODYtNiA2em0wIDBoMnY4aDEiIHN0cm9rZT0iI2ZmZiIiBzdHJva2Utd2lkdGg9Ii41IiBvcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

          <div className="relative z-10 flex items-center justify-center p-12 w-full">
            <div className="text-center text-white space-y-8 max-w-md">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full"></div>
                <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-full p-8 inline-block">
                  <FiLock className="w-24 h-24 mx-auto" />
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl font-bold mb-4 tracking-tight">
                  Restablecer
                </h1>
                <div className="h-1 w-24 bg-white/40 mx-auto rounded-full"></div>
                <p className="text-xl opacity-95 leading-relaxed font-light">
                  Contraseña
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-sm font-medium">Seguro</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-sm font-medium">Rápido</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-8 md:p-12 lg:p-16 bg-white/50 backdrop-blur-sm">
          <div className="text-center mb-10">
            <div className="md:hidden mb-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-blue-100 blur-2xl rounded-full"></div>
                <div className="relative z-10 bg-blue-50 rounded-full p-4 inline-block">
                  <FiLock className="w-12 h-12 text-blue-600" />
                </div>
              </div>
            </div>

            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">
              Restablecer Contraseña
            </h2>
            <p className="text-gray-600 text-base">
              Ingresa tu nueva contraseña para continuar
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-5">
              {/* New Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nueva Contraseña
                </label>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-blue-600" />
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200
                             focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                             transition-all duration-200 bg-white/50 backdrop-blur-sm
                             hover:border-gray-300 text-gray-800 placeholder-gray-400"
                    placeholder="•••••••••"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-blue-600" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200
                             focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                             transition-all duration-200 bg-white/50 backdrop-blur-sm
                             hover:border-gray-300 text-gray-800 placeholder-gray-400"
                    placeholder="•••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Error/Success Message */}
            {(error || successMessage) && (
              <div className={`p-4 rounded-xl text-sm font-medium flex items-start gap-3 animate-fade-in ${
                successMessage
                  ? 'bg-green-50 text-green-700 border-2 border-green-200'
                  : 'bg-red-50 text-red-700 border-2 border-red-200'
              }`}>
                <span className="text-lg">{successMessage ? '✓' : '⚠'}</span>
                <span className="flex-1">{successMessage || error}</span>
              </div>
            )}

            <div className="flex flex-col gap-4 pt-2">
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold text-base
                         hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center
                         disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl
                         transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Procesando...</span>
                  </div>
                ) : (
                  'Restablecer Contraseña'
                )}
              </button>

              {/* Back to Login Button */}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center justify-center gap-2
                         transition-colors duration-200 py-2 rounded-lg hover:bg-blue-50"
              >
                <FiArrowLeft className="w-4 h-4" />
                Volver al Inicio de Sesión
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              © 2024 PharmaMonitor. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;
