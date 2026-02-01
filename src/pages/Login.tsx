import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogIn, FiMail, FiLock, FiArrowLeft,  } from 'react-icons/fi';
import api from '../api';
import logo from '../components/logo.png';

// @ts-ignore
import { FiEye, FiEyeOff, FiShield, FiCheck} from 'react-icons/fi';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/check-auth', { withCredentials: true });
        if (response.data.authenticated) {
          const { rol } = response.data.user;
          navigate(rol === 1 ? '/AdminDashboard' : '/User');
        }
      } catch (error) {
        // Silently handle unauthenticated state
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post(
        '/login',
        { email, password },
        { withCredentials: true }
      );

      if (response.data.message === 'Login exitoso') {
        const { idrol } = response.data.user;
        navigate(idrol === 1 ? '/AdminDashboard' : '/User');
      }
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Credenciales incorrectas. Por favor verifique sus datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Por favor ingrese un correo electrónico válido');
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post('/forgot-password', { email });
      if (response.data.message === 'Correo enviado con éxito') {
        setError('✔️ Se ha enviado un correo con las instrucciones');
      }
    } catch (error: any) {
      setError('Error al procesar la solicitud. Intente nuevamente.');
    } finally {
      setIsLoading(false);
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

      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-white/20">
        {/* Image Section */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 hidden md:flex relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd">
                <path d="M36 18c3.314 0 6 2.686 6 6s-2.686 6-6 6-6-2.686-6-6 2.686-6 6-6z" stroke="#fff" strokeWidth="0.5" opacity="0.5"/>
              </g>
            </svg>
          </div>
          
          <div className="relative z-10 flex items-center justify-center p-12 w-full">
            <div className="text-center text-white space-y-8 max-w-md">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full"></div>
                <img 
                  src={logo} 
                  alt="PharmaMonitor" 
                  className="h-28 w-28 mx-auto relative z-10 drop-shadow-2xl transform hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl font-bold mb-4 tracking-tight">
                  PharmaMonitor
                </h1>
                <div className="h-1 w-24 bg-white/40 mx-auto rounded-full"></div>
                <p className="text-xl opacity-95 leading-relaxed font-light">
                  Sistema Integral de Monitoreo Farmacéutico
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <FiShield className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Seguro</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <FiCheck className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Confiable</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-8 md:p-12 lg:p-16 bg-white/50 backdrop-blur-sm">
          <div className="text-center mb-10">
            <div className="md:hidden mb-6">
              <img 
                src={logo} 
                alt="PharmaMonitor" 
                className="h-20 w-20 mx-auto drop-shadow-lg"
              />
            </div>
            
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">
              {showForgotPassword ? 'Recuperar Acceso' : 'Bienvenido'}
            </h2>
            <p className="text-gray-600 text-base">
              {showForgotPassword 
                ? 'Ingrese su correo para restablecer la contraseña'
                : 'Ingrese sus credenciales para continuar'}
            </p>
          </div>

          <form onSubmit={showForgotPassword ? handleForgotPassword : handleLogin} className="space-y-6">
            <div className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <FiMail className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                    emailFocused ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 
                             focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                             transition-all duration-200 bg-white/50 backdrop-blur-sm
                             hover:border-gray-300 text-gray-800 placeholder-gray-400"
                    placeholder="ejemplo@farmacia.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              {!showForgotPassword && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative group">
                    <FiLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                      passwordFocused ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-gray-200 
                               focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                               transition-all duration-200 bg-white/50 backdrop-blur-sm
                               hover:border-gray-300 text-gray-800 placeholder-gray-400"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 
                               text-gray-400 hover:text-blue-600 transition-colors duration-200
                               focus:outline-none focus:text-blue-600"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Error/Success Message */}
            {error && (
              <div className={`p-4 rounded-xl text-sm font-medium flex items-start gap-3 animate-fade-in ${
                error.includes('✔️') 
                  ? 'bg-green-50 text-green-700 border-2 border-green-200' 
                  : 'bg-red-50 text-red-700 border-2 border-red-200'
              }`}>
                <span className="text-lg">{error.includes('✔️') ? '✓' : '⚠'}</span>
                <span className="flex-1">{error.replace('✔️', '').trim()}</span>
              </div>
            )}

            <div className="flex flex-col gap-4 pt-2">
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold text-base
                         hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center
                         disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl
                         transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Procesando...</span>
                  </div>
                ) : (
                  <>
                    {showForgotPassword ? (
                      <span>Enviar Instrucciones</span>
                    ) : (
                      <>
                        <FiLogIn className="mr-2 w-5 h-5" />
                        Iniciar Sesión
                      </>
                    )}
                  </>
                )}
              </button>

              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(!showForgotPassword);
                  setError('');
                  setEmail('');
                  setPassword('');
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center justify-center gap-2
                         transition-colors duration-200 py-2 rounded-lg hover:bg-blue-50"
              >
                {showForgotPassword ? (
                  <>
                    <FiArrowLeft className="w-4 h-4" />
                    Volver al Login
                  </>
                ) : (
                  '¿Olvidaste tu contraseña?'
                )}
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

export default Login;