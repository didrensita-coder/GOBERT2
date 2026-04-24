// FormularioComputadora.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, RotateCcw, ArrowLeft, Upload, Camera, ChevronRight, ChevronLeft, AlertCircle, Star, Heart, AlertTriangle } from 'lucide-react';
import { getEquipos } from '../services/api';

const FormularioComputadora = ({ equipos, setEquipos }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [codigoError, setCodigoError] = useState('');

  const [formData, setFormData] = useState({
    codigo_equipo: '',
    tipo: 'computadora_escritorio',
    uso: '',
    usuario_asignado: '',
    ubicacion: '',
    procesador: '',
    ram: '',
    disco_duro: '',
    sistema_operativo: '',
    estado: '',
    observaciones: ''
  });

  const opcionesUso = [
    { id: 'critico', nombre: '🔴 EQUIPO CRÍTICO', descripcion: 'Indispensable para operaciones diarias. No puede fallar.', color: 'red', bg: 'bg-red-50', border: 'border-red-400', icon: AlertCircle },
    { id: 'importante', nombre: '🟡 EQUIPO IMPORTANTE', descripcion: 'Utilizado frecuentemente. Requiere mantenimiento regular.', color: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-400', icon: Star },
    { id: 'basico', nombre: '🟢 EQUIPO BÁSICO', descripcion: 'Uso ocasional o de respaldo. No crítico.', color: 'green', bg: 'bg-green-50', border: 'border-green-400', icon: Heart }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'codigo_equipo') {
      setCodigoError('');
    }
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
    setCodigoError('');
    
    const formDataToSend = new FormData();
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
        mostrarNotificacion('💻 ¡Computadora registrada exitosamente!', 'success');
        setTimeout(() => navigate('/dashboard/inventario'), 1500);
      } else {
        if (data.error === 'duplicate_code' || 
            (data.message && data.message.includes('código'))) {
          setCodigoError(`El código "${formData.codigo_equipo}" ya está en uso. Por favor, usa un código diferente.`);
          setErrorMessage(`El código "${formData.codigo_equipo}" ya existe. Usa otro código.`);
          mostrarNotificacion(`❌ El código "${formData.codigo_equipo}" ya existe. Usa otro código.`, 'warning', 5000);
          setStep(2);
        } else if (data.message) {
          setErrorMessage(data.message);
          mostrarNotificacion(`❌ ${data.message}`, 'error');
        } else {
          setErrorMessage('Error al registrar la computadora. Verifica los datos, puede que el código de equipo ya exista en la base de datos.');
          mostrarNotificacion('❌ Error al registrar la computadora. Este Código de quipo ya existe.', 'error');
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
      tipo: 'computadora_escritorio',
      uso: '',
      usuario_asignado: '',
      ubicacion: '',
      procesador: '',
      ram: '',
      disco_duro: '',
      sistema_operativo: '',
      estado: '',
      observaciones: ''
    });
    setPhotoPreview(null);
    setPhotoFile(null);
    setErrorMessage('');
    setCodigoError('');
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
      if (!formData.usuario_asignado) {
        mostrarNotificacion('⚠️ El usuario asignado es obligatorio', 'warning', 2000);
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

        <div className="bg-white rounded-2xl shadow-xl mb-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              💻 Registrar Computadora
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
                    {s === 4 && 'Especificaciones'}
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
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Clasificación del Equipo</h3>
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
                  <h3 className="text-xl font-bold text-gray-800 mb-6">📋 Datos Básicos</h3>
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
                        placeholder="Ej: PC-001, LAB-002"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500
                          ${codigoError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                        required 
                      />
                      {codigoError && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertTriangle size={12} /> {codigoError}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Usuario Asignado <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="usuario_asignado" value={formData.usuario_asignado} onChange={handleChange}
                        placeholder="Nombre del usuario o área"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ubicación <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleChange}
                        placeholder="Ej: Oficina 203, Laboratorio A"
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
                        <option value="bueno">✅ Bueno (Óptimo)</option>
                        <option value="regular">⚠️ Regular</option>
                        <option value="malo">❌ Malo (Dañado)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-fadeIn">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">📸 Foto del Equipo</h3>
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
                              <Upload size={18} /> Subir foto del equipo
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

              {step === 4 && (
                <div className="animate-fadeIn">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">⚙️ Especificaciones Técnicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Procesador</label>
                      <input type="text" name="procesador" value={formData.procesador} onChange={handleChange}
                        placeholder="Ej: Intel Core i5-11400"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">RAM</label>
                      <input type="text" name="ram" value={formData.ram} onChange={handleChange}
                        placeholder="Ej: 16GB DDR4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Disco Duro</label>
                      <input type="text" name="disco_duro" value={formData.disco_duro} onChange={handleChange}
                        placeholder="Ej: 512GB SSD"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Sistema Operativo</label>
                      <input type="text" name="sistema_operativo" value={formData.sistema_operativo} onChange={handleChange}
                        placeholder="Ej: Windows 11 Pro"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Observaciones</label>
                    <textarea name="observaciones" value={formData.observaciones} onChange={handleChange}
                      rows="3" placeholder="Notas adicionales sobre la computadora..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
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
                      {loading ? 'Guardando...' : 'Guardar Computadora'}
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

export default FormularioComputadora;