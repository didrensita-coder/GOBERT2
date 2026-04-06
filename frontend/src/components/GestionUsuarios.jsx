import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Shield, X } from 'lucide-react';
import { getUsuarios, registrarCoordinador, deleteUsuario } from '../services/api';

const GestionUsuarios = ({ currentUser }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    telefono: '',
    departamento: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    const data = await getUsuarios();
    setUsuarios(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const result = await registrarCoordinador({
      username: formData.username,
      password: formData.password,
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      rol: 'coordinador',
      telefono: formData.telefono,
      departamento: formData.departamento
    });

    if (result.success) {
      setSuccess(`✅ Coordinador ${formData.username} registrado`);
      setFormData({
        username: '', password: '', email: '', first_name: '', last_name: '', telefono: '', departamento: ''
      });
      await cargarUsuarios();
      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
      }, 1500);
    } else {
      setError(result.error || 'Error al registrar');
    }
  };

  const handleDelete = async (id, username) => {
    if (window.confirm(`¿Eliminar a "${username}"?`)) {
      const result = await deleteUsuario(id);
      if (result.success) {
        setSuccess(`✅ Usuario ${username} eliminado`);
        await cargarUsuarios();
        setTimeout(() => setSuccess(''), 2000);
      } else {
        setError('Error al eliminar');
      }
    }
  };

  if (currentUser?.rol !== 'admin') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-700">Acceso Denegado</h2>
        <p className="text-red-600">Solo administradores</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1e3c72]">Gestión de Usuarios</h2>
          <p className="text-gray-500 text-sm">Total: {usuarios.length} usuarios</p>
        </div>
        <button
          onClick={() => {
            setFormData({
              username: '', password: '', email: '', first_name: '', last_name: '', telefono: '', departamento: ''
            });
            setError('');
            setShowModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-[#1e3c72] to-[#2a5298] text-white rounded-lg flex items-center gap-2"
        >
          <UserPlus size={18} />
          Registrar Coordinador
        </button>
      </div>

      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">❌ {error}</div>}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold">Usuario</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Rol</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Teléfono</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Departamento</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8">Cargando...</td></tr>
              ) : usuarios.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8">No hay usuarios</td></tr>
              ) : (
                usuarios.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{user.username}</td>
                    <td className="px-4 py-3 text-sm">{user.first_name} {user.last_name}</td>
                    <td className="px-4 py-3 text-sm">{user.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${user.rol === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.rol === 'admin' ? 'Administrador' : 'Coordinador'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{user.telefono || '-'}</td>
                    <td className="px-4 py-3 text-sm">{user.departamento || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      {user.username !== currentUser?.username && user.rol !== 'admin' && (
                        <button onClick={() => handleDelete(user.id, user.username)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#1e3c72]">Registrar Coordinador</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400">✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Usuario *</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Contraseña *</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required minLength={6} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Nombre</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Apellido</label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Teléfono</label>
                  <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Departamento</label>
                  <input type="text" name="departamento" value={formData.departamento} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="flex-1 py-2 bg-gradient-to-r from-[#1e3c72] to-[#2a5298] text-white rounded-lg">Registrar</button>
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionUsuarios;