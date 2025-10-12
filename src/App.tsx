import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import User from './pages/User';
import Header from './components/Header';
import AdminDashboard from './pages/AdminDashboard';
import AgregarUsuario from './pages/AgregarUsuario'; 
import AgregarProducto from './pages/AgregarProducto'; 
import AgregarCondicionAmbiental from './pages/AgregarCondicionAmbiental'; 
import ConsultarUsuarios from './pages/ConsultarUsuarios';
import ConsultarCondiciones from './pages/ConsultarCondiciones';
import ConsultarProductos from './pages/ConsultarProductos';
import ConsultarMetricas from './pages/ConsultarMetricas';
import ConsultarRegistros from './pages/ConsultarRegistros';
import HistoricoMonitoreo from './pages/HistoricoMonitoreo';
import VerAlertas from './pages/VerAlertas';
import ResetPassword from './pages/ResetPassword';
import EliminarUsuario from './components/EliminarUsuario';
import EditarUsuario from './components/EditarUsuario';
import AccesoProhibido from './pages/AccesoProhibido'; // Nueva página 
import Perfil from './components/Perfil';
import ProtectedRoute from './components/ProtectedRoute'; // Importar ProtectedRoute
import Sidebar from './components/Sidebar';
import AgregarMonitoreo from './pages/AgregarMonitoreo';

function App() {
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/AdminDashboard" element={<ProtectedRoute element={AdminDashboard} roles={[1]} />} />
        <Route path="/User" element={<User />} />
        <Route path="/AgregarUsuario" element={<ProtectedRoute element={AgregarUsuario} roles={[1]} />} />
        <Route path="/AgregarProducto" element={<ProtectedRoute element={AgregarProducto} roles={[1]} />} />
        <Route path="/AgregarCondicionAmbiental" element={<ProtectedRoute element={AgregarCondicionAmbiental} roles={[1]} />} />
        <Route path="/AgregarMonitoreo" element={<ProtectedRoute element={AgregarMonitoreo} roles={[1]} />} />
        <Route path="/EditarUsuario/:id" element={<ProtectedRoute element={EditarUsuario} roles={[1]} />} />
        <Route path="/ConsultarUsuarios" element={<ProtectedRoute element={ConsultarUsuarios} roles={[1]} />} />
        <Route path="/ConsultarCondiciones" element={<ProtectedRoute element={ConsultarCondiciones} roles={[1]} />} />
        <Route path="/ConsultarProductos" element={<ProtectedRoute element={ConsultarProductos} roles={[1]} />} />
        <Route path="/ConsultarMetricas" element={<ProtectedRoute element={ConsultarMetricas} roles={[1, 2]} />} />
        <Route path="/ConsultarRegistros" element={<ProtectedRoute element={ConsultarRegistros} roles={[1, 2]} />} />
        <Route path="/HistoricoMonitoreo/:id" element={<ProtectedRoute element={HistoricoMonitoreo} roles={[1, 2]} />} />
        <Route path="/VerAlertas" element={<ProtectedRoute element={VerAlertas} roles={[1, 2]} />} />
        <Route path="/EliminarUsuario" element={<ProtectedRoute element={EliminarUsuario} roles={[1]} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/AccesoProhibido" element={<AccesoProhibido />} />        
        <Route path="/Sidebar" element={<ProtectedRoute element={Sidebar} roles={[1]} />} />
        <Route path="/Perfil" element={<ProtectedRoute element={Perfil} roles={[1, 2]} />} /> {/* Añadir ProtectedRoute para Perfil */}
      </Routes>
    </>
  );
}

function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default Root;
