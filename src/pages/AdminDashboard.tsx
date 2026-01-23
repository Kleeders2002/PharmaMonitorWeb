import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import HeaderDashboard from '../components/HeaderDashboard';
import DasboardHighlights from '../components/DashboardHighlights';
import GraficoMonitoreo from '../components/GraficoMonitoreo';
import AlertasActivas from '../components/AlertasActivas';
import UltimosProductos from '../components/UltimosProductos';
import ActividadReciente from '../components/ActividadReciente';
import InformacionSistema from '../components/InformacionSistema';

import api from '../api';

const AdminDashboard: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/check-auth', { withCredentials: true });
        if (response.data.authenticated) {
          setNombre(response.data.user.nombre);
          setTimeout(() => setIsLoading(false), 300);
        } else {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium animate-pulse">Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <HeaderDashboard title="Admin Dashboard" />

        <main className="flex-1 overflow-y-auto">
          <div className={`max-w-7xl mx-auto transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {/* Header Section with Animation */}
            <div className="mb-8 px-4 mt-8 animate-fade-in-down">
              <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8 overflow-hidden">
                {/* Animated background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/10 to-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mb-4 animate-fade-in">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-blue-700">Sistema Activo</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    Bienvenido de vuelta,{' '}
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-shift">
                      {nombre}
                    </span>
                  </h1>
                  <p className="text-lg text-gray-600 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    Visión general del sistema en tiempo real
                  </p>
                </div>
              </div>
            </div>

            {/* Metric Cards with Staggered Animation */}
            <div className="px-4 mb-8" style={{ animationDelay: '0.3s' }}>
              <DasboardHighlights />
            </div>

            {/* Main Content Grid with Staggered Animation */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4 pb-8">
              <div className="xl:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <GraficoMonitoreo />
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <AlertasActivas />
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <UltimosProductos />
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                <ActividadReciente />
              </div>
              <div className="xl:col-span-3 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                <InformacionSistema />
              </div>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          opacity: 0;
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-fade-in {
          opacity: 0;
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 5s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
