import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { getEquipos } from '../services/api';

const ModalEditar = ({ equipo, onClose, setEquipos }) => {
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
    observaciones: '',
    // Campos específicos
    marca: '',
    modelo: '',
    serial: '',
    tamano: '',
    resolucion: '',
    tipo_pantalla: '',
    puertos: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (equipo) {
      setFormData({
        codigo_equipo: equipo.codigo_equipo || '',
        tipo: equipo.tipo || '',
        usuario_asignado: equipo.usuario_asignado || '',
        ubicacion: equipo.ubicacion || '',
        procesador: equipo.procesador || '',
        ram: equipo.ram || '',
        disco_duro: equipo.disco_duro || '',
        sistema_operativo: equipo.sistema_operativo || '',
        estado: equipo.estado || '',
        uso: equipo.uso || '',
        observaciones: equipo.observaciones || '',
        marca: equipo.marca || '',
        modelo: equipo.modelo || '',
        serial: equipo.serial || '',
        tamano: equipo.tamano || '',
        resolucion: equipo.resolucion || '',
        tipo_pantalla: equipo.tipo_pantalla || '',
        puertos: equipo.puertos || ''
      });
    }
  }, [equipo]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

    // Crear FormData para enviar (igual que en creación)
    const formDataToSend = new FormData();
    
    // Agregar todos los campos
    formDataToSend.append('codigo_equipo', formData.codigo_equipo);
    formDataToSend.append('tipo', formData.tipo);
    formDataToSend.append('uso', formData.uso);
    formDataToSend.append('usuario_asignado', formData.usuario_asignado);
    formDataToSend.append('ubicacion', formData.ubicacion);
    formDataToSend.append('procesador', formData.procesador);
    formDataToSend.append('ram', formData.ram);
    formDataToSend.append('disco_duro', formData.disco_duro);
    formDataToSend.append('sistema_operativo', formData.sistema_operativo);
    formDataToSend.append('estado', formData.estado);
    formDataToSend.append('observaciones', formData.observaciones);
    formDataToSend.append('marca', formData.marca);
    formDataToSend.append('modelo', formData.modelo);
    formDataToSend.append('serial', formData.serial);
    formDataToSend.append('tamano', formData.tamano);
    formDataToSend.append('resolucion', formData.resolucion);
    formDataToSend.append('tipo_pantalla', formData.tipo_pantalla);
    formDataToSend.append('puertos', formData.puertos);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/equipos/${equipo.id}/`, {
        method: 'PUT',
        body: formDataToSend,
        headers: token ? { 'Authorization': `Token ${token}` } : {}
      });

      if (response.ok) {
        const nuevosEquipos = await getEquipos();
        setEquipos(nuevosEquipos);
        mostrarNotificacion('Equipo actualizado exitosamente', 'success');
        onClose();
      } else {
        const error = await response.json();
        console.error('Error:', error);
        mostrarNotificacion(error.message || 'Error al actualizar el equipo', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarNotificacion('Error de conexión', 'error');
    }

    setLoading(false);
  };

  if (!equipo) return null;

  // Determinar qué campos mostrar según el tipo de equipo
  const esComputadora = formData.tipo === 'computadora_escritorio' || formData.tipo === 'laptop';
  const esImpresora = formData.tipo === 'impresora';
  const esMonitor = formData.tipo === 'monitor';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-[#1e3c72]">✏️ Editar Equipo: {equipo.codigo_equipo}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Código del Equipo</label>
              <input
                type="text"
                name="codigo_equipo"
                value={formData.codigo_equipo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">El código no se puede modificar</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Tipo de Equipo</label>
              <input
                type="text"
                value={formData.tipo === 'computadora_escritorio' ? '💻 Computadora' : formData.tipo === 'impresora' ? '🖨️ Impresora' : '🖥️ Monitor'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">El tipo no se puede modificar</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Clasificación de Uso *</label>
              <select
                name="uso"
                value={formData.uso}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="critico">🔴 Crítico</option>
                <option value="importante">🟡 Importante</option>
                <option value="basico">🟢 Básico</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Usuario Asignado *</label>
              <input
                type="text"
                name="usuario_asignado"
                value={formData.usuario_asignado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Estado *</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="bueno">✅ Bueno (Óptimo)</option>
                <option value="regular">⚠️ Regular</option>
                <option value="malo">❌ Malo (Dañado)</option>
              </select>
            </div>

            {/* Campos específicos para Computadora */}
            {esComputadora && (
              <>
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
              </>
            )}

            {/* Campos específicos para Impresora */}
            {esImpresora && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Marca</label>
                  <input
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Modelo</label>
                  <input
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Número de Serial</label>
                  <input
                    type="text"
                    name="serial"
                    value={formData.serial}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </>
            )}

            {/* Campos específicos para Monitor */}
            {esMonitor && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Marca</label>
                  <input
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Modelo</label>
                  <input
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Tamaño (pulgadas)</label>
                  <input
                    type="text"
                    name="tamano"
                    value={formData.tamano}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Resolución</label>
                  <select
                    name="resolucion"
                    value={formData.resolucion}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccione</option>
                    <option value="HD (1366x768)">HD (1366x768)</option>
                    <option value="Full HD (1920x1080)">Full HD (1920x1080)</option>
                    <option value="2K (2560x1440)">2K (2560x1440)</option>
                    <option value="4K (3840x2160)">4K (3840x2160)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Tipo de Pantalla</label>
                  <select
                    name="tipo_pantalla"
                    value={formData.tipo_pantalla}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccione</option>
                    <option value="LED">LED</option>
                    <option value="LCD">LCD</option>
                    <option value="OLED">OLED</option>
                    <option value="IPS">IPS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Puertos</label>
                  <input
                    type="text"
                    name="puertos"
                    value={formData.puertos}
                    onChange={handleChange}
                    placeholder="Ej: HDMI, VGA, DisplayPort"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </>
            )}
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ModalEditar;