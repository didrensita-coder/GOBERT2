import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, RotateCcw, ArrowLeft } from 'lucide-react';
import { createEquipo, getEquipos } from '../services/api';

const FormularioComputadora = ({ equipos, setEquipos }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    codigo_equipo: '',
    tipo: 'computadora_escritorio',
    usuario_asignado: '',
    ubicacion: '',
    procesador: '',
    ram: '',
    disco_duro: '',
    sistema_operativo: '',
    estado: '',
    observaciones: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const mostrarNotificacion = (mensaje, tipo) => {
    const bgColor = tipo === 'success' ? '#27ae60' : '#e74c3c';
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 80px; right: 20px; padding: 16px 24px;
      background: ${bgColor}; color: white; border-radius: 12px;
      font-weight: bold; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    notification.innerHTML = `${tipo === 'success' ? '✅' : '❌'} ${mensaje}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await createEquipo(formData);
    if (result.success) {
      const nuevosEquipos = await getEquipos();
      setEquipos(nuevosEquipos);
      mostrarNotificacion('¡Computadora registrada exitosamente!', 'success');
      setTimeout(() => navigate('/dashboard/resumen'), 1500);
    } else {
      mostrarNotificacion('Error al registrar la computadora', 'error');
    }
    setLoading(false);
  };

  const handleReset = () => {
    setFormData({
      codigo_equipo: '',
      tipo: 'computadora_escritorio',
      usuario_asignado: '',
      ubicacion: '',
      procesador: '',
      ram: '',
      disco_duro: '',
      sistema_operativo: '',
      estado: '',
      observaciones: ''
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <button
        onClick={() => navigate('/seleccionar-tipo')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
      >
        <ArrowLeft size={18} />
        Volver a seleccionar tipo
      </button>

      <h2 className="text-xl font-bold text-[#1e3c72] mb-6">Registrar Computadora</h2>
      
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
            <label className="block text-xs font-semibold text-gray-700 mb-2">Estado *</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2a5298]"
              required
            >
              <option value="">Seleccione un estado</option>
              <option value="bueno">✅ Bueno (Óptimo)</option>
              <option value="regular">⚠️ Regular</option>
              <option value="malo">❌ Malo (Dañado)</option>
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
            {loading ? 'Guardando...' : 'Guardar Computadora'}
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

export default FormularioComputadora;