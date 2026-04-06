import React, { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { createEquipo, getEquipos } from '../services/api';

const AgregarEquipo = ({ equipos, setEquipos }) => {
  const [formData, setFormData] = useState({
    codigo_equipo: '',
    tipo: '',
    usuario_asignado: '',
    ubicacion: '',
    procesador: '',
    ram: '',
    disco_duro: '',
    sistema_operativo: '',
    estado: '',
    uso: '',
    observaciones: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (equipos.length >= 999) {
      mostrarNotificacion('Límite máximo de 999 equipos alcanzado', 'error');
      return;
    }

    setLoading(true);
    const result = await createEquipo(formData);
    
    if (result.success) {
      const nuevosEquipos = await getEquipos();
      setEquipos(nuevosEquipos);
      setFormData({
        codigo_equipo: '',
        tipo: '',
        usuario_asignado: '',
        ubicacion: '',
        procesador: '',
        ram: '',
        disco_duro: '',
        sistema_operativo: '',
        estado: '',
        uso: '',
        observaciones: ''
      });
      mostrarNotificacion('Equipo registrado exitosamente', 'success');
    } else {
      mostrarNotificacion('Error al registrar el equipo', 'error');
    }
    setLoading(false);
  };

  const mostrarNotificacion = (mensaje, tipo) => {
    const notification = document.createElement('div');
    notification.className = `fixed top-5 right-5 px-5 py-4 rounded-lg text-white font-medium z-50 animate-slideIn bg-${tipo === 'success' ? 'green' : 'red'}-500`;
    notification.textContent = mensaje;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add('animate-slideOut');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const handleReset = () => {
    setFormData({
      codigo_equipo: '',
      tipo: '',
      usuario_asignado: '',
      ubicacion: '',
      procesador: '',
      ram: '',
      disco_duro: '',
      sistema_operativo: '',
      estado: '',
      uso: '',
      observaciones: ''
    });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-[#1e3c72] mb-6">Registrar Nuevo Equipo</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Código del Equipo *</label>
            <input
              type="text"
              name="codigo_equipo"
              value={formData.codigo_equipo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2a5298]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Tipo de Equipo *</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2a5298]"
              required
            >
              <option value="">Seleccione un tipo</option>
              <option value="Computadora Escritorio">Computadora Escritorio</option>
              <option value="Laptop">Laptop</option>
              <option value="Servidor">Servidor</option>
              <option value="Impresora">Impresora</option>
              <option value="Monitor">Monitor</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Usuario Asignado *</label>
            <input
              type="text"
              name="usuario_asignado"
              value={formData.usuario_asignado}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2a5298]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Ubicación *</label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2a5298]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Procesador</label>
            <input
              type="text"
              name="procesador"
              value={formData.procesador}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2a5298]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">RAM</label>
            <input
              type="text"
              name="ram"
              value={formData.ram}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2a5298]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Disco Duro</label>
            <input
              type="text"
              name="disco_duro"
              value={formData.disco_duro}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2a5298]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Sistema Operativo</label>
            <input
              type="text"
              name="sistema_operativo"
              value={formData.sistema_operativo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2a5298]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Estado *</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2a5298]"
              required
            >
              <option value="">Seleccione un estado</option>
              <option value="optimo">Óptimo</option>
              <option value="regular">Regular</option>
              <option value="danado">Dañado</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Clasificación de Uso *</label>
            <select
              name="uso"
              value={formData.uso}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2a5298]"
              required
            >
              <option value="">Seleccione clasificación</option>
              <option value="critico">🔴 Crítico (Administración, Servidores)</option>
              <option value="importante">🟡 Importante (Uso diario)</option>
              <option value="basico">🟢 Básico (Uso ocasional)</option>
            </select>
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-700 mb-2">Observaciones</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2a5298]"
          ></textarea>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-gradient-to-r from-[#1e3c72] to-[#2a5298] text-white rounded-md hover:transform hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? 'Guardando...' : 'Guardar Equipo'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarEquipo;