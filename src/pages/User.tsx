import React from 'react';

const User: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-6 shadow-lg animate-bounce">
              <span className="text-5xl text-white">📱</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-6">
              Descarga PharmaMonitor Móvil
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Para interactuar plenamente con el sistema, escanea el código QR y descarga nuestra aplicación móvil
            </p>
          </div>

          {/* Main Content - Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* QR Code Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8 lg:p-12 animate-fade-in-up">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Escanea el Código QR</h2>

                {/* QR Code Placeholder */}
                <div className="bg-white rounded-2xl p-8 shadow-inner border-4 border-gray-200 inline-block mb-6">
                  <div className="w-64 h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📷</div>
                      <p className="text-gray-700 font-medium text-lg">Código QR de la App</p>
                      <p className="text-sm text-gray-500 mt-2">Reemplazar con imagen real</p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 text-base leading-relaxed">
                  Usa la cámara de tu celular para escanear este código y ser redirigido directamente a la tienda de aplicaciones
                </p>

                {/* Instructions */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3">Instrucciones:</h3>
                  <ol className="text-left text-sm text-gray-700 space-y-3">
                    <li className="flex gap-3 items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <span className="font-medium">Abre la app de cámara de tu celular</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <span className="font-medium">Apunta al código QR</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <span className="font-medium">Toca el enlace que aparece para descargar</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8 lg:p-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Funcionalidades de la App Móvil</h2>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-2xl text-white">📊</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">Monitoreo en Tiempo Real</h3>
                      <p className="text-gray-600 text-base">Visualiza datos de temperatura, humedad y más parámetros al instante</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-2xl text-white">🔔</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">Alertas Instantáneas</h3>
                      <p className="text-gray-600 text-base">Recibe notificaciones push cuando algo requiera tu atención inmediata</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-2xl text-white">📱</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">Escaneo de Productos</h3>
                      <p className="text-gray-600 text-base">Escanea códigos QR para ver información detallada de productos farmacéuticos</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-2xl text-white">📴</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">Registro Offline</h3>
                      <p className="text-gray-600 text-base">Guarda datos sin conexión y sincroniza cuando tengas internet</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Descarga Directa</h2>

                <div className="space-y-4">
                  <button className="w-full flex items-center justify-center gap-4 px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <span className="text-4xl">🍎</span>
                    <div className="text-left">
                      <div className="text-sm opacity-90">Descargar en</div>
                      <div className="text-2xl font-bold">App Store</div>
                    </div>
                  </button>

                  <button className="w-full flex items-center justify-center gap-4 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <span className="text-4xl">🤖</span>
                    <div className="text-left">
                      <div className="text-sm opacity-90">Disponible en</div>
                      <div className="text-2xl font-bold">Google Play</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white text-center animate-fade-in-up shadow-2xl" style={{ animationDelay: '0.3s' }}>
            <p className="text-xl font-bold mb-2">
              💡 ¿Ya tienes la aplicación instalada?
            </p>
            <p className="text-blue-50 text-base">
              Inicia sesión en la app móvil con tus credenciales para acceder a todas las funcionalidades
            </p>
          </div>
        </div>
      </main>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default User;
