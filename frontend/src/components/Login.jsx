import React, { useState } from 'react';
import { login } from '../services/api';

const Login = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Verificar contra la base de datos
    const result = await login(user, pass);
    
    if (result.success) {
      onLogin(result.user);
    } else {
      setError(result.error || 'Usuario o contraseña incorrectos');
    }
    
    setLoading(false);
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#1e3c72] to-[#2a5298]">
      <div className="bg-white rounded-xl p-10 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <img src="/avatar8.png" alt="Logo Inventario" className="w-40 h-40 mx-auto mb-3 object-contain" />
          <div className="text-3xl font-bold text-[#1e3c72] mb-2">Sistema Gobert</div>
          <div className="text-sm text-gray-500">Sistema de inventario de equipos computacionales.</div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            ❌ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Usuario</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2a5298] transition-colors"
              placeholder="Ingrese su usuario"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2a5298] transition-colors"
              placeholder="Ingrese su contraseña"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#1e3c72] to-[#2a5298] text-white font-semibold rounded-lg hover:transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="mt-4 text-center text-xs text-gray-400">
          
        </div>
      </div>
    </div>
  );
};

export default Login;