import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  const titles: Record<string, string> = {
    resumen: 'Resumen del Inventario',
    inventario: 'Inventario de Equipos',
    agregar: 'Agregar Nuevo Equipo',
  };

  return (
    <div className="dashboard-container">
      <Sidebar currentView={currentView} onViewChange={onViewChange} />
      <div className="main-content">
        <Header title={titles[currentView]} />
        <div className="content-area">{children}</div>
      </div>
    </div>
  );
};