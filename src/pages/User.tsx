import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const User: React.FC = () => {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      {/* Botón cerrar sesión - Top Right */}
      <button
        onClick={() => setShowLogout(true)}
        className="absolute top-6 right-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white border border-gray-200 hover:border-gray-300 group"
      >
        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
          Cerrar Sesión
        </span>
      </button>

      {/* Main Card */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-12">
            {/* Icono */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full mb-8 shadow-xl">
              <span className="text-4xl text-white">📱</span>
            </div>

            {/* Título */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Aplicación Móvil Requerida
            </h1>

            {/* Subtítulo */}
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Para acceder a todas las funcionalidades de PharmaMonitor, descarga nuestra aplicación móvil oficial
            </p>
          </div>

          {/* Divider */}
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto mb-12 rounded-full"></div>

          {/* QR Code Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Escanea para Descargar</h2>

            {/* QR Code */}
            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 inline-block mb-6">
              <div className="w-72 h-72 flex flex-col items-center justify-center bg-white rounded-xl shadow-inner">
                <div className="text-center">
                  <div className="text-6xl mb-3">📷</div>
                  <p className="text-gray-700 font-semibold text-lg mb-2">Código QR</p>
                  <p className="text-sm text-gray-500">Escanea con tu cámara celular</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 text-left max-w-lg mx-auto">
              <h3 className="font-semibold text-gray-900 mb-4">Instrucciones:</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <span>Abre la cámara de tu celular</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <span>Escanea este código QR</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <span>Descarga e instala la aplicación</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Monitoreo 24/7</h3>
              <p className="text-gray-700 text-sm">Visualiza datos en tiempo real</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl mb-3">🔔</div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Alertas Push</h3>
              <p className="text-gray-700 text-sm">Notificaciones instantáneas</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200 hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl mb-3">📷</div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Escaneo QR</h3>
              <p className="text-gray-700 text-sm">Identifica productos rápidamente</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl mb-3">📴</div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Modo Offline</h3>
              <p className="text-gray-700 text-sm">Funciona sin internet</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white text-center shadow-xl">
            <p className="font-semibold text-lg mb-1">
              💡 Importante
            </p>
            <p className="text-blue-50 text-sm">
              La aplicación móvil es necesaria para un uso completo del sistema
            </p>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚪</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Cerrar Sesión
              </h2>
              <p className="text-gray-600">
                ¿Estás seguro de que deseas cerrar tu sesión?
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowLogout(false)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-md hover:shadow-lg"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default User;
