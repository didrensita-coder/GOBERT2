import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { getEquipos, getDepartamentos, updateEquipo } from '../services/api';

const ModalEditar = ({ equipo, onClose, setEquipos }) => {
  const [formData, setFormData] = useState({
    codigo_equipo: '',
    tipo: '',
    usuario_asignado: '',
    piso: '',
    departamento: '',
    procesador: '',
    ram: '',
    disco_duro: '',
    sistema_operativo: '',
    estado: '',
    uso: '',
    observaciones: '',
    marca: '',
    modelo: '',
    serial: '',
    tamano: '',
    resolucion: '',
    tipo_pantalla: '',
    puertos: ''
  });
  const [departamentosList, setDepartamentosList] = useState([]);
  const [loading, setLoading] = useState(false);

  const pisos = ['Planta Baja', 'Mezanina', 'Piso 1', 'Piso 2', 'Piso 3', 'Piso 4', 'Piso 5'];

  useEffect(() => {
    cargarDepartamentos();
    if (equipo) {
      setFormData({
        codigo_equipo: equipo.codigo_equipo || '',
        tipo: equipo.tipo || '',
        usuario_asignado: equipo.usuario_asignado || '',
        piso: equipo.piso || '',
        departamento: equipo.departamento?.id || equipo.departamento || '',
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

  const cargarDepartamentos = async () => {
    const data = await getDepartamentos();
    setDepartamentosList(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const mostrarNotificacion = (mensaje, tipo, duracion = 3000) => {
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
    setTimeout(() => notification.remove(), duracion);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('codigo_equipo', formData.codigo_equipo);
    formDataToSend.append('tipo', formData.tipo);
    formDataToSend.append('uso', formData.uso);
    formDataToSend.append('usuario_asignado', formData.usuario_asignado);
    formDataToSend.append('piso', formData.piso);
    formDataToSend.append('departamento', formData.departamento); // Esto debe ser un número ID
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
      const response = await fetch(`http://localhost:8000/api/equipos/${equipo.id}/`, {
        method: 'PUT',
        body: formDataToSend,
        credentials: 'include',
      });

      if (response.ok) {
        const nuevosEquipos = await getEquipos();
        setEquipos(nuevosEquipos);
        mostrarNotificacion('✅ Equipo actualizado exitosamente', 'success');
        onClose();
      } else {
        const error = await response.json();
        console.error('Error:', error);
        mostrarNotificacion(error.message || 'Error al actualizar', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarNotificacion('❌ Error de conexión', 'error');
    }

    setLoading(false);
  };

  if (!equipo) return null;

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
              <input type="text" name="codigo_equipo" value={formData.codigo_equipo} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" disabled />
              <p className="text-xs text-gray-400 mt-1">El código no se puede modificar</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Tipo de Equipo</label>
              <input type="text" value={formData.tipo === 'computadora_escritorio' ? '💻 Computadora' : formData.tipo === 'impresora' ? '🖨️ Impresora' : '🖥️ Monitor'} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" disabled />
              <p className="text-xs text-gray-400 mt-1">El tipo no se puede modificar</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Clasificación de Uso *</label>
              <select name="uso" value={formData.uso} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                <option value="critico">🔴 Crítico</option>
                <option value="importante">🟡 Importante</option>
                <option value="basico">🟢 Básico</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Usuario Asignado *</label>
              <input type="text" name="usuario_asignado" value={formData.usuario_asignado} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Piso *</label>
              <select name="piso" value={formData.piso} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                <option value="">Seleccione un piso</option>
                {pisos.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-2">Departamento *</label>
              <select name="departamento" value={formData.departamento} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                <option value="">Seleccione un departamento</option>
                {departamentosList.map(depto => (
                  <option key={depto.id} value={depto.id}>{depto.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Estado *</label>
              <select name="estado" value={formData.estado} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                <option value="bueno">✅ Bueno (Óptimo)</option>
                <option value="regular">⚠️ Regular</option>
                <option value="malo">❌ Malo (Dañado)</option>
              </select>
            </div>

            {esComputadora && (
              <>
                <div><input type="text" name="procesador" placeholder="Procesador" value={formData.procesador} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                <div><input type="text" name="ram" placeholder="RAM" value={formData.ram} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                <div><input type="text" name="disco_duro" placeholder="Disco Duro" value={formData.disco_duro} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                <div><input type="text" name="sistema_operativo" placeholder="Sistema Operativo" value={formData.sistema_operativo} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
              </>
            )}

            {esImpresora && (
              <>
                <div><input type="text" name="marca" placeholder="Marca" value={formData.marca} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                <div><input type="text" name="modelo" placeholder="Modelo" value={formData.modelo} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                <div><input type="text" name="serial" placeholder="Serial" value={formData.serial} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
              </>
            )}

            {esMonitor && (
              <>
                <div><input type="text" name="marca" placeholder="Marca" value={formData.marca} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                <div><input type="text" name="modelo" placeholder="Modelo" value={formData.modelo} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                <div><input type="text" name="tamano" placeholder="Tamaño (pulgadas)" value={formData.tamano} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                <div>
                  <select name="resolucion" value={formData.resolucion} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Resolución</option>
                    <option value="HD (1366x768)">HD (1366x768)</option>
                    <option value="Full HD (1920x1080)">Full HD (1920x1080)</option>
                    <option value="2K (2560x1440)">2K (2560x1440)</option>
                    <option value="4K (3840x2160)">4K (3840x2160)</option>
                  </select>
                </div>
                <div>
                  <select name="tipo_pantalla" value={formData.tipo_pantalla} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Tipo de Pantalla</option>
                    <option value="LED">LED</option>
                    <option value="LCD">LCD</option>
                    <option value="OLED">OLED</option>
                    <option value="IPS">IPS</option>
                  </select>
                </div>
                <div><input type="text" name="puertos" placeholder="Puertos" value={formData.puertos} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
              </>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Observaciones</label>
            <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="px-5 py-2 bg-gradient-to-r from-[#1e3c72] to-[#2a5298] text-white rounded-md flex items-center gap-2 disabled:opacity-50">
              <Save size={16} /> {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md">Cancelar</button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default ModalEditar;