import React, { useState, useEffect } from 'react';
import { FiUsers, FiThermometer, FiAlertCircle, FiActivity } from 'react-icons/fi';
import api from '../api';

interface MetricsData {
  usuarios_registrados: number;
  productos_inventario: number;
  alertas_activas: number;
  monitoreos_activos: number;
}

const DashsboardHighlights: React.FC = () => {
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get<MetricsData>('/dashboard/metrics');
        setMetricsData(response.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, []);

  const metricsConfig = [
    {
      key: 'usuarios_registrados',
      icon: <FiUsers className="w-6 h-6 text-blue-600" />,
      title: 'Usuarios registrados',
      colorClass: 'bg-blue-100',
      accentColor: 'text-blue-600'
    },
    {
      key: 'productos_inventario',
      icon: <FiThermometer className="w-6 h-6 text-emerald-600" />,
      title: 'Productos en inventario',
      colorClass: 'bg-emerald-100',
      accentColor: 'text-emerald-600'
    },
    {
      key: 'alertas_activas',
      icon: <FiAlertCircle className="w-6 h-6 text-amber-600" />,
      title: 'Alertas activas',
      colorClass: 'bg-amber-100',
      accentColor: 'text-amber-600'
    },
    {
      key: 'monitoreos_activos',
      icon: <FiActivity className="w-6 h-6 text-indigo-600" />,
      title: 'Monitoreos activos',
      colorClass: 'bg-indigo-100',
      accentColor: 'text-indigo-600'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricsConfig.map((metric, index) => (
          <div
            key={index}
            role="status"
            className="h-32 animate-pulse rounded-xl bg-white p-5 shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className={`h-12 w-12 rounded-lg ${metric.colorClass}`}></div>
              <div className="flex-1">
                <div className="mb-2 h-4 w-32 rounded bg-gray-200"></div>
                <div className="h-8 w-20 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metricsConfig.map((metric, index) => (
        <article
          key={index}
          className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
        >
          <div className="flex items-start space-x-4">
            <figure className={`flex h-12 w-12 items-center justify-center rounded-lg ${metric.colorClass}`}>
              {React.cloneElement(metric.icon, { className: `w-6 h-6 ${metric.accentColor}` })}
            </figure>
            
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {metricsData?.[metric.key as keyof MetricsData]?.toLocaleString() ?? '--'}
              </p>
            </div>
          </div>
          
          <div className={`absolute bottom-0 left-0 h-1 w-full ${metric.accentColor} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}></div>
        </article>
      ))}
    </div>
  );
};

export default DashsboardHighlights;