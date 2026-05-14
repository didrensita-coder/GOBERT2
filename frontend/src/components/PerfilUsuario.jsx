import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, User, Mail, Phone, Building, ArrowLeft, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { actualizarPerfil, cambiarPassword, updateCurrentUser } from '../services/api';
import ImageUpload from './ImageUpload';

const PerfilUsuario = ({ currentUser, setCurrentUser, onLogout }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cargandoPassword, setCargandoPassword] = useState(false);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const [photoFile, setPhotoFile] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        telefono: '',
        departamento: ''
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    useEffect(() => {
        if (currentUser) {
            setFormData({
                first_name: currentUser.first_name || '',
                last_name: currentUser.last_name || '',
                email: currentUser.email || '',
                telefono: currentUser.telefono || '',
                departamento: currentUser.departamento || ''
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const mostrarNotificacion = (texto, tipo) => {
        setMensaje({ texto, tipo });
        setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataToSend = new FormData();
        formDataToSend.append('first_name', formData.first_name);
        formDataToSend.append('last_name', formData.last_name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('telefono', formData.telefono);
        formDataToSend.append('departamento', formData.departamento);
        
        if (photoFile) {
            formDataToSend.append('foto_perfil', photoFile);
        }

        const result = await actualizarPerfil(formDataToSend);
        
        if (result.success) {
            setCurrentUser(result.user);
            updateCurrentUser(result.user);
            setPhotoFile(null);
            mostrarNotificacion('✅ Perfil actualizado correctamente', 'success');
            // Recargar la página después de 1.5 segundos para mostrar los cambios
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            mostrarNotificacion(result.error || '❌ Error al actualizar perfil', 'error');
        }
        
        setLoading(false);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordData.new_password !== passwordData.confirm_password) {
            mostrarNotificacion('❌ Las contraseñas no coinciden', 'error');
            return;
        }
        
        if (passwordData.new_password.length < 6) {
            mostrarNotificacion('❌ La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        setCargandoPassword(true);
        const result = await cambiarPassword(passwordData.current_password, passwordData.new_password);
        
        if (result.success) {
            mostrarNotificacion('✅ Contraseña actualizada correctamente. Serás redirigido al login.', 'success');
            setTimeout(() => onLogout(), 2000);
        } else {
            mostrarNotificacion(result.error || '❌ Error al cambiar contraseña', 'error');
        }
        
        setCargandoPassword(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/dashboard/resumen')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Volver al Dashboard
                </button>
            </div>

            {/* Notificación flotante */}
            {mensaje.texto && (
                <div className={`fixed top-20 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-slideIn ${
                    mensaje.tipo === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                    {mensaje.tipo === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {mensaje.texto}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-6">
                    <div className="flex items-center gap-3">
                        <Camera size={28} className="text-white" />
                        <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
                    </div>
                    <p className="text-white/80 text-sm mt-1">Gestiona tu información personal</p>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna izquierda - Foto de perfil */}
                        <div className="lg:col-span-1">
                            <ImageUpload
                                onImageChange={setPhotoFile}
                                currentImage={currentUser?.foto_perfil}
                                tipo="perfil"
                                label="Foto de Perfil"
                            />
                            
                            <div className="mt-6 bg-blue-50 rounded-xl p-4">
                                <p className="text-xs text-blue-600">
                                    💡 La foto de perfil se actualizará al guardar los cambios
                                </p>
                            </div>
                        </div>

                        {/* Columna derecha - Formulario */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <User size={14} className="inline mr-1" /> Nombre
                                        </label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <User size={14} className="inline mr-1" /> Apellido
                                        </label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <Mail size={14} className="inline mr-1" /> Correo Electrónico
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <Phone size={14} className="inline mr-1" /> Teléfono
                                        </label>
                                        <input
                                            type="text"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            placeholder="Ej: 0412-1234567"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <Building size={14} className="inline mr-1" /> Departamento
                                    </label>
                                    <input
                                        type="text"
                                        name="departamento"
                                        value={formData.departamento}
                                        onChange={handleChange}
                                        placeholder="Ej: Tecnología, Recursos Humanos"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex justify-end pt-4 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <Save size={18} />
                                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            </form>

                            {/* Cambiar contraseña */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Cambiar Contraseña</h3>
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Contraseña Actual
                                        </label>
                                        <input
                                            type="password"
                                            name="current_password"
                                            value={passwordData.current_password}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Nueva Contraseña
                                            </label>
                                            <input
                                                type="password"
                                                name="new_password"
                                                value={passwordData.new_password}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Confirmar Contraseña
                                            </label>
                                            <input
                                                type="password"
                                                name="confirm_password"
                                                value={passwordData.confirm_password}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={cargandoPassword}
                                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                                        >
                                            {cargandoPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default PerfilUsuario;