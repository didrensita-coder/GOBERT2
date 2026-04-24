import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SeleccionTipoEquipo from './components/SeleccionTipoEquipo';
import FormularioComputadora from './components/FormularioComputadora';
import FormularioImpresora from './components/FormularioImpresora';
import FormularioMonitor from './components/FormularioMonitor';
import DetalleEquipo from './components/DetalleEquipo';
import PerfilUsuario from './components/PerfilUsuario';
import { getEquipos } from './services/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [equipos, setEquipos] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
      cargarEquipos();
    }
    setLoading(false);
  }, []);

  const cargarEquipos = async () => {
    const data = await getEquipos();
    if (data) setEquipos(data);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    cargarEquipos();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1e3c72] to-[#2a5298]">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/resumen" />} />
        <Route path="/dashboard/:vista" element={
          <Dashboard 
            equipos={equipos} 
            setEquipos={setEquipos} 
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        } />
        <Route path="/dashboard/perfil" element={
          <PerfilUsuario 
            currentUser={currentUser} 
            setCurrentUser={setCurrentUser}
            onLogout={handleLogout}
          />
        } />
        <Route path="/seleccionar-tipo" element={<SeleccionTipoEquipo />} />
        <Route path="/agregar/computadora" element={
          <FormularioComputadora equipos={equipos} setEquipos={setEquipos} />
        } />
        <Route path="/agregar/impresora" element={
          <FormularioImpresora equipos={equipos} setEquipos={setEquipos} />
        } />
        <Route path="/agregar/monitor" element={
          <FormularioMonitor equipos={equipos} setEquipos={setEquipos} />
        } />
        <Route path="/equipo/:id" element={
          <DetalleEquipo equipos={equipos} setEquipos={setEquipos} />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
