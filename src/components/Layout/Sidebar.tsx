import React from 'react';
import { Home, List, PlusCircle } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'resumen', label: 'Resumen', icon: Home },
    { id: 'inventario', label: 'Inventario', icon: List },
    { id: 'agregar', label: 'Agregar Equipo', icon: PlusCircle },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-title">Menú</div>
      {navItems.map((item) => (
        <div
          key={item.id}
          className={`nav-item ${currentView === item.id ? 'active' : ''}`}
          onClick={() => onViewChange(item.id)}
        >
          <item.icon size={20} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};