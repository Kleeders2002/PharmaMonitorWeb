// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../api';
// import Header from '../components/Header';

// const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await api.get('/check-auth', { withCredentials: true });
//         if (response.data.authenticated) {
//           const { rol } = response.data.user;
//           navigate(rol === 1 ? '/AdminDashboard' : '/UserDashboard');
//         }
//       } catch (error) {
//         console.log('Usuario no autenticado:', error);
//       }
//     };
//     checkAuth();
//   }, [navigate]);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     try {
//       const response = await api.post(
//         '/login',
//         { email, password },
//         { withCredentials: true }
//       );

//       // Mostrar la cookie en la consola
//       const cookies = document.cookie;
//       console.log('Cookies:', cookies);

//       if (response.data.message === 'Login exitoso') {
//         const { idrol } = response.data.user;
//         navigate(idrol === 1 ? '/AdminDashboard' : '/UserDashboard');
//       } else {
//         setError('Usuario no encontrado o contraseña incorrecta');
//       }
//     } catch (error: any) {
//       if (error.response && error.response.data && error.response.data.detail) {
//         setError(error.response.data.detail);
//       } else {
//         setError('Error en la solicitud. Por favor, intenta de nuevo.');
//       }
//     }
//   };

//   const handleForgotPassword = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     if (!email) {
//         setError('Por favor, ingresa una dirección de correo electrónico válida.');
//         return;
//     }
//     try {
//         const response = await api.post('/forgot-password', { email });
//         if (response.data.message === 'Correo enviado con éxito') {
//             setError('Correo enviado con éxito');
//         } else {
//             setError('Error al enviar el correo. Verifica tu dirección de correo electrónico.');
//         }
//     } catch (error: any) {
//         setError('Error en la solicitud. Por favor, intenta de nuevo.');
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="flex h-screen bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 items-center justify-center">
//         <div className="w-full max-w-7xl h-3/4 bg-white rounded-lg shadow-lg flex overflow-hidden">
//           <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://i.postimg.cc/GpyxPyLY/pexels-kindelmedia-8325952.jpg')" }}>
//             <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
//               <div className="text-center text-white">
//                 <h1 className="text-4xl font-bold">PharmaMonitor</h1>
//                 <p className="mt-4">Monitoreo preciso y en tiempo real: Innovación en control ambiental para productos farmacéuticos</p>
//               </div>
//             </div>
//           </div>
//           <div className="w-1/2 flex items-center justify-center p-8">
//             <div className="w-full max-w-md">
//               {!showForgotPassword ? (
//                 <>
//                   <h2 className="text-3xl font-bold text-center mb-6">Bienvenido</h2>
//                   <form onSubmit={handleLogin} className="space-y-6">
//                     <div>
//                       <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//                         Correo Electrónico
//                       </label>
//                       <input
//                         id="email"
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//                         Contraseña
//                       </label>
//                       <input
//                         id="password"
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
//                         required
//                       />
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <button
//                         type="submit"
//                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                       >
//                         INICIAR SESIÓN
//                       </button>
//                       <a
//                         href="#"
//                         onClick={() => setShowForgotPassword(true)}
//                         className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
//                       >
//                         ¿Olvidaste tu contraseña?
//                       </a>
//                     </div>
//                   </form>
//                 </>
//               ) : (
//                 <>
//                   <h2 className="text-3xl font-bold text-center mb-6">Recupera tu Contraseña</h2>
//                   <form onSubmit={handleForgotPassword} className="space-y-6">
//                     <div>
//                       <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="forgotEmail">
//                         Correo Electrónico
//                       </label>
//                       <input
//                         id="forgotEmail"
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         required
//                       />
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <button
//                         type="submit"
//                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                       >
//                         ENVIAR
//                       </button>
//                       <a
//                         href="#"
//                         onClick={() => setShowForgotPassword(false)}
//                         className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
//                       >
//                         Volver
//                       </a>
//                     </div>
//                   </form>
//                 </>
//               )}
//               {error && (
//                 <div className="mt-4 text-red-500 text-center">
//                   {error}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;






import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogIn, FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import api from '../api';
import logo from '../components/logo.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/check-auth', { withCredentials: true });
        if (response.data.authenticated) {
          const { rol } = response.data.user;
          navigate(rol === 1 ? '/AdminDashboard' : '/UserDashboard');
        }
      } catch (error) {
        console.log('Usuario no autenticado:', error);
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
        navigate(idrol === 1 ? '/AdminDashboard' : '/UserDashboard');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-cyan-500 hidden md:block relative">
          <div className="absolute inset-0 bg-opacity-90 flex items-center justify-center p-8">
            <div className="text-center text-white space-y-6">
              <img 
                src={logo} 
                alt="PharmaMonitor" 
                className="h-24 w-24 mx-auto mb-6 animate-fade-in"
              />
              <h1 className="text-4xl font-bold mb-4">PharmaMonitor</h1>
              <p className="text-lg opacity-90 leading-relaxed">
                Sistema Integral de Monitoreo Farmacéutico
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-8 md:p-12 lg:p-16">
          <div className="text-center mb-8">
            <div className="md:hidden mb-6">
              <img 
                src={logo} 
                alt="PharmaMonitor" 
                className="h-16 w-16 mx-auto"
              />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {showForgotPassword ? 'Recuperar Acceso' : 'Bienvenido'}
            </h2>
            <p className="text-gray-500">
              {showForgotPassword 
                ? 'Ingrese su correo para restablecer la contraseña'
                : 'Ingrese sus credenciales para continuar'}
            </p>
          </div>

          <form onSubmit={showForgotPassword ? handleForgotPassword : handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="ejemplo@farmacia.com"
                    required
                  />
                </div>
              </div>

              {!showForgotPassword && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className={`p-3 rounded-lg text-sm ${
                error.includes('✔️') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 px-6 rounded-lg font-semibold 
                         hover:from-blue-700 hover:to-cyan-600 transition-all flex items-center justify-center
                         disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    {showForgotPassword ? (
                      'Enviar Instrucciones'
                    ) : (
                      <>
                        <FiLogIn className="mr-2" />
                        Iniciar Sesión
                      </>
                    )}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(!showForgotPassword);
                  setError('');
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center gap-1"
              >
                {showForgotPassword ? (
                  <>
                    <FiArrowLeft className="inline-block" />
                    Volver al Login
                  </>
                ) : (
                  '¿Olvidaste tu contraseña?'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;