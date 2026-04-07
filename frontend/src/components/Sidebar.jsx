import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, List, PlusCircle, Users, Shield, LogOut } from 'lucide-react';

const Sidebar = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener la vista actual de la URL
  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes('/usuarios')) return 'usuarios';
    if (path.includes('/inventario')) return 'inventario';
    return 'resumen';
  };

  const vistaActual = getCurrentView();

  const items = [
    { id: 'resumen', label: 'Resumen', icon: Home, path: '/dashboard/resumen' },
    { id: 'inventario', label: 'Inventario', icon: List, path: '/dashboard/inventario' },
    { id: 'agregar', label: 'Agregar Equipo', icon: PlusCircle, path: '/seleccionar-tipo' },
  ];

  if (currentUser && currentUser.rol === 'admin') {
    items.push({ id: 'usuarios', label: 'Gestionar Usuarios', icon: Users, path: '/dashboard/usuarios' });
  }

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="w-72 bg-gradient-to-b from-[#1e3c72] to-[#2a5298] text-white p-6 overflow-y-auto shadow-lg flex flex-col h-full">
      <div className="mb-8 pb-4 border-b border-white/20">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={28} className="text-white" />
          <div>
            <div className="text-lg font-bold uppercase tracking-wide">Inventario</div>
            <div className="text-xs opacity-75">Sistema de Equipos</div>
          </div>
        </div>
        
        <div className="mt-4 pt-2">
          <div className="text-sm font-medium">{currentUser?.username || 'Usuario'}</div>
          <div className="text-xs opacity-75 mt-1">
            {currentUser?.rol === 'admin' ? (
              <span className="flex items-center gap-1">
                <Shield size={12} /> Administrador
              </span>
            ) : (
              <span className="flex items-center gap-1">👤 Coordinador</span>
            )}
          </div>
        </div>
      </div>

      <nav className="flex-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = vistaActual === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg cursor-pointer transition-all ${
                isActive
                  ? 'bg-white/30 border-l-4 border-white pl-3'
                  : 'hover:bg-white/20'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/20">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/20 transition-all text-sm font-medium"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;