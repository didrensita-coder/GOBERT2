import React from 'react';
import { LogOut } from 'lucide-react';

const Header = () => {
  const handleLogout = () => {
    window.location.reload();
  };

  return (
    <div className="bg-white px-8 py-5 border-b border-gray-200 shadow-sm flex justify-between items-center">
      <h1 className="text-2xl font-bold text-[#1e3c72]">Sistema de Inventario</h1> 
    </div>
  );
};

export default Header;