import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, RotateCcw, ArrowLeft, ChevronRight, ChevronLeft, AlertCircle, Star, Heart, Printer, AlertTriangle } from 'lucide-react';
import { getEquipos, createEquipo, getDepartamentos } from '../services/api';
import ImageUpload from './ImageUpload';

const FormularioImpresora = ({ equipos, setEquipos }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [photoFile, setPhotoFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [departamentosList, setDepartamentosList] = useState([]);

  const [formData, setFormData] = useState({
    codigo_equipo: '',
    marca: '',
    modelo: '',
    serial: '',
    piso: '',
    departamento: '',
    uso: '',
    estado: '',
    observaciones: ''
  });

  useEffect(() => {
    const cargarDepartamentos = async () => {
      const data = await getDepartamentos();
      setDepartamentosList(data);
    };
    cargarDepartamentos();
  }, []);

  // Filtrar departamentos según el piso seleccionado
  const departamentosFiltrados = formData.piso 
    ? departamentosList.filter(depto => depto.piso === formData.piso)
    : departamentosList;

  const opcionesUso = [
    { id: 'critico', nombre: '🔴 EQUIPO CRÍTICO', descripcion: 'Impresión indispensable para operaciones diarias', color: 'red', bg: 'bg-red-50', border: 'border-red-400', icon: AlertCircle },
    { id: 'importante', nombre: '🟡 EQUIPO IMPORTANTE', descripcion: 'Uso frecuente en el área', color: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-400', icon: Star },
    { id: 'basico', nombre: '🟢 EQUIPO BÁSICO', descripcion: 'Uso ocasional o respaldo', color: 'green', bg: 'bg-green-50', border: 'border-green-400', icon: Heart }
  ];

  const pisos = ['Planta Baja', 'Mezanina', 'Piso 1', 'Piso 2', 'Piso 3', 'Piso 4', 'Piso 5', 'Piso 6'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Si cambia el piso, resetear el departamento seleccionado
    if (name === 'piso') {
      setFormData(prev => ({ ...prev, departamento: '' }));
    }
    
    if (errorMessage) setErrorMessage('');
  };

  const mostrarNotificacion = (mensaje, tipo, duracion = 3000) => {
    const bgColor = tipo === 'success' ? '#10b981' : tipo === 'warning' ? '#f59e0b' : '#ef4444';
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 80px; right: 20px; padding: 16px 24px;
      background: ${bgColor}; color: white; border-radius: 12px;
      font-weight: bold; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease;
      z-index: 10000;
    `;
    notification.innerHTML = `${tipo === 'success' ? '✅' : tipo === 'warning' ? '⚠️' : '❌'} ${mensaje}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), duracion);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    const formDataToSend = new FormData();
    formDataToSend.append('codigo_equipo', formData.codigo_equipo);
    formDataToSend.append('tipo', 'impresora');
    formDataToSend.append('uso', formData.uso);
    formDataToSend.append('usuario_asignado', formData.marca);
    formDataToSend.append('piso', formData.piso);
    formDataToSend.append('departamento', formData.departamento);
    formDataToSend.append('procesador', `Marca: ${formData.marca} | Modelo: ${formData.modelo} | Serial: ${formData.serial}`);
    formDataToSend.append('ram', 'N/A');
    formDataToSend.append('disco_duro', 'N/A');
    formDataToSend.append('sistema_operativo', 'N/A');
    formDataToSend.append('marca', formData.marca);
    formDataToSend.append('modelo', formData.modelo);
    formDataToSend.append('serial', formData.serial);
    formDataToSend.append('estado', formData.estado);
    formDataToSend.append('observaciones', formData.observaciones);
    
    if (photoFile) {
      formDataToSend.append('foto', photoFile);
    }
    
    const result = await createEquipo(formDataToSend);
    
    if (result.success) {
      const nuevosEquipos = await getEquipos();
      setEquipos(nuevosEquipos);
      mostrarNotificacion('🖨️ ¡Impresora registrada exitosamente!', 'success');
      setTimeout(() => navigate('/dashboard/inventario'), 1500);
    } else {
      const errorMsg = result.error || '';
      if (errorMsg.includes('código') || errorMsg.includes('unique') || errorMsg.includes('Ya existe')) {
        setErrorMessage(`El código "${formData.codigo_equipo}" ya está en uso. Por favor, usa un código diferente.`);
        mostrarNotificacion(`❌ El código "${formData.codigo_equipo}" ya existe. Usa otro código.`, 'warning', 5000);
        setStep(2);
      } else {
        setErrorMessage(errorMsg || 'Error al registrar la impresora');
        mostrarNotificacion(`❌ ${errorMsg || 'Error al registrar'}`, 'error');
      }
    }
    
    setLoading(false);
  };

  const handleReset = () => {
    setFormData({
      codigo_equipo: '',
      marca: '',
      modelo: '',
      serial: '',
      piso: '',
      departamento: '',
      uso: '',
      estado: '',
      observaciones: ''
    });
    setPhotoFile(null);
    setErrorMessage('');
    setStep(1);
  };

  const nextStep = () => {
    if (step === 1 && !formData.uso) {
      mostrarNotificacion('⚠️ Por favor, selecciona una clasificación de uso', 'warning', 2000);
      return;
    }
    if (step === 2) {
      if (!formData.codigo_equipo) {
        mostrarNotificacion('⚠️ El código del equipo es obligatorio', 'warning', 2000);
        return;
      }
      if (!formData.marca) {
        mostrarNotificacion('⚠️ La marca es obligatoria', 'warning', 2000);
        return;
      }
      if (!formData.modelo) {
        mostrarNotificacion('⚠️ El modelo es obligatorio', 'warning', 2000);
        return;
      }
      if (!formData.serial) {
        mostrarNotificacion('⚠️ El número de serial es obligatorio', 'warning', 2000);
        return;
      }
      if (!formData.piso) {
        mostrarNotificacion('⚠️ El piso es obligatorio', 'warning', 2000);
        return;
      }
      if (!formData.departamento) {
        mostrarNotificacion('⚠️ El departamento es obligatorio', 'warning', 2000);
        return;
      }
      if (!formData.estado) {
        mostrarNotificacion('⚠️ El estado es obligatorio', 'warning', 2000);
        return;
      }
    }
    setStep(step + 1);
    setErrorMessage('');
  };
  
  const prevStep = () => {
    setStep(step - 1);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/seleccionar-tipo')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm">
          <ArrowLeft size={18} /> Volver a seleccionar tipo
        </button>

        <div className="bg-white rounded-2xl shadow-xl mb-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              🖨️ Registrar Impresora
            </h2>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${step >= s ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                    ${step === s ? 'ring-4 ring-blue-200 scale-110' : ''}`}>
                    {s}
                  </div>
                  <p className="text-xs mt-1 text-gray-500 hidden sm:block">
                    {s === 1 && 'Clasificación'}
                    {s === 2 && 'Datos Básicos'}
                    {s === 3 && 'Foto'}
                    {s === 4 && 'Información'}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }} />
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-400 rounded-xl flex items-start gap-3 animate-fadeIn">
            <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="font-semibold text-red-700">Error</p>
              <p className="text-red-600 text-sm">{errorMessage}</p>
            </div>
            <button onClick={() => setErrorMessage('')} className="text-red-500 hover:text-red-700">✕</button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-8">
              {step === 1 && (
                <div className="animate-fadeIn">
                  <div className="text-center mb-8">
                    <Printer size={48} className="mx-auto text-blue-500 mb-3" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Clasificación de la Impresora</h3>
                    <p className="text-gray-500">Selecciona el nivel de importancia para este equipo</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {opcionesUso.map((opcion) => {
                      const Icon = opcion.icon;
                      return (
                        <button
                          key={opcion.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, uso: opcion.id })}
                          className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 text-left
                            ${formData.uso === opcion.id 
                              ? `${opcion.bg} ${opcion.border} shadow-lg ring-2 ring-${opcion.color}-200` 
                              : 'border-gray-200 hover:border-blue-300'}`}
                        >
                          <Icon size={40} className={`mb-3 ${formData.uso === opcion.id ? `text-${opcion.color}-500` : 'text-gray-400'}`} />
                          <p className="font-bold text-lg mb-1">{opcion.nombre}</p>
                          <p className="text-sm text-gray-600">{opcion.descripcion}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-fadeIn">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">📋 Datos de la Impresora</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Código del Equipo <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="codigo_equipo" 
                        value={formData.codigo_equipo} 
                        onChange={handleChange}
                        placeholder="Ej: IMP-001, IMP-002"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500
                          ${errorMessage.includes('código') ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                        required 
                      />
                      {errorMessage.includes('código') && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertTriangle size={12} /> El código ya existe, elige otro
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Marca <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="marca" value={formData.marca} onChange={handleChange}
                        placeholder="Ej: HP, Epson, Canon, Brother"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Modelo <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="modelo" value={formData.modelo} onChange={handleChange}
                        placeholder="Ej: LaserJet Pro M15w, L3110"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Número de Serial <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="serial" value={formData.serial} onChange={handleChange}
                        placeholder="Ej: CNB9J5K7L2, X1Y2Z3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Piso <span className="text-red-500">*</span>
                      </label>
                      <select name="piso" value={formData.piso} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required>
                        <option value="">Seleccione un piso</option>
                        {pisos.map(piso => (
                          <option key={piso} value={piso}>{piso}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Departamento <span className="text-red-500">*</span>
                      </label>
                      <select 
                        name="departamento" 
                        value={formData.departamento} 
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Seleccione un departamento</option>
                        {departamentosFiltrados.map(depto => (
                          <option key={depto.id} value={depto.id}>{depto.nombre}</option>
                        ))}
                      </select>
                      {formData.piso && departamentosFiltrados.length === 0 && (
                        <p className="text-xs text-yellow-500 mt-1">
                          ⚠️ No hay departamentos registrados en este piso. Crea uno en "Gestión de Departamentos".
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Estado <span className="text-red-500">*</span>
                      </label>
                      <select name="estado" value={formData.estado} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required>
                        <option value="">Seleccione un estado</option>
                        <option value="bueno">✅ Bueno (Funciona correctamente)</option>
                        <option value="regular">⚠️ Regular (Algunos problemas)</option>
                        <option value="malo">❌ Malo (No funciona)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-fadeIn">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">📸 Foto de la Impresora</h3>
                  <ImageUpload
                    onImageChange={setPhotoFile}
                    tipo="equipo"
                    label="Foto de la Impresora"
                  />
                </div>
              )}

              {step === 4 && (
                <div className="animate-fadeIn">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">📝 Información Adicional</h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Observaciones</label>
                    <textarea
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Notas adicionales sobre la impresora (tipo de tinta, velocidad de impresión, problemas conocidos, etc.)..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t">
                {step > 1 && (
                  <button type="button" onClick={prevStep}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 transition">
                    <ChevronLeft size={18} /> Anterior
                  </button>
                )}
                {step < 4 && (
                  <button type="button" onClick={nextStep}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:shadow-lg ml-auto flex items-center gap-2 transition">
                    Siguiente <ChevronRight size={18} />
                  </button>
                )}
                {step === 4 && (
                  <div className="ml-auto flex gap-3">
                    <button type="button" onClick={handleReset}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 transition">
                      <RotateCcw size={16} /> Limpiar todo
                    </button>
                    <button type="submit" disabled={loading}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-lg flex items-center gap-2 disabled:opacity-50 transition">
                      <Save size={16} />
                      {loading ? 'Guardando...' : 'Guardar Impresora'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FormularioImpresora;