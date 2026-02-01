import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { FaMobileAlt, FaQrcode, FaApple, FaAndroid, FaTimes } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import HeaderDashboard from '../components/HeaderDashboard';

const User: React.FC = () => {
  const [openModal, setOpenModal] = useState(true);

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <div className="flex h-screen">
          <Sidebar />

          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <HeaderDashboard title="Panel de Usuario" />

            <main className="flex-1 overflow-y-auto">
              <div className="h-full p-8 2xl:px-12">
                <div className="max-w-9xl mx-auto">
                  {/* Panel Principal */}
                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-12 text-center">
                    <div className="max-w-3xl mx-auto space-y-8">
                      {/* Icono con animación */}
                      <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full animate-pulse">
                        <FaMobileAlt className="text-6xl text-blue-600" />
                      </div>

                      {/* Título principal */}
                      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                        Bienvenido a PharmaMonitor
                      </h1>

                      {/* Mensaje informativo */}
                      <div className="space-y-4">
                        <p className="text-xl text-gray-700 font-medium">
                          Para interactuar plenamente con el sistema
                        </p>
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200">
                          <div className="flex items-center justify-center gap-4 mb-4">
                            <FaQrcode className="text-4xl text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-900">
                              Descarga la Aplicación Móvil
                            </h2>
                          </div>
                          <p className="text-gray-700 text-lg">
                            Escanea el código QR o descarga la aplicación para acceder a todas las funcionalidades:
                          </p>
                          <ul className="text-left text-gray-600 mt-6 space-y-3 max-w-md mx-auto">
                            <li className="flex items-start gap-3">
                              <span className="text-blue-600 text-xl">✓</span>
                              <span>Monitoreo de productos farmacéuticos en tiempo real</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-blue-600 text-xl">✓</span>
                              <span>Alertas instantáneas sobre condiciones críticas</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-blue-600 text-xl">✓</span>
                              <span>Gestión de inventario desde cualquier lugar</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-blue-600 text-xl">✓</span>
                              <span>Registro de métricas y datos de monitoreo</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Botones de descarga */}
                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                          className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <FaApple className="text-3xl" />
                          <div className="text-left">
                            <div className="text-xs opacity-80">Descargar en</div>
                            <div className="text-lg font-semibold">App Store</div>
                          </div>
                        </button>
                        <button
                          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <FaAndroid className="text-3xl" />
                          <div className="text-left">
                            <div className="text-xs opacity-80">Disponible en</div>
                            <div className="text-lg font-semibold">Google Play</div>
                          </div>
                        </button>
                      </div>

                      {/* Información adicional */}
                      <p className="text-sm text-gray-500 mt-8">
                        Si ya tienes la aplicación instalada, puedes cerrar este mensaje y usar la versión web con funciones limitadas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Modal informativo */}
      <Dialog
        open={openModal}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: "rounded-2xl shadow-2xl border-2 border-blue-200",
        }}
      >
        <DialogTitle className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FaMobileAlt className="text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Aplicación Móvil Requerida</h2>
                <p className="text-blue-100 text-sm mt-1">Experiencia completa en tu dispositivo</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>
        </DialogTitle>

        <DialogContent className="px-8 py-6">
          <div className="space-y-4">
            <p className="text-gray-700 text-lg">
              Para interactuar plenamente con <strong>PharmaMonitor</strong>, te recomendamos descargar nuestra aplicación móvil.
            </p>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-gray-700">
                La versión móvil te permite acceder a funcionalidades completas como:
              </p>
              <ul className="mt-3 space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  Monitoreo en tiempo real
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  Alertas push instantáneas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  Escaneo de códigos QR
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  Registro offline
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all">
                <FaApple className="text-xl" />
                <span className="font-semibold">App Store</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all">
                <FaAndroid className="text-xl" />
                <span className="font-semibold">Google Play</span>
              </button>
            </div>
          </div>
        </DialogContent>

        <DialogActions className="px-8 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <Button
            onClick={handleClose}
            className="text-gray-700 hover:text-blue-600 font-semibold"
          >
            Entendido, continuar en versión web
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default User;