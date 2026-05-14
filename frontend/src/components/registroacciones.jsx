import React, { useState, useEffect } from 'react';
import { Calendar, Edit2, Trash2, PlusCircle, LogIn, LogOut, Server, Filter, X, FileText } from 'lucide-react';
import { getAcciones } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const RegistroAcciones = ({ currentUser }) => {
  const [acciones, setAcciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEntidad, setFiltroEntidad] = useState('todos');
  const [filtroUsuario, setFiltroUsuario] = useState('todos');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarAcciones();
  }, []);

  const cargarAcciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAcciones();
      setAcciones(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar acciones:', err);
      setError('No se pudieron cargar las acciones');
      setAcciones([]);
    } finally {
      setLoading(false);
    }
  };

  const usuariosUnicos = ['todos', ...new Set((acciones || []).map(a => a?.usuario_nombre).filter(Boolean))];

  const accionesFiltradas = (acciones || []).filter(acc => {
    if (!acc) return false;
    const matchTipo = filtroTipo === 'todos' || acc.tipo === filtroTipo;
    const matchEntidad = filtroEntidad === 'todos' || acc.entidad === filtroEntidad;
    const matchUsuario = filtroUsuario === 'todos' || acc.usuario_nombre === filtroUsuario;
    return matchTipo && matchEntidad && matchUsuario;
  });

  // ========== FUNCIÓN PARA PDF ==========
  const generarPDF = () => {
    if (accionesFiltradas.length === 0) {
      alert('No hay acciones para exportar');
      return;
    }

    try {
      const doc = new jsPDF('landscape', 'mm', 'a4');
      
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Registro de Acciones - Historial del Sistema', 14, 15);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 25);
      
      let yOffset = 32;
      
      let filtrosTexto = [];
      if (filtroTipo !== 'todos') {
        let tipoTexto = '';
        if (filtroTipo === 'creacion') tipoTexto = 'Creacion';
        else if (filtroTipo === 'edicion') tipoTexto = 'Edicion';
        else if (filtroTipo === 'eliminacion') tipoTexto = 'Eliminacion';
        else if (filtroTipo === 'login') tipoTexto = 'Inicio de Sesion';
        else if (filtroTipo === 'logout') tipoTexto = 'Cierre de Sesion';
        else tipoTexto = filtroTipo;
        filtrosTexto.push(`Tipo: ${tipoTexto}`);
      }
      if (filtroEntidad !== 'todos') {
        let entidadTexto = '';
        if (filtroEntidad === 'equipo') entidadTexto = 'Equipo';
        else if (filtroEntidad === 'usuario') entidadTexto = 'Usuario';
        else if (filtroEntidad === 'perfil') entidadTexto = 'Perfil';
        else if (filtroEntidad === 'departamento') entidadTexto = 'Departamento';
        else entidadTexto = filtroEntidad;
        filtrosTexto.push(`Entidad: ${entidadTexto}`);
      }
      if (filtroUsuario !== 'todos') filtrosTexto.push(`Usuario: ${filtroUsuario}`);
      
      if (filtrosTexto.length > 0) {
        doc.text(`Filtros aplicados: ${filtrosTexto.join(' | ')}`, 14, yOffset);
        yOffset += 7;
      }
      
      doc.text(`Total de acciones: ${accionesFiltradas.length}`, 14, yOffset);
      yOffset += 10;
      
      const headers = [['Usuario', 'Fecha', 'Tipo', 'Entidad', 'Descripcion']];
      const rows = accionesFiltradas.map(acc => {
        let tipoLimpio = '';
        if (acc.tipo === 'creacion') tipoLimpio = 'Creacion';
        else if (acc.tipo === 'edicion') tipoLimpio = 'Edicion';
        else if (acc.tipo === 'eliminacion') tipoLimpio = 'Eliminacion';
        else if (acc.tipo === 'login') tipoLimpio = 'Inicio de Sesion';
        else if (acc.tipo === 'logout') tipoLimpio = 'Cierre de Sesion';
        else tipoLimpio = acc.tipo;
        
        let entidadLimpia = '';
        if (acc.entidad === 'equipo') entidadLimpia = 'Equipo';
        else if (acc.entidad === 'usuario') entidadLimpia = 'Usuario';
        else if (acc.entidad === 'perfil') entidadLimpia = 'Perfil';
        else if (acc.entidad === 'departamento') entidadLimpia = 'Departamento';
        else entidadLimpia = acc.entidad;
        
        const fechaFormateada = new Date(acc.fecha).toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        return [
          acc.usuario_nombre || 'Usuario desconocido',
          fechaFormateada,
          tipoLimpio,
          entidadLimpia,
          (acc.descripcion || 'Sin descripcion').replace(/[🖥️💻🖨️📦🔴🟡🟢✅⚠️❌⭐🔧📍📄🎨➕✏️🗑️🔐🚪🏢📝]/g, '')
        ];
      });
      
      autoTable(doc, {
        startY: yOffset + 5,
        head: headers,
        body: rows,
        theme: 'striped',
        headStyles: { 
          fillColor: [30, 60, 114], 
          textColor: [255, 255, 255], 
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 40 },
          2: { cellWidth: 35 },
          3: { cellWidth: 30 },
          4: { cellWidth: 80 },
        },
        alternateRowStyles: { fillColor: [240, 240, 240] },
      });
      
      doc.save('registro_acciones.pdf');
      alert('✅ PDF descargado correctamente');
      
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al generar PDF: ' + error.message);
    }
  };

  const getIconoAccion = (tipo) => {
    const iconos = {
      creacion: <PlusCircle size={16} className="text-green-500" />,
      edicion: <Edit2 size={16} className="text-blue-500" />,
      eliminacion: <Trash2 size={16} className="text-red-500" />,
      login: <LogIn size={16} className="text-emerald-500" />,
      logout: <LogOut size={16} className="text-gray-500" />,
    };
    return iconos[tipo] || <Server size={16} className="text-gray-500" />;
  };

  const getColorFondo = (tipo) => {
    const colores = {
      creacion: 'bg-green-50 border-green-200',
      edicion: 'bg-blue-50 border-blue-200',
      eliminacion: 'bg-red-50 border-red-200',
      login: 'bg-emerald-50 border-emerald-200',
      logout: 'bg-gray-50 border-gray-200',
    };
    return colores[tipo] || 'bg-gray-50 border-gray-200';
  };

  const getTextoAccion = (tipo) => {
    const textos = {
      creacion: 'Creación',
      edicion: 'Edición',
      eliminacion: 'Eliminación',
      login: 'Inicio de Sesión',
      logout: 'Cierre de Sesión',
    };
    return textos[tipo] || tipo;
  };

  const getEntidadTexto = (entidad) => {
    const textos = {
      equipo: 'Equipo',
      usuario: 'Usuario',
      perfil: 'Perfil',
      departamento: 'Departamento',
    };
    return textos[entidad] || entidad;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    const date = new Date(fecha);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const limpiarFiltros = () => {
    setFiltroTipo('todos');
    setFiltroEntidad('todos');
    setFiltroUsuario('todos');
  };

  const hayFiltrosActivos = filtroTipo !== 'todos' || filtroEntidad !== 'todos' || filtroUsuario !== 'todos';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando registro de acciones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={cargarAcciones} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1e3c72] flex items-center gap-2">
            📋 Registro de Acciones
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Historial de todas las actividades realizadas en el sistema
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={generarPDF}
            className="px-3 py-1.5 bg-[#1e3c72] text-white rounded-lg hover:bg-[#2a5298] transition-colors flex items-center gap-2 text-sm"
          >
            <FileText size={16} />
            📄 Descargar PDF
          </button>
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-colors ${
              mostrarFiltros || hayFiltrosActivos
                ? 'bg-[#2a5298] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter size={14} />
            Filtros
            {hayFiltrosActivos && (
              <span className="ml-1 bg-white text-[#2a5298] rounded-full w-4 h-4 text-xs flex items-center justify-center">
                {[filtroTipo, filtroEntidad, filtroUsuario].filter(f => f !== 'todos').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Panel de filtros */}
      {mostrarFiltros && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Filtros</h3>
            {hayFiltrosActivos && (
              <button onClick={limpiarFiltros} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                <X size={12} /> Limpiar todos
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Tipo de Acción</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="todos">Todos</option>
                <option value="creacion">Creaciones</option>
                <option value="edicion">Ediciones</option>
                <option value="eliminacion">Eliminaciones</option>
                <option value="login">Inicios de Sesión</option>
                
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Entidad</label>
              <select
                value={filtroEntidad}
                onChange={(e) => setFiltroEntidad(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="todos">Todos</option>
                <option value="equipo">Equipos</option>
                <option value="usuario">Usuarios</option>
                <option value="perfil">Perfiles</option>
                <option value="departamento">Departamentos</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Usuario</label>
              <select
                value={filtroUsuario}
                onChange={(e) => setFiltroUsuario(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              >
                {usuariosUnicos.map(user => (
                  <option key={user} value={user}>
                    {user === 'todos' ? 'Todos los usuarios' : user}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Contador de resultados */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Mostrando <span className="font-semibold text-gray-700">{accionesFiltradas.length}</span> de{' '}
          <span className="font-semibold text-gray-700">{(acciones || []).length}</span> acciones registradas
        </p>
      </div>

      {/* Lista de acciones */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {accionesFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <Server size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No hay acciones registradas aún</p>
            <p className="text-sm text-gray-400 mt-2">
              Las acciones aparecerán aquí cuando se creen, editen o eliminen equipos
            </p>
          </div>
        ) : (
          accionesFiltradas.map((accion) => (
            <div
              key={accion.id}
              className={`border rounded-lg p-4 ${getColorFondo(accion.tipo)} hover:shadow-md transition-all`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getIconoAccion(accion.tipo)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800">{accion.usuario_nombre || 'Usuario desconocido'}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{getTextoAccion(accion.tipo)}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-sm font-medium text-[#1e3c72]">{getEntidadTexto(accion.entidad)}</span>
                    {accion.entidad_id && <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">ID: {accion.entidad_id}</span>}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{accion.descripcion || 'Sin descripción'}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={12} />{formatearFecha(accion.fecha)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Estadísticas rápidas - SIN CIERRES DE SESIÓN */}
      {acciones.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {(acciones || []).filter(a => a?.tipo === 'creacion').length}
              </div>
              <div className="text-xs text-gray-500">Creaciones</div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {(acciones || []).filter(a => a?.tipo === 'edicion').length}
              </div>
              <div className="text-xs text-gray-500">Ediciones</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">
                {(acciones || []).filter(a => a?.tipo === 'eliminacion').length}
              </div>
              <div className="text-xs text-gray-500">Eliminaciones</div>
            </div>
            <div className="text-center p-2 bg-emerald-50 rounded-lg">
              <div className="text-lg font-bold text-emerald-600">
                {(acciones || []).filter(a => a?.tipo === 'login').length}
              </div>
              <div className="text-xs text-gray-500">Inicios de Sesión</div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default RegistroAcciones;