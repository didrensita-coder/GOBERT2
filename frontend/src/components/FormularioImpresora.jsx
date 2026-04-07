import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, RotateCcw, ArrowLeft } from 'lucide-react';
import { createEquipo, getEquipos } from '../services/api';

const FormularioImpresora = ({ equipos, setEquipos }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    codigo_equipo: '',
    marca: '',
    modelo: '',
    serial: '',
    ubicacion: '',
    estado: '',
    observaciones: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const mostrarNotificacion = (mensaje, tipo) => {
    const bgColor = tipo === 'success' ? '#27ae60' : '#e74c3c';
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 80px; right: 20px; padding: 16px 24px;
      background: ${bgColor}; color: white; border-radius: 12px;
      font-weight: bold; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `${tipo === 'success' ? '✅' : '❌'} ${mensaje}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Preparar datos para enviar al backend - USANDO LOS CAMPOS CORRECTOS
    const equipoData = {
      codigo_equipo: formData.codigo_equipo,
      tipo: 'impresora',
      usuario_asignado: formData.marca,  // Marca va en usuario_asignado
      ubicacion: formData.ubicacion,
      procesador: `Marca: ${formData.marca} | Modelo: ${formData.modelo} | Serial: ${formData.serial}`,
      ram: 'N/A',
      disco_duro: 'N/A',
      sistema_operativo: 'N/A',
      marca: formData.marca,      // ← Campo nuevo
      modelo: formData.modelo,    // ← Campo nuevo
      serial: formData.serial,    // ← Campo nuevo
      estado: formData.estado,
      observaciones: formData.observaciones
    };
    
    console.log('Enviando a Django:', equipoData);
    
    const result = await createEquipo(equipoData);
    console.log('Respuesta:', result);
    
    if (result.success) {
      const nuevosEquipos = await getEquipos();
      setEquipos(nuevosEquipos);
      mostrarNotificacion('🖨️ ¡Impresora registrada exitosamente!', 'success');
      setTimeout(() => navigate('/dashboard/inventario'), 1500);
    } else {
      mostrarNotificacion('❌ Error al registrar la impresora', 'error');
    }
    setLoading(false);
  };

  const handleReset = () => {
    setFormData({
      codigo_equipo: '',
      marca: '',
      modelo: '',
      serial: '',
      ubicacion: '',
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

      <h2 className="text-xl font-bold text-[#1e3c72] mb-6">🖨️ Registrar Impresora</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Código *</label>
            <input
              type="text"
              name="codigo_equipo"
              value={formData.codigo_equipo}
              onChange={handleChange}
              placeholder="Ej: IMP-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2a5298]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Marca *</label>
            <input
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              placeholder="Ej: HP, Epson, Canon"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2a5298]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Modelo *</label>
            <input
              type="text"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              placeholder="Ej: LaserJet Pro M15w"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2a5298]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Número de Serial *</label>
            <input
              type="text"
              name="serial"
              value={formData.serial}
              onChange={handleChange}
              placeholder="Ej: CNB9J5K7L2"
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
              placeholder="Ej: Recepción, Oficina 203"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2a5298]"
              required
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
              <option value="bueno">✅ Bueno (Funciona correctamente)</option>
              <option value="regular">⚠️ Regular (Algunos problemas)</option>
              <option value="malo">❌ Malo (No funciona)</option>
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
            placeholder="Notas adicionales sobre la impresora..."
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
            {loading ? 'Guardando...' : 'Guardar Impresora'}
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

export default FormularioImpresora;