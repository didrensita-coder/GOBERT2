import React from 'react';
import { Home, List, PlusCircle, Users, Shield, LogOut } from 'lucide-react';

const Sidebar = ({ vistaActual, setVistaActual, currentUser, onLogout }) => {
  // Elementos base del menú (visibles para todos)
  const items = [
    { id: 'resumen', label: 'Resumen', icon: Home },
    { id: 'inventario', label: 'Inventario', icon: List },
    { id: 'agregar', label: 'Agregar Equipo', icon: PlusCircle },
  ];

  // Si es administrador, agregar la opción de gestión de usuarios
  if (currentUser && currentUser.rol === 'admin') {
    items.push({ id: 'usuarios', label: 'Gestionar Usuarios', icon: Users });
  }

  return (
    <div className="w-72 bg-gradient-to-b from-[#1e3c72] to-[#2a5298] text-white p-6 overflow-y-auto shadow-lg flex flex-col h-full">
      {/* Logo y título */}
      <div className="mb-8 pb-4 border-b border-white/20">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={28} className="text-white" />
          <div>
            <div className="text-lg font-bold uppercase tracking-wide">Inventario</div>
            <div className="text-xs opacity-75">Sistema de Equipos</div>
          </div>
        </div>
        
        {/* Información del usuario actual */}
        <div className="mt-4 pt-2">
          <div className="text-sm font-medium">{currentUser?.username || 'Usuario'}</div>
          <div className="text-xs opacity-75 mt-1">
            {currentUser?.rol === 'admin' ? (
              <span className="flex items-center gap-1">
                <Shield size={12} /> Administrador
              </span>
            ) : (
              <span className="flex items-center gap-1">
                👤 Coordinador
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Menú de navegación */}
      <nav className="flex-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => setVistaActual(item.id)}
              className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg cursor-pointer transition-all ${
                vistaActual === item.id
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

      {/* Botón de cerrar sesión */}
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