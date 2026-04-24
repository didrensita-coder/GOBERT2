// FormularioImpresora.jsx - CON MANEJO DE ERROR DE CÓDIGO DUPLICADO
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, RotateCcw, ArrowLeft, Upload, Camera, ChevronRight, ChevronLeft, AlertCircle, Star, Heart, Printer, AlertTriangle } from 'lucide-react';
import { getEquipos } from '../services/api';

const FormularioImpresora = ({ equipos, setEquipos }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    codigo_equipo: '',
    marca: '',
    modelo: '',
    serial: '',
    ubicacion: '',
    uso: '',
    estado: '',
    observaciones: ''
  });

  const opcionesUso = [
    { id: 'critico', nombre: '🔴 EQUIPO CRÍTICO', descripcion: 'Impresión indispensable para operaciones diarias', color: 'red', bg: 'bg-red-50', border: 'border-red-400', icon: AlertCircle },
    { id: 'importante', nombre: '🟡 EQUIPO IMPORTANTE', descripcion: 'Uso frecuente en el área', color: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-400', icon: Star },
    { id: 'basico', nombre: '🟢 EQUIPO BÁSICO', descripcion: 'Uso ocasional o respaldo', color: 'green', bg: 'bg-green-50', border: 'border-green-400', icon: Heart }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiar error cuando el usuario empieza a escribir
    if (errorMessage) setErrorMessage('');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
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
    formDataToSend.append('ubicacion', formData.ubicacion);
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
    
    try {
      const response = await fetch('http://localhost:8000/api/equipos/', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const nuevosEquipos = await getEquipos();
        setEquipos(nuevosEquipos);
        mostrarNotificacion('🖨️ ¡Impresora registrada exitosamente!', 'success');
        setTimeout(() => navigate('/dashboard/inventario'), 1500);
      } else {
        // Manejar diferentes tipos de errores
        if (data.error === 'duplicate_code' || 
            (data.message && data.message.includes('código')) ||
            (data.codigo_equipo && data.codigo_equipo[0] === 'equipo with this codigo equipo already exists.')) {
          
          setErrorMessage(`El código "${formData.codigo_equipo}" ya está en uso. Por favor, usa un código diferente.`);
          mostrarNotificacion(`❌ El código "${formData.codigo_equipo}" ya existe. Usa otro código.`, 'warning', 5000);
          
          // Volver al paso 2 para que el usuario corrija el código
          setStep(2);
          
        } else if (data.message) {
          setErrorMessage(data.message);
          mostrarNotificacion(`❌ ${data.message}`, 'error');
        } else {
          setErrorMessage('Error al registrar la impresora. Verifica los datos, puede que este Código de quipo ya existe en la base de datos.');
          mostrarNotificacion('❌ Error al registrar la impresora. Este Código de quipo ya existe.', 'error');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error de conexión con el servidor');
      mostrarNotificacion('❌ Error de conexión', 'error');
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
      uso: '',
      estado: '',
      observaciones: ''
    });
    setPhotoPreview(null);
    setPhotoFile(null);
    setErrorMessage('');
    setStep(1);
  };

  const nextStep = () => {
    // Validar campos obligatorios antes de avanzar
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
      if (!formData.ubicacion) {
        mostrarNotificacion('⚠️ La ubicación es obligatoria', 'warning', 2000);
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

        {/* Progress Steps */}
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

        {/* Mostrar error general */}
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
              {/* PASO 1: CLASIFICACIÓN POR USO */}
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

              {/* PASO 2: DATOS BÁSICOS */}
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
                        Ubicación <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleChange}
                        placeholder="Ej: Recepción, Oficina 203, Sala de impresión"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required />
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

              {/* PASO 3: FOTO DEL EQUIPO */}
              {step === 3 && (
                <div className="animate-fadeIn">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">📸 Foto de la Impresora</h3>
                  <div className="flex justify-center">
                    <div className="w-full max-w-md">
                      <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all
                        ${photoPreview ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'}`}>
                        {photoPreview ? (
                          <div className="relative">
                            <img src={photoPreview} alt="Preview" className="mx-auto max-h-64 rounded-lg shadow-lg" />
                            <button type="button" onClick={() => { setPhotoPreview(null); setPhotoFile(null); }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition">
                              ✕
                            </button>
                            <p className="mt-3 text-sm text-green-600">✓ Foto cargada exitosamente</p>
                          </div>
                        ) : (
                          <>
                            <Camera size={64} className="mx-auto text-gray-400 mb-4" />
                            <label className="cursor-pointer bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-lg hover:shadow-lg inline-flex items-center gap-2 transition">
                              <Upload size={18} /> Subir foto de la impresora
                              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                            </label>
                            <p className="text-xs text-gray-500 mt-3">PNG, JPG o JPEG (máx. 5MB)</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 4: INFORMACIÓN ADICIONAL */}
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

              {/* Botones de navegación */}
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