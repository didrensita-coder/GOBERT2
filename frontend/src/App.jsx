import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { getEquipos, verificarAuth } from './services/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [equipos, setEquipos] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
        await cargarEquipos();
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const cargarEquipos = async () => {
    const data = await getEquipos();
    if (data) setEquipos(data);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    cargarEquipos();
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#1e3c72] to-[#2a5298]">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Dashboard 
      equipos={equipos} 
      setEquipos={setEquipos} 
      currentUser={currentUser}
      setCurrentUser={setCurrentUser}
      setIsLoggedIn={setIsLoggedIn}
    />
  );
}

export default App;