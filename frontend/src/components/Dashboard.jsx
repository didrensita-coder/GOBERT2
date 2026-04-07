import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Resumen from './Resumen';
import Inventario from './Inventario';
import AgregarEquipo from './AgregarEquipo';
import Usuarios from './Usuarios';

const Dashboard = ({ equipos, setEquipos, currentUser, onLogout }) => {
  const { vista } = useParams();
  const navigate = useNavigate();

  const getTitle = () => {
    const titles = {
      resumen: 'Resumen del Inventario',
      inventario: 'Inventario de Equipos',
      agregar: 'Agregar Nuevo Equipo',
      usuarios: 'Gestión de Usuarios'
    };
    return titles[vista] || 'Resumen del Inventario';
  };

  const renderContent = () => {
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
      <Sidebar 
        currentUser={currentUser}
        onLogout={onLogout}
      />
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