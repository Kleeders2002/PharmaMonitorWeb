import { FaFlask } from 'react-icons/fa';

const Seccion6 = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full border border-gray-100 flex flex-col">
      {/* Encabezado */}
      <div className="text-center mb-8 flex-1">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <FaFlask className="text-blue-600" />
          PharmaMonitor
        </h2>
        <p className="text-gray-600">Sistema de Monitoreo Farmacéutico Inteligente</p>
      </div>
    </div>
  );
};

export default Seccion6;