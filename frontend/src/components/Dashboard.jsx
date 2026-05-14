// Dashboard.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Resumen from './Resumen';
import Inventario from './Inventario';
import Usuarios from './Usuarios';

const Dashboard = ({ equipos, setEquipos, currentUser, onLogout, children }) => {
  const { vista } = useParams();

  const getTitle = () => {
    const titles = {
      resumen: 'Resumen del Inventario',
      inventario: 'Inventario de Equipos',
      agregar: 'Agregar Nuevo Equipo',
      usuarios: 'Gestión de Usuarios',
      perfil: 'Mi Perfil',
      acciones: 'Registro de Acciones'
    };
    return titles[vista] || 'Resumen del Inventario';
  };

  const renderContent = () => {
    // Si hay children (para rutas especiales como perfil y acciones)
    if (children) {
      return children;
    }
    
    switch (vista) {
      case 'resumen':
        return <Resumen equipos={equipos} />;
      case 'inventario':
        return <Inventario equipos={equipos} setEquipos={setEquipos} currentUser={currentUser} />;
      case 'usuarios':
        if (currentUser?.rol === 'admin') {
          return <Usuarios currentUser={currentUser} />;
        }
        return <Resumen equipos={equipos} />;
      default:
        return <Resumen equipos={equipos} />;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar currentUser={currentUser} onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getTitle()} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;