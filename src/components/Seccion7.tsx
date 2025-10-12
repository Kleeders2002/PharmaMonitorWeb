import React, { useState, useEffect } from 'react';
import { FaSyringe, FaBell, FaChartLine, FaUserMd } from 'react-icons/fa';

const Seccion7 = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const metrics = [
    {
      icon: <FaSyringe className="w-8 h-8 text-blue-600" />,
      title: "Productos Monitoreados",
      value: "1,240",
      trend: "+12% este mes"
    },
    {
      icon: <FaBell className="w-8 h-8 text-green-600" />,
      title: "Alertas Resueltas",
      value: "92%",
      trend: "Eficiencia del sistema"
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-purple-600" />,
      title: "Tiempo Activo",
      value: "99.9%",
      trend: "Disponibilidad anual"
    },
    {
      icon: <FaUserMd className="w-8 h-8 text-orange-600" />,
      title: "Usuarios Activos",
      value: "458",
      trend: "+24 nuevos este mes"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % metrics.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FaChartLine className="text-blue-600" />
          Métricas en Tiempo Real
        </h2>
        <p className="text-gray-500 text-sm mt-1">Datos actualizados cada 10 segundos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative min-h-[300px]">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg border transition-all duration-500 ${
              index === activeIndex
                ? 'opacity-100 scale-100 bg-blue-50 border-blue-200'
                : 'opacity-0 scale-95 absolute inset-0'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-full shadow-sm">
                {metric.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {metric.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {metric.value}
                </p>
                <span className="text-sm text-gray-500 mt-2 block">
                  {metric.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {metrics.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === activeIndex ? 'w-8 bg-blue-600' : 'w-4 bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Seccion7;