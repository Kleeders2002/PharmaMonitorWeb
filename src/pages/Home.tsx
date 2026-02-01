import React from 'react';
import { FiBox, FiThermometer, FiDroplet, FiSun, FiAlertCircle, FiUsers, FiFileText, FiClipboard } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-12 lg:gap-16">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 xl:pr-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 md:mb-8 leading-tight animate-fade-in-up opacity-0 [animation-delay:200ms]">
                Monitoreo Inteligente<br/>
                <span className="text-blue-600 animate-[color-shift_8s_infinite_alternate] bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  para Almacenes Farmacéuticos
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600 mb-8 md:mb-10 leading-relaxed animate-fade-in-up opacity-0 [animation-delay:400ms]">
                Solución integral para la supervisión en tiempo real de condiciones críticas 
                en almacenamiento de productos médicos mediante tecnología IoT.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up opacity-0 [animation-delay:600ms]">
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 hover:-translate-y-1"
                >
                  <FiClipboard className="mr-3 text-xl" />
                  Comenzar
                </button>
              </div>
            </div>

            {/* Image Section */}
            <div className="w-full lg:w-1/2 relative">
            <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-0 bg-blue-50 rounded-2xl transform rotate-2 -translate-y-4" />
                <img 
                className="relative w-full h-auto rounded-2xl shadow-xl transform hover:scale-[1.02] transition-transform duration-300"
                src="https://st4.depositphotos.com/13193658/24776/i/450/depositphotos_247763998-stock-photo-attractive-businesswoman-sitting-table-laptop.jpg" 
                alt="Almacenamiento Farmacéutico"
                loading="lazy"
                />
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 animate-fade-in-up opacity-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades Clave del Sistema
            </h2>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-1 w-24 mx-auto rounded-full animate-[line-expand_1s_ease-out_forwards]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: <FiThermometer className="text-4xl text-blue-600" />,
                title: "Monitoreo de Temperatura",
                text: "Registro continuo y alertas por desviaciones en el rango permitido"
              },
              { 
                icon: <FiDroplet className="text-4xl text-blue-600" />,
                title: "Control de Humedad",
                text: "Seguimiento de niveles de humedad relativa en áreas de almacenamiento"
              },
              { 
                icon: <FiSun className="text-4xl text-blue-600 animate-[spin-slow_20s_linear_infinite]" />,
                title: "Sensores de Iluminación",
                text: "Protección contra exposición lumínica inadecuada"
              },
              { 
                icon: <FiBox className="text-4xl text-blue-600" />,
                title: "Gestión de Productos",
                text: "Registro detallado de medicamentos y sus condiciones requeridas"
              },
              { 
                icon: <FiAlertCircle className="text-4xl text-blue-600" />,
                title: "Sistema de Alertas",
                text: "Notificaciones inmediatas ante condiciones críticas"
              },
              { 
                icon: <FiUsers className="text-4xl text-blue-600" />,
                title: "Gestión de Usuarios",
                text: "Control de acceso y roles para personal autorizado"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2 group"
              >
                <div className="mb-6 relative">
                  {feature.icon}
                  <div className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Thesis Value Section */}
      <section className="py-16 md:py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12 animate-fade-in-up opacity-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Contribución Científica
            </h2>
            <div className="h-1 w-24 mx-auto bg-blue-200 rounded-full animate-[line-expand_1s_ease-out_forwards]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm border border-blue-200/20 hover:border-blue-300/40 transition-all duration-300 hover:-translate-y-2">
              <h3 className="text-2xl font-semibold mb-4 animate-[fade-in-left_1s_ease-out_forwards]">Innovación Tecnológica</h3>
              <p className="text-blue-50 leading-relaxed animate-[fade-in-up_1s_ease-out_forwards] [animation-delay:100ms]">
                Integración de sensores IoT de bajo costo con sistema de monitoreo en tiempo real 
                para PYMEs farmacéuticas
              </p>
            </div>
            <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm border border-blue-200/20 hover:border-blue-300/40 transition-all duration-300 hover:-translate-y-2">
              <h3 className="text-2xl font-semibold mb-4 animate-[fade-in-right_1s_ease-out_forwards]">Validación Experimental</h3>
              <p className="text-blue-50 leading-relaxed animate-[fade-in-up_1s_ease-out_forwards] [animation-delay:100ms]">
                Pruebas realizadas con medicamentos reales en diferentes condiciones controladas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center animate-fade-in-up opacity-0">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Documentación Técnica
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Accede a la documentación completa del sistema y los protocolos de investigación
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://drive.google.com/drive/folders/1hQldWUMb2Tefj_c4l4_UUkhAux_GDJbi?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 hover:scale-105"
              >
                <FiFileText className="mr-3 text-xl" />
                Ver Documentación
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Académico */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="mb-8 animate-fade-in-up opacity-0 [animation-delay:200ms]">
              <h3 className="text-white text-lg font-semibold mb-4">Trabajo de Grado</h3>
              <p className="text-sm leading-relaxed">
                Sistema de Monitoreo Inteligente para Almacenamiento de Productos Farmacéuticos
              </p>
              <div className="mt-6">
                <h4 className="text-white mb-2">Información del Autor</h4>
                <ul className="space-y-1">
                  <li><span className="text-sm">Estudiante: Kleeders Ortiz</span></li>
                  <li><span className="text-sm">Cédula: V-29553306</span></li>
                </ul>
              </div>
            </div>
            <div className="animate-fade-in-up opacity-0 [animation-delay:400ms]">
              <h4 className="text-white mb-4">Universidad Católica Andrés Bello (UCAB)</h4>
              <ul className="space-y-2">
                <li><span className="text-sm">Escuela de Ingeniería Informática</span></li>
                <li><span className="text-sm">Trabajo de Grado 2025</span></li>
                <li><span className="text-sm">Tutor: Manuel Peña</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm animate-fade-in-up opacity-0 [animation-delay:600ms]">
            © 2025 PharmaMonitor - Trabajo de Investigación Académica
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;