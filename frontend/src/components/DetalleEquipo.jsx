// components/DetalleEquipo.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Printer, Monitor, Cpu, HardDrive, 
  Wifi, MapPin, User, Calendar, AlertCircle, 
  Star, Heart, CheckCircle, XCircle, Edit, 
  Trash2, Download, Database, Layout, Server, Smartphone
} from 'lucide-react';
import { getEquipos, deleteEquipo } from '../services/api';
import ModalEditar from './ModalEditar';

const DetalleEquipo = ({ equipos, setEquipos }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    cargarEquipo();
  }, [id]);

  const cargarEquipo = async () => {
    setLoading(true);
    const allEquipos = await getEquipos();
    const encontrado = allEquipos.find(e => e.id === parseInt(id));
    setEquipo(encontrado);
    setLoading(false);
  };

  const handleDelete = async () => {
    const success = await deleteEquipo(id);
    if (success) {
      const nuevosEquipos = await getEquipos();
      setEquipos(nuevosEquipos);
      navigate('/dashboard/inventario');
    }
  };

  const handleEditSuccess = async () => {
    const nuevosEquipos = await getEquipos();
    setEquipos(nuevosEquipos);
    await cargarEquipo();
    setShowEditModal(false);
  };

  // Función para generar y descargar PDF automáticamente
  const generarPDF = () => {
    // Crear una nueva ventana
    const ventana = window.open('', '_blank');
    
    // Obtener la fecha actual
    const fechaActual = new Date().toLocaleDateString('es-ES');
    
    // Determinar el ícono según el tipo
    const getIconoEquipo = () => {
      if (equipo.tipo === 'computadora_escritorio') return '💻';
      if (equipo.tipo === 'impresora') return '🖨️';
      if (equipo.tipo === 'monitor') return '🖥️';
      return '📦';
    };
    
    // Crear el contenido HTML del PDF
    const contenido = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Ficha Técnica - ${equipo.codigo_equipo}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          background: white;
          padding: 40px;
          color: #333;
        }
        .header {
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          color: white;
          padding: 30px;
          border-radius: 16px;
          margin-bottom: 30px;
          text-align: center;
        }
        .header h1 {
          font-size: 28px;
          margin-bottom: 10px;
        }
        .header p {
          opacity: 0.8;
          font-size: 14px;
        }
        .contenido {
          display: flex;
          gap: 30px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }
        .columna-izquierda {
          flex: 1;
          min-width: 250px;
          background: #f8f9fa;
          border-radius: 16px;
          padding: 20px;
          text-align: center;
        }
        .columna-derecha {
          flex: 2;
          min-width: 300px;
        }
        .foto-placeholder {
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #e0e0e0, #ccc);
          border-radius: 16px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 80px;
        }
        .foto-real {
          width: 200px;
          height: 200px;
          border-radius: 16px;
          margin: 0 auto 20px;
          object-fit: cover;
        }
        .badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          margin: 5px;
        }
        .badge-critico { background: #fee2e2; color: #dc2626; }
        .badge-importante { background: #fed7aa; color: #ea580c; }
        .badge-basico { background: #dcfce7; color: #16a34a; }
        .badge-bueno { background: #dcfce7; color: #16a34a; }
        .badge-regular { background: #fed7aa; color: #ea580c; }
        .badge-malo { background: #fee2e2; color: #dc2626; }
        .seccion {
          background: #f8f9fa;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .seccion h3 {
          color: #1e3c72;
          margin-bottom: 15px;
          font-size: 18px;
          border-bottom: 2px solid #2a5298;
          padding-bottom: 8px;
          display: inline-block;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-top: 15px;
        }
        .campo {
          margin-bottom: 12px;
        }
        .campo-label {
          font-size: 11px;
          text-transform: uppercase;
          color: #6b7280;
          letter-spacing: 0.5px;
        }
        .campo-valor {
          font-size: 14px;
          font-weight: 500;
          color: #1f2937;
          margin-top: 4px;
          word-break: break-word;
        }
        .footer {
          text-align: center;
          padding-top: 30px;
          margin-top: 30px;
          border-top: 1px solid #e5e7eb;
          color: #9ca3af;
          font-size: 12px;
        }
        hr {
          margin: 20px 0;
          border: none;
          border-top: 1px solid #e5e7eb;
        }
        @media print {
          body {
            padding: 20px;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>FICHA TÉCNICA DEL EQUIPO</h1>
        <p>Código: ${equipo.codigo_equipo}</p>
        <p>Documento generado el ${fechaActual}</p>
      </div>

      <div class="contenido">
        <div class="columna-izquierda">
          ${equipo.foto ? 
            `<img src="${equipo.foto}" class="foto-real" alt="${equipo.codigo_equipo}" />` : 
            `<div class="foto-placeholder">${getIconoEquipo()}</div>`
          }
          <div style="margin-top: 15px;">
            <span class="badge ${equipo.uso === 'critico' ? 'badge-critico' : equipo.uso === 'importante' ? 'badge-importante' : 'badge-basico'}">
              ${equipo.uso === 'critico' ? '🔴 Crítico' : equipo.uso === 'importante' ? '🟡 Importante' : '🟢 Básico'}
            </span>
            <span class="badge ${equipo.estado === 'bueno' ? 'badge-bueno' : equipo.estado === 'regular' ? 'badge-regular' : 'badge-malo'}">
              ${equipo.estado === 'bueno' ? '✅ Bueno' : equipo.estado === 'regular' ? '⚠️ Regular' : '❌ Malo'}
            </span>
          </div>
          <hr />
          <div style="text-align: left;">
            <p style="font-size:12px; color:#666;">📅 Registrado el:</p>
            <p style="font-weight:bold;">${new Date(equipo.fecha_registro).toLocaleDateString('es-ES')}</p>
            <p style="font-size:12px; color:#666; margin-top:10px;">👤 Registrado por:</p>
            <p style="font-weight:bold;">${equipo.registrado_por || 'Administrador'}</p>
          </div>
        </div>

        <div class="columna-derecha">
          <div class="seccion">
            <h3>📍 INFORMACIÓN GENERAL</h3>
            <div class="grid">
              <div class="campo">
                <div class="campo-label">Tipo de Equipo</div>
                <div class="campo-valor">${
                  equipo.tipo === 'computadora_escritorio' ? '💻 Computadora de Escritorio' :
                  equipo.tipo === 'impresora' ? '🖨️ Impresora' : '🖥️ Monitor'
                }</div>
              </div>
              <div class="campo">
                <div class="campo-label">Ubicación</div>
                <div class="campo-valor">${equipo.ubicacion}</div>
              </div>
              <div class="campo">
                <div class="campo-label">Usuario Asignado</div>
                <div class="campo-valor">${equipo.usuario_asignado}</div>
              </div>
            </div>
          </div>

          ${equipo.tipo === 'computadora_escritorio' ? `
          <div class="seccion">
            <h3>⚙️ ESPECIFICACIONES TÉCNICAS</h3>
            <div class="grid">
              <div class="campo">
                <div class="campo-label">Procesador</div>
                <div class="campo-valor">${equipo.procesador || 'N/A'}</div>
              </div>
              <div class="campo">
                <div class="campo-label">RAM</div>
                <div class="campo-valor">${equipo.ram || 'N/A'}</div>
              </div>
              <div class="campo">
                <div class="campo-label">Disco Duro</div>
                <div class="campo-valor">${equipo.disco_duro || 'N/A'}</div>
              </div>
              <div class="campo">
                <div class="campo-label">Sistema Operativo</div>
                <div class="campo-valor">${equipo.sistema_operativo || 'N/A'}</div>
              </div>
            </div>
          </div>
          ` : equipo.tipo === 'impresora' ? `
          <div class="seccion">
            <h3>🖨️ ESPECIFICACIONES DE IMPRESORA</h3>
            <div class="grid">
              <div class="campo">
                <div class="campo-label">Marca</div>
                <div class="campo-valor">${equipo.marca || 'N/A'}</div>
              </div>
              <div class="campo">
                <div class="campo-label">Modelo</div>
                <div class="campo-valor">${equipo.modelo || 'N/A'}</div>
              </div>
              <div class="campo">
                <div class="campo-label">Número de Serial</div>
                <div class="campo-valor">${equipo.serial || 'N/A'}</div>
              </div>
            </div>
          </div>
          ` : equipo.tipo === 'monitor' ? `
          <div class="seccion">
            <h3>🖥️ ESPECIFICACIONES DE MONITOR</h3>
            <div class="grid">
              <div class="campo">
                <div class="campo-label">Marca</div>
                <div class="campo-valor">${equipo.marca || 'N/A'}</div>
              </div>
              <div class="campo">
                <div class="campo-label">Modelo</div>
                <div class="campo-valor">${equipo.modelo || 'N/A'}</div>
              </div>
              <div class="campo">
                <div class="campo-label">Tamaño</div>
                <div class="campo-valor">${equipo.tamano || 'N/A'}"</div>
              </div>
              <div class="campo">
                <div class="campo-label">Resolución</div>
                <div class="campo-valor">${equipo.resolucion || 'N/A'}</div>
              </div>
              <div class="campo">
                <div class="campo-label">Tipo de Pantalla</div>
                <div class="campo-valor">${equipo.tipo_pantalla || 'N/A'}</div>
              </div>
              <div class="campo">
                <div class="campo-label">Puertos</div>
                <div class="campo-valor">${equipo.puertos || 'N/A'}</div>
              </div>
            </div>
          </div>
          ` : ''}

          ${equipo.observaciones ? `
          <div class="seccion">
            <h3>📝 OBSERVACIONES</h3>
            <div class="campo-valor" style="margin-top: 10px;">${equipo.observaciones}</div>
          </div>
          ` : ''}
        </div>
      </div>

      <div class="footer">
        <p>Documento generado por el Sistema GOBERT</p>
        <p>© ${new Date().getFullYear()} - Todos los derechos reservados</p>
      </div>
      
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 500);
          }, 500);
        };
      </script>
    </body>
    </html>`;
    
    // Escribir el contenido en la nueva ventana
    ventana.document.write(contenido);
    ventana.document.close();
  };

  const getIconoTipo = (tipo) => {
    const iconos = {
      'computadora_escritorio': <Cpu size={28} className="text-blue-500" />,
      'impresora': <Printer size={28} className="text-orange-500" />,
      'monitor': <Monitor size={28} className="text-teal-500" />
    };
    return iconos[tipo] || <Database size={28} className="text-gray-500" />;
  };

  const getColorEstado = (estado) => {
    const colores = {
      'bueno': { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={16} />, label: '✅ Bueno' },
      'regular': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <AlertCircle size={16} />, label: '⚠️ Regular' },
      'malo': { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle size={16} />, label: '❌ Malo' }
    };
    return colores[estado] || colores['regular'];
  };

  const getColorUso = (uso) => {
    const colores = {
      'critico': { bg: 'bg-red-100', text: 'text-red-700', icon: <AlertCircle size={14} />, label: '🔴 Crítico' },
      'importante': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Star size={14} />, label: '🟡 Importante' },
      'basico': { bg: 'bg-green-100', text: 'text-green-700', icon: <Heart size={14} />, label: '🟢 Básico' }
    };
    return colores[uso] || colores['basico'];
  };

  const getNombreTipo = (tipo) => {
    const nombres = {
      'computadora_escritorio': 'Computadora de Escritorio',
      'impresora': 'Impresora',
      'monitor': 'Monitor',
    };
    return nombres[tipo] || tipo;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del equipo...</p>
        </div>
      </div>
    );
  }

  if (!equipo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Equipo no encontrado</p>
          <button onClick={() => navigate('/dashboard/inventario')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
            Volver al inventario
          </button>
        </div>
      </div>
    );
  }

  const colorEstado = getColorEstado(equipo.estado);
  const colorUso = getColorUso(equipo.uso);
  const fechaFormateada = new Date(equipo.fecha_registro).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header con botón volver */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/dashboard/inventario')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm"
          >
            <ArrowLeft size={18} /> Volver al inventario
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
            >
              <Edit size={18} /> Editar
            </button>
            <button 
              onClick={generarPDF}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
            >
              <Download size={18} /> PDF
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              <Trash2 size={18} /> Eliminar
            </button>
          </div>
        </div>

        {/* Tarjeta Principal */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cabecera con gradiente */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/80 text-sm mb-1">Código de Equipo</p>
                <h1 className="text-3xl font-bold text-white">{equipo.codigo_equipo}</h1>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Columna izquierda - Foto y datos básicos */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                  {equipo.foto ? (
                    <img 
                      src={equipo.foto} 
                      alt={equipo.codigo_equipo}
                      className="w-full max-w-[250px] h-auto mx-auto rounded-xl shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                      {getIconoTipo(equipo.tipo)}
                    </div>
                  )}
                  <div className="mt-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${colorUso.bg} ${colorUso.text}`}>
                      {colorUso.icon} {colorUso.label}
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${colorEstado.bg} ${colorEstado.text}`}>
                      {colorEstado.icon} {colorEstado.label}
                    </span>
                  </div>
                </div>

                <div className="mt-6 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-3">
                    <Calendar size={16} />
                    <span className="text-sm font-medium">Información de Registro</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Registrado el: <span className="font-semibold text-gray-800">{fechaFormateada}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Registrado por: <span className="font-semibold text-gray-800">{equipo.registrado_por || 'Administrador'}</span>
                  </p>
                </div>
              </div>

              {/* Columna derecha */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  {getIconoTipo(equipo.tipo)}
                  <div>
                    <p className="text-sm text-gray-500">Tipo de Equipo</p>
                    <p className="text-xl font-semibold text-gray-800">{getNombreTipo(equipo.tipo)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Ubicación</p>
                      <p className="text-gray-800 font-medium">{equipo.ubicacion}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User size={20} className="text-green-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Usuario Asignado</p>
                      <p className="text-gray-800 font-medium">{equipo.usuario_asignado}</p>
                    </div>
                  </div>

                  {equipo.tipo === 'computadora_escritorio' ? (
                    <>
                      <div className="flex items-start gap-3">
                        <Cpu size={20} className="text-purple-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Procesador</p>
                          <p className="text-gray-800 font-medium">{equipo.procesador || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Database size={20} className="text-indigo-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">RAM</p>
                          <p className="text-gray-800 font-medium">{equipo.ram || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <HardDrive size={20} className="text-orange-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Disco Duro</p>
                          <p className="text-gray-800 font-medium">{equipo.disco_duro || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Layout size={20} className="text-cyan-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Sistema Operativo</p>
                          <p className="text-gray-800 font-medium">{equipo.sistema_operativo || 'N/A'}</p>
                        </div>
                      </div>
                    </>
                  ) : equipo.tipo === 'impresora' ? (
                    <>
                      <div className="flex items-start gap-3">
                        <Printer size={20} className="text-orange-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Marca / Modelo</p>
                          <p className="text-gray-800 font-medium">{equipo.marca} {equipo.modelo}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Wifi size={20} className="text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Número de Serial</p>
                          <p className="text-gray-800 font-medium">{equipo.serial || 'N/A'}</p>
                        </div>
                      </div>
                    </>
                  ) : equipo.tipo === 'monitor' ? (
                    <>
                      <div className="flex items-start gap-3">
                        <Monitor size={20} className="text-teal-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Marca / Modelo</p>
                          <p className="text-gray-800 font-medium">{equipo.marca} {equipo.modelo}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Layout size={20} className="text-purple-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Tamaño / Resolución</p>
                          <p className="text-gray-800 font-medium">{equipo.tamano}" | {equipo.resolucion}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Database size={20} className="text-indigo-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Tipo de Pantalla</p>
                          <p className="text-gray-800 font-medium">{equipo.tipo_pantalla || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Wifi size={20} className="text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Puertos</p>
                          <p className="text-gray-800 font-medium">{equipo.puertos || 'N/A'}</p>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>

                {equipo.observaciones && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Observaciones</p>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{equipo.observaciones}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 size={20} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Eliminar Equipo</h3>
              </div>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar el equipo <span className="font-semibold">{equipo.codigo_equipo}</span>? 
                Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de edición */}
        {showEditModal && (
          <ModalEditar
            equipo={equipo}
            onClose={() => setShowEditModal(false)}
            setEquipos={setEquipos}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DetalleEquipo;