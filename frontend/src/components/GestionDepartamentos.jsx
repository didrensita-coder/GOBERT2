import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Building, AlertCircle, Search } from 'lucide-react';
import { getDepartamentos, crearDepartamento, actualizarDepartamento, eliminarDepartamento } from '../services/api';

const GestionDepartamentos = ({ currentUser }) => {
    const [departamentos, setDepartamentos] = useState([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', piso: '' });
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [filtroPiso, setFiltroPiso] = useState('');

    const pisos = ['Planta Baja', 'Mezanina', 'Piso 1', 'Piso 2', 'Piso 3', 'Piso 4', 'Piso 5', 'Piso 6'];

    useEffect(() => {
        cargarDepartamentos();
    }, []);

    useEffect(() => {
        filtrarDepartamentos();
    }, [terminoBusqueda, filtroPiso, departamentos]);

    const cargarDepartamentos = async () => {
        setLoading(true);
        const data = await getDepartamentos();
        setDepartamentos(data);
        setDepartamentosFiltrados(data);
        setLoading(false);
    };

    const filtrarDepartamentos = () => {
        let filtrados = [...departamentos];

        // Filtrar por término de búsqueda (nombre)
        if (terminoBusqueda.trim()) {
            filtrados = filtrados.filter(depto =>
                depto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
            );
        }

        // Filtrar por piso
        if (filtroPiso) {
            filtrados = filtrados.filter(depto => depto.piso === filtroPiso);
        }

        setDepartamentosFiltrados(filtrados);
    };

    const limpiarFiltros = () => {
        setTerminoBusqueda('');
        setFiltroPiso('');
    };

    const mostrarNotificacion = (texto, tipo) => {
        setMensaje({ texto, tipo });
        setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nombre.trim()) {
            mostrarNotificacion('El nombre del departamento es obligatorio', 'error');
            return;
        }

        let result;
        if (editando) {
            result = await actualizarDepartamento(editando.id, formData);
        } else {
            result = await crearDepartamento(formData);
        }

        if (result.success) {
            mostrarNotificacion(editando ? 'Departamento actualizado' : 'Departamento creado', 'success');
            setShowModal(false);
            setEditando(null);
            setFormData({ nombre: '', piso: '' });
            cargarDepartamentos();
        } else {
            mostrarNotificacion(result.error || 'Error al guardar', 'error');
        }
    };

    const handleEdit = (depto) => {
        setEditando(depto);
        setFormData({ nombre: depto.nombre, piso: depto.piso || '' });
        setShowModal(true);
    };

    const handleDelete = async (depto) => {
        if (window.confirm(`¿Eliminar el departamento "${depto.nombre}"?`)) {
            const result = await eliminarDepartamento(depto.id);
            if (result.success) {
                mostrarNotificacion('Departamento eliminado', 'success');
                cargarDepartamentos();
            } else {
                mostrarNotificacion(result.error || 'Error al eliminar', 'error');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Cargando departamentos...</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#1e3c72] flex items-center gap-2">
                        🏢 Gestión de Departamentos
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Administra los departamentos disponibles para registrar equipos
                    </p>
                </div>
                <button
                    onClick={() => { setEditando(null); setFormData({ nombre: '', piso: '' }); setShowModal(true); }}
                    className="px-4 py-2 bg-gradient-to-r from-[#1e3c72] to-[#2a5298] text-white rounded-lg hover:shadow-lg flex items-center gap-2"
                >
                    <Plus size={18} />
                    Nuevo Departamento
                </button>
            </div>

            {mensaje.texto && (
                <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                    mensaje.tipo === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {mensaje.tipo === 'success' ? '✅' : '❌'} {mensaje.texto}
                </div>
            )}

            {/* Barra de búsqueda y filtros */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Búsqueda por nombre */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre del departamento..."
                            value={terminoBusqueda}
                            onChange={(e) => setTerminoBusqueda(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Filtro por piso */}
                    <div className="md:w-64">
                        <select
                            value={filtroPiso}
                            onChange={(e) => setFiltroPiso(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos los pisos</option>
                            {pisos.map(piso => (
                                <option key={piso} value={piso}>{piso}</option>
                            ))}
                        </select>
                    </div>

                    {/* Botón limpiar filtros */}
                    {(terminoBusqueda || filtroPiso) && (
                        <button
                            onClick={limpiarFiltros}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>

                {/* Resultado de la búsqueda */}
                {!loading && (
                    <div className="mt-2 text-sm text-gray-500">
                        Mostrando {departamentosFiltrados.length} de {departamentos.length} departamentos
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departamentosFiltrados.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        {terminoBusqueda || filtroPiso 
                            ? 'No se encontraron departamentos con los filtros seleccionados.'
                            : 'No hay departamentos registrados. Crea el primero.'}
                    </div>
                ) : (
                    departamentosFiltrados.map((depto) => (
                        <div key={depto.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                    <Building size={24} className="text-blue-500 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{depto.nombre}</h3>
                                        {depto.piso && (
                                            <p className="text-sm text-gray-500">📍 {depto.piso}</p>
                                        )}
                                    </div>
                                </div>
                                {currentUser?.rol === 'admin' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(depto)} className="text-blue-500 hover:text-blue-700 p-1" title="Editar">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(depto)} className="text-red-500 hover:text-red-700 p-1" title="Eliminar">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-[#1e3c72]">
                                {editando ? 'Editar Departamento' : 'Nuevo Departamento'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nombre del Departamento *
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ej: RECEPCION DEL DESPACHO"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Piso (opcional)
                                </label>
                                <select
                                    name="piso"
                                    value={formData.piso}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccione un piso</option>
                                    {pisos.map(piso => (
                                        <option key={piso} value={piso}>{piso}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                                    Cancelar
                                </button>
                                <button type="submit" className="px-4 py-2 bg-[#1e3c72] text-white rounded-lg hover:bg-[#2a5298]">
                                    {editando ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionDepartamentos;