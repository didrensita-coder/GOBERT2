// components/PerfilUsuario.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Building, Shield, Camera, 
  Save, Lock, Eye, EyeOff, ArrowLeft, CheckCircle,
  Upload, X, AlertCircle, LogOut
} from 'lucide-react';

const PerfilUsuario = ({ currentUser, setCurrentUser, onLogout }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);
  const [mostrarCambioPassword, setMostrarCambioPassword] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarNuevaPassword, setMostrarNuevaPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);
  
  const [fotoPreview, setFotoPreview] = useState(currentUser?.foto_perfil || null);
  const [fotoFile, setFotoFile] = useState(null);
  
  const [formData, setFormData] = useState({
    first_name: currentUser?.first_name || '',
    last_name: currentUser?.last_name || '',
    email: currentUser?.email || '',
    telefono: currentUser?.telefono || '',
    departamento: currentUser?.departamento || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ foto: 'La imagen no puede superar los 5MB' });
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors({ foto: 'Solo se permiten imágenes' });
        return;
      }
      setFotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFotoPreview(reader.result);
      reader.readAsDataURL(file);
      setErrors({});
    }
  };

  const mostrarNotificacion = (mensaje, tipo) => {
    const bgColor = tipo === 'success' ? '#10b981' : '#ef4444';
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 80px; right: 20px; padding: 16px 24px;
      background: ${bgColor}; color: white; border-radius: 12px;
      font-weight: bold; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease;
      z-index: 10000;
    `;
    notification.innerHTML = `${tipo === 'success' ? '✅' : '❌'} ${mensaje}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setErrorMessage('');
    setSuccessMessage('');

    const formDataToSend = new FormData();
    formDataToSend.append('first_name', formData.first_name);
    formDataToSend.append('last_name', formData.last_name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('telefono', formData.telefono);
    formDataToSend.append('departamento', formData.departamento);
    
    if (fotoFile) {
        formDataToSend.append('foto_perfil', fotoFile);
    }

    try {
        const response = await fetch('http://localhost:8000/api/usuarios/actualizar_perfil/', {
            method: 'PUT',
            body: formDataToSend,
            credentials: 'include',
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Asegurar que la URL de la foto sea completa
            const updatedUser = { 
                ...currentUser, 
                ...data.user,
                foto_perfil: data.user.foto_perfil || null
            };
            
            setCurrentUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            setEditando(false);
            setSuccessMessage('Perfil actualizado exitosamente');
            mostrarNotificacion('Perfil actualizado exitosamente', 'success');
            
            // Recargar el sidebar actualizando el estado
            setTimeout(() => {
                window.dispatchEvent(new Event('storage'));
            }, 100);
        } else {
            setErrors(data.errors || { detail: data.message || 'Error al actualizar' });
            setErrorMessage(data.message || 'Error al actualizar el perfil');
            mostrarNotificacion(data.message || 'Error al actualizar', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        setErrorMessage('Error de conexión con el servidor');
        mostrarNotificacion('Error de conexión', 'error');
    }

    setLoading(false);
};

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setErrors({ confirm_password: 'Las contraseñas no coinciden' });
      return;
    }
    
    if (passwordData.new_password.length < 6) {
      setErrors({ new_password: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:8000/api/usuarios/cambiar_password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMostrarCambioPassword(false);
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
        mostrarNotificacion('Contraseña actualizada exitosamente', 'success');
      } else {
        setErrors(data.errors || { detail: data.message || 'Error al cambiar contraseña' });
        mostrarNotificacion(data.message || 'Error al cambiar contraseña', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ detail: 'Error de conexión' });
      mostrarNotificacion('Error de conexión', 'error');
    }

    setLoading(false);
  };

  const getRolDisplay = (rol) => {
    const roles = {
      'admin': 'Administrador',
      'coordinador': 'Coordinador',
    };
    return roles[rol] || rol;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Botón volver - AHORA FUNCIONA CORRECTAMENTE */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/dashboard/resumen')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
          >
            <ArrowLeft size={18} /> Volver al Dashboard
          </button>
          
          {!editando ? (
            <button
              onClick={() => setEditando(true)}
              className="flex items-center gap-2 px-5 py-2 bg-[#1e3c72] text-white rounded-lg hover:bg-[#2a5298] transition shadow-md"
            >
              <Save size={16} /> Editar Perfil
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setEditando(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-5 py-2 bg-[#1e3c72] text-white rounded-lg hover:bg-[#2a5298] flex items-center gap-2 disabled:opacity-50 transition shadow-md"
              >
                <Save size={16} />
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          )}
        </div>

        {/* Mensajes de éxito/error */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-400 rounded-xl flex items-center gap-2 animate-fadeIn">
            <CheckCircle size={20} className="text-green-500" />
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-400 rounded-xl flex items-center gap-2 animate-fadeIn">
            <AlertCircle size={20} className="text-red-500" />
            <p className="text-red-700">{errorMessage}</p>
          </div>
        )}

        {/* Tarjeta Principal */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {/* Cabecera - AZUL OSCURO */}
          <div className="bg-[#1e3c72] px-8 py-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Foto de perfil */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center overflow-hidden ring-4 ring-white/30">
                  {fotoPreview ? (
                    <img
                      src={fotoPreview}
                      alt="Foto perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-white" />
                  )}
                </div>
                {editando && (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
                    >
                      <Camera size={16} className="text-[#1e3c72]" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFotoChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </>
                )}
              </div>

              {/* Info básica */}
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-white">
                  {formData.first_name || currentUser?.username} {formData.last_name}
                </h1>
                <p className="text-white/80 flex items-center gap-1 justify-center md:justify-start">
                  <Shield size={14} /> {getRolDisplay(currentUser?.rol)}
                </p>
                <p className="text-white/60 text-sm mt-1">
                  @{currentUser?.username}
                </p>
              </div>
            </div>
          </div>

          {/* Contenido del perfil */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Información personal */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-gray-200">
                  <User size={20} className="text-[#1e3c72]" />
                  <h2 className="text-lg font-semibold text-gray-800">Información Personal</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Nombre
                    </label>
                    {editando ? (
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3c72] focus:border-transparent"
                        placeholder="Tu nombre"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{formData.first_name || 'No especificado'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Apellido
                    </label>
                    {editando ? (
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3c72] focus:border-transparent"
                        placeholder="Tu apellido"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{formData.last_name || 'No especificado'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      <Mail size={14} className="inline mr-1" /> Correo Electrónico
                    </label>
                    {editando ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3c72] focus:border-transparent"
                        placeholder="tu@email.com"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{formData.email || 'No especificado'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      <Phone size={14} className="inline mr-1" /> Teléfono
                    </label>
                    {editando ? (
                      <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3c72] focus:border-transparent"
                        placeholder="+58 123 4567890"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{formData.telefono || 'No especificado'}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      <Building size={14} className="inline mr-1" /> Departamento
                    </label>
                    {editando ? (
                      <input
                        type="text"
                        name="departamento"
                        value={formData.departamento}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3c72] focus:border-transparent"
                        placeholder="Ej: Tecnología, Recursos Humanos, Ventas..."
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{formData.departamento || 'No especificado'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Panel lateral */}
              <div className="space-y-6">
                {/* Cambiar contraseña */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock size={18} className="text-[#1e3c72]" />
                    <h3 className="font-semibold text-gray-800">Seguridad</h3>
                  </div>

                  {!mostrarCambioPassword ? (
                    <button
                      onClick={() => setMostrarCambioPassword(true)}
                      className="w-full py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                      <Lock size={14} /> Cambiar Contraseña
                    </button>
                  ) : (
                    <form onSubmit={handleCambiarPassword}>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Contraseña Actual</label>
                          <div className="relative">
                            <input
                              type={mostrarPassword ? 'text' : 'password'}
                              name="current_password"
                              value={passwordData.current_password}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setMostrarPassword(!mostrarPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                              {mostrarPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Nueva Contraseña</label>
                          <div className="relative">
                            <input
                              type={mostrarNuevaPassword ? 'text' : 'password'}
                              name="new_password"
                              value={passwordData.new_password}
                              onChange={handlePasswordChange}
                              className={`w-full px-3 py-2 border rounded-lg text-sm pr-10 ${
                                errors.new_password ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setMostrarNuevaPassword(!mostrarNuevaPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                              {mostrarNuevaPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                          {errors.new_password && <p className="text-xs text-red-500 mt-1">{errors.new_password}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Confirmar Contraseña</label>
                          <div className="relative">
                            <input
                              type={mostrarConfirmPassword ? 'text' : 'password'}
                              name="confirm_password"
                              value={passwordData.confirm_password}
                              onChange={handlePasswordChange}
                              className={`w-full px-3 py-2 border rounded-lg text-sm pr-10 ${
                                errors.confirm_password ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setMostrarConfirmPassword(!mostrarConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                              {mostrarConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                          {errors.confirm_password && <p className="text-xs text-red-500 mt-1">{errors.confirm_password}</p>}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setMostrarCambioPassword(false);
                              setPasswordData({
                                current_password: '',
                                new_password: '',
                                confirm_password: '',
                              });
                              setErrors({});
                            }}
                            className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 bg-[#1e3c72] text-white rounded-lg text-sm hover:bg-[#2a5298] transition disabled:opacity-50"
                          >
                            {loading ? 'Guardando...' : 'Cambiar'}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>

                {/* Información de la cuenta */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield size={18} className="text-[#1e3c72]" />
                    <h3 className="font-semibold text-gray-800">Información de Cuenta</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Usuario:</span>
                      <span className="font-medium text-gray-700">@{currentUser?.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rol:</span>
                      <span className="font-medium text-gray-700">{getRolDisplay(currentUser?.rol)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ID:</span>
                      <span className="font-medium text-gray-700">#{currentUser?.id}</span>
                    </div>
                  </div>
                </div>

                {/* Botón cerrar sesión */}
                <button
                  onClick={onLogout}
                  className="w-full py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition flex items-center justify-center gap-2 font-medium border border-red-200"
                >
                  <LogOut size={18} /> Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PerfilUsuario;