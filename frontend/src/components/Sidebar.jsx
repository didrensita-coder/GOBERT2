// components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Users, 
  LogOut,
  UserCircle
} from 'lucide-react';

const Sidebar = ({ currentUser: propCurrentUser, onLogout }) => {
  const [currentUser, setCurrentUser] = useState(propCurrentUser);

  // Escuchar cambios en localStorage (cuando se actualiza el perfil)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    };

    // También actualizar si cambia la prop
    setCurrentUser(propCurrentUser);
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [propCurrentUser]);

  const navItems = [
    { path: '/dashboard/resumen', label: 'Resumen', icon: LayoutDashboard },
    { path: '/dashboard/inventario', label: 'Inventario', icon: Package },
    { path: '/seleccionar-tipo', label: 'Agregar Equipo', icon: PlusCircle },
  ];

  if (currentUser?.rol === 'admin') {
    navItems.push({ path: '/dashboard/usuarios', label: 'Usuarios', icon: Users });
  }

  navItems.push({ path: '/dashboard/perfil', label: 'Mi Perfil', icon: UserCircle });

  const fotoPerfilUrl = currentUser?.foto_perfil || null;

  return (
    <div className="w-64 bg-[#1a3565] text-white flex flex-col shadow-xl">
      <div className="p-6 border-b border-white/10">
      <img src="/logo2.png" alt="Logo Inventario" className="w-20 h-20 mx-auto mb-3 object-contain" />
        <h1 className="text-2xl font-bold tracking-wide">INVENTARIO</h1>
        <p className="text-xs text-white/60 mt-1">Sistema de Gestión</p>
      </div>

      <nav className="flex-1 py-8">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 mx-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 text-white shadow-md'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
            {fotoPerfilUrl ? (
              <img 
                src={fotoPerfilUrl} 
                alt="Foto perfil" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold">
                {currentUser?.first_name?.charAt(0) || currentUser?.username?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {currentUser?.first_name || currentUser?.username}
            </p>
            <p className="text-xs text-white/50 truncate">
              {currentUser?.rol === 'admin' ? 'Administrador' : 'Coordinador'}
            </p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors duration-200 text-sm font-medium"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;