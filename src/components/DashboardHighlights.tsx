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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      icon: <FiUsers className="w-6 h-6" />,
      title: 'Usuarios registrados',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      key: 'productos_inventario',
      icon: <FiThermometer className="w-6 h-6" />,
      title: 'Productos en inventario',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      iconBg: 'bg-emerald-500',
      textColor: 'text-emerald-600'
    },
    {
      key: 'alertas_activas',
      icon: <FiAlertCircle className="w-6 h-6" />,
      title: 'Alertas activas',
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
      iconBg: 'bg-amber-500',
      textColor: 'text-amber-600'
    },
    {
      key: 'monitoreos_activos',
      icon: <FiActivity className="w-6 h-6" />,
      title: 'Monitoreos activos',
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      iconBg: 'bg-indigo-500',
      textColor: 'text-indigo-600'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricsConfig.map((metric, index) => (
          <div
            key={index}
            role="status"
            className="h-40 animate-pulse rounded-2xl bg-white/80 backdrop-blur p-6 shadow-lg border border-white/20"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center space-x-4">
              <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${metric.gradient} opacity-50`}></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 w-32 rounded bg-gray-200"></div>
                <div className="h-8 w-24 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metricsConfig.map((metric, index) => {
        const value = metricsData?.[metric.key as keyof MetricsData] ?? 0;
        return (
          <article
            key={index}
            className={`group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-lg p-6 shadow-lg border border-white/20
                      transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-1
                      ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{
              transitionDelay: `${index * 0.1}s`,
              animation: 'fade-in-up 0.6s ease-out forwards'
            }}
          >
            {/* Animated gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.bgGradient} opacity-0
                          group-hover:opacity-100 transition-opacity duration-500`}></div>

            {/* Animated border line */}
            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${metric.gradient}
                          transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>

            <div className="relative">
              <div className="flex items-start mb-4">
                <figure className={`flex h-14 w-14 items-center justify-center rounded-xl
                                 bg-gradient-to-br ${metric.gradient} shadow-lg
                                 transform group-hover:scale-110 transition-transform duration-300
                                 group-hover:rotate-3`}>
                  <span className="text-white">
                    {React.cloneElement(metric.icon, { className: 'w-6 h-6' })}
                  </span>
                </figure>
              </div>

              <div className="space-y-1">
                <h3 className={`text-sm font-semibold ${metric.textColor} transition-colors duration-300`}>
                  {metric.title}
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300 origin-left">
                    {value.toLocaleString()}
                  </p>
                  <span className="text-xs text-gray-500">total</span>
                </div>
              </div>

              {/* Shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shine
                            bg-gradient-to-r from-transparent via-white/20 to-transparent
                            skew-x-12"></div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default DashsboardHighlights;
