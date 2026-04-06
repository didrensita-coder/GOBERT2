import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Resumen from './Resumen';
import Inventario from './Inventario';
import AgregarEquipo from './AgregarEquipo';
import GestionUsuarios from './GestionUsuarios';
import { logout } from '../services/api';

const Dashboard = ({ equipos, setEquipos, currentUser, setCurrentUser, setIsLoggedIn }) => {
  const [vistaActual, setVistaActual] = useState('resumen');

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const renderVista = () => {
    switch (vistaActual) {
      case 'resumen':
        return <Resumen equipos={equipos} />;
      case 'inventario':
        return <Inventario equipos={equipos} setEquipos={setEquipos} currentUser={currentUser} />;
      case 'agregar':
        return <AgregarEquipo equipos={equipos} setEquipos={setEquipos} currentUser={currentUser} />;
      case 'usuarios':
        return <GestionUsuarios currentUser={currentUser} />;
      default:
        return <Resumen equipos={equipos} />;
    }
  };

  return (
    <div className="flex h-full bg-gray-100">
      <Sidebar 
        vistaActual={vistaActual} 
        setVistaActual={setVistaActual} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentUser={currentUser} />
        <div className="flex-1 overflow-y-auto p-8">{renderVista()}</div>
      </div>
    </div>
  );
};

export default Dashboard;