import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { updateEquipo, getEquipos } from '../services/api';

const ModalEditar = ({ equipo, onClose, setEquipos }) => {
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (equipo) {
      setFormData({
        tipo: equipo.tipo || '',
        usuario_asignado: equipo.usuario_asignado || '',
        ubicacion: equipo.ubicacion || '',
        procesador: equipo.procesador || '',
        ram: equipo.ram || '',
        disco_duro: equipo.disco_duro || '',
        sistema_operativo: equipo.sistema_operativo || '',
        estado: equipo.estado || '',
        uso: equipo.uso || '',
        observaciones: equipo.observaciones || ''
      });
    }
  }, [equipo]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await updateEquipo(equipo.id, formData);
    
    if (result.success) {
      const nuevosEquipos = await getEquipos();
      setEquipos(nuevosEquipos);
      onClose();
      mostrarNotificacion('Equipo actualizado exitosamente', 'success');
    } else {
      mostrarNotificacion('Error al actualizar el equipo', 'error');
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

  if (!equipo) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-[#1e3c72]">Editar Equipo: {equipo.codigo_equipo}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Tipo de Equipo</label>
              <input
                type="text"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Usuario Asignado</label>
              <input
                type="text"
                name="usuario_asignado"
                value={formData.usuario_asignado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Ubicación</label>
              <input
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Procesador</label>
              <input
                type="text"
                name="procesador"
                value={formData.procesador}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">RAM</label>
              <input
                type="text"
                name="ram"
                value={formData.ram}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Disco Duro</label>
              <input
                type="text"
                name="disco_duro"
                value={formData.disco_duro}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Sistema Operativo</label>
              <input
                type="text"
                name="sistema_operativo"
                value={formData.sistema_operativo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="optimo">Óptimo</option>
                <option value="regular">Regular</option>
                <option value="danado">Dañado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Clasificación de Uso</label>
              <select
                name="uso"
                value={formData.uso}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="critico">🔴 Crítico</option>
                <option value="importante">🟡 Importante</option>
                <option value="basico">🟢 Básico</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-[#1e3c72] to-[#2a5298] text-white rounded-md hover:transform hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditar;