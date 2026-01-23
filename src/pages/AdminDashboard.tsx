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
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/check-auth', { withCredentials: true });
        if (response.data.authenticated) {
          setNombre(response.data.user.nombre);
        } else {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="flex h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <HeaderDashboard title="Admin Dashboard" />
          
          <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8 px-4 mt-8">  {/* Aquí agregamos mt-8 */}
              <div className="border-b border-gray-200 pb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  Bienvenido, <span className="bg-gradient-to-r from-blue-600 to-purple-800 bg-clip-text text-transparent">{nombre}</span>
                </h1>
                <p className="mt-3 text-lg text-gray-500">Visión general del sistema en tiempo real</p>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="px-4 mb-8">
              <DasboardHighlights />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4">
              <div className="xl:col-span-2">
                <GraficoMonitoreo />
              </div>
              <AlertasActivas />
              <UltimosProductos />
              <ActividadReciente />
              <div className="xl:col-span-3">
                <InformacionSistema />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 