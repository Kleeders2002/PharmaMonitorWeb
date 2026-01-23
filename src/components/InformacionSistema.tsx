import { FaFlask } from 'react-icons/fa';

const InformacionSistema = () => {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 h-full border border-white/50 flex flex-col hover:shadow-xl transition-all duration-300 animate-fade-in-up">
      {/* Encabezado */}
      <div className="text-center mb-8 flex-1">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg mb-4 animate-pulse-slow">
          <FaFlask className="text-white text-3xl" />
        </div>
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
          PharmaMonitor
        </h2>
        <p className="text-gray-600 font-medium">Sistema de Monitoreo Farmacéutico Inteligente</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-500 font-medium">Sistema Activo</span>
        </div>
      </div>
    </div>
  );
};

export default InformacionSistema;