import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import HeaderDashboard from '../components/HeaderDashboard';
import DasboardHighlights from '../components/DashboardHighlights';
import Seccion2 from '../components/Seccion2';
import Seccion3 from '../components/Seccion3';
import Seccion4 from '../components/Seccion4';
import Seccion5 from '../components/Seccion5';
import Seccion6 from '../components/Seccion6';

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
                <Seccion2 />
              </div>
              <Seccion3 />
              <Seccion4 />
              <Seccion5 />
              <div className="xl:col-span-3">
                <Seccion6 />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 