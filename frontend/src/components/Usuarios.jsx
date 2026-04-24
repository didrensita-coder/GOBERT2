import React, { useState, useEffect } from 'react';
import { getUsuarios, registrarCoordinador, deleteUsuario } from '../services/api';
import { UserPlus, Trash2, Shield, UserCheck, Users, Crown } from 'lucide-react';

const Usuarios = ({ currentUser }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [vistaActiva, setVistaActiva] = useState('todos'); // 'todos', 'admins', 'coordinadores'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    rol: 'coordinador',
    telefono: '',
    departamento: ''
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      mostrarNotificacion('Las contraseñas no coinciden', 'error');
      return;
    }

    const result = await registrarCoordinador(formData);
    if (result.success) {
      mostrarNotificacion('Usuario registrado exitosamente', 'success');
      setShowModal(false);
      setFormData({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        rol: 'coordinador',
        telefono: '',
        departamento: ''
      });
      cargarUsuarios();
    } else {
      mostrarNotificacion(result.error || 'Error al registrar usuario', 'error');
    }
  };

  const handleDelete = async (id, username) => {
    if (window.confirm(`¿Eliminar al usuario "${username}"?`)) {
      const result = await deleteUsuario(id);
      if (result.success) {
        mostrarNotificacion('Usuario eliminado exitosamente', 'success');
        cargarUsuarios();
      } else {
        mostrarNotificacion('Error al eliminar usuario', 'error');
      }
    }
  };

  const mostrarNotificacion = (mensaje, tipo) => {
    const bgColor = tipo === 'success' ? '#27ae60' : '#e74c3c';
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      padding: 16px 24px;
      background: ${bgColor};
      color: white;
      border-radius: 12px;
      font-weight: bold;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `${tipo === 'success' ? '✅' : '❌'} ${mensaje}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  // Filtrar usuarios según vista activa
  const usuariosFiltrados = () => {
    if (vistaActiva === 'admins') {
      return usuarios.filter(u => u.rol === 'admin');
    }
    if (vistaActiva === 'coordinadores') {
      return usuarios.filter(u => u.rol === 'coordinador');
    }
    return usuarios;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando usuarios...</div>
      </div>
    );
  }

  const adminsCount = usuarios.filter(u => u.rol === 'admin').length;
  const coordinadoresCount = usuarios.filter(u => u.rol === 'coordinador').length;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1e3c72]">👥 Gestión de Usuarios</h2>
          <p className="text-gray-500 text-sm mt-1">Administra los usuarios del sistema</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1e3c72] to-[#2a5298] text-white rounded-lg hover:shadow-lg transition-all"
        >
          <UserPlus size={18} />
          Nuevo Usuario
        </button>
      </div>

      {/* Tarjetas de categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* Tarjeta de Administradores */}
        <div
          onClick={() => setVistaActiva('admins')}
          className={`bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl p-6 cursor-pointer transition-all transform hover:scale-105 ${
            vistaActiva === 'admins' ? 'ring-4 ring-purple-300 shadow-xl' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Crown size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">Administradores</h3>
                <p className="text-purple-100 text-sm">Control total del sistema</p>
              </div>
            </div>
            <div className="text-white text-4xl font-bold">{adminsCount}</div>
          </div>
        </div>

        {/* Tarjeta de Coordinadores */}
        <div
          onClick={() => setVistaActiva('coordinadores')}
          className={`bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-6 cursor-pointer transition-all transform hover:scale-105 ${
            vistaActiva === 'coordinadores' ? 'ring-4 ring-blue-300 shadow-xl' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Users size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">Coordinadores</h3>
                <p className="text-blue-100 text-sm">Gestión de inventario</p>
              </div>
            </div>
            <div className="text-white text-4xl font-bold">{coordinadoresCount}</div>
          </div>
        </div>
      </div>

      {/* Botón para ver todos (opcional) */}
      {vistaActiva !== 'todos' && (
        <div className="mb-4 text-right">
          <button
            onClick={() => setVistaActiva('todos')}
            className="text-sm text-[#1e3c72] hover:underline"
          >
            Ver todos los usuarios →
          </button>
        </div>
      )}

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Usuario</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Nombre Completo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Rol</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Departamento</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados().length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-500">
                  No hay usuarios en esta categoría
                </td>
              </tr>
            ) : (
              usuariosFiltrados().map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      {user.rol === 'admin' ? (
                        <Crown size={16} className="text-purple-500" />
                      ) : (
                        <UserCheck size={16} className="text-blue-500" />
                      )}
                      {user.username}
                    </div>
                   </td>
                  <td className="px-4 py-3 text-sm">{user.first_name} {user.last_name} </td>
                  <td className="px-4 py-3 text-sm">{user.email || '-'} </td>
                  <td className="px-4 py-3 text-sm">
                    {user.rol === 'admin' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                        <Shield size={12} /> Administrador
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        <UserCheck size={12} /> Coordinador
                      </span>
                    )}
                   </td>
                  <td className="px-4 py-3 text-sm">{user.departamento || '-'} </td>
                  <td className="px-4 py-3 text-center">
                    {user.username !== currentUser?.username && user.rol !== 'admin' && (
                      <button
                        onClick={() => handleDelete(user.id, user.username)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Eliminar usuario"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    {user.username === currentUser?.username && (
                      <span className="text-xs text-gray-400">(Tú)</span>
                    )}
                   </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para registrar usuario (igual que antes) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#1e3c72] mb-4">Registrar Nuevo Usuario</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Usuario *</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmar Contraseña *</label>
                    <input
                      type="password"
                      name="password2"
                      value={formData.password2}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Apellido</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Departamento</label>
                    <input
                      type="text"
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Rol</label>
                    <select
                      name="rol"
                      value={formData.rol}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="coordinador">Coordinador</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Registrar Usuario
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Usuarios;