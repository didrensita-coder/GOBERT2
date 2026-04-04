import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { logout } = useAuth();

  return (
    <div className="header">
      <div className="header-title">{title}</div>
      <button className="logout-btn" onClick={logout}>
        <LogOut size={16} />
        Cerrar Sesión
      </button>
    </div>
  );
};