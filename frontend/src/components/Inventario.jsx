import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Calendar, Filter, X, ChevronDown, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Inventario = ({ equipos, setEquipos }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroUso, setFiltroUso] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroPiso, setFiltroPiso] = useState('todos');
  const [filtroDepartamento, setFiltroDepartamento] = useState('todos');
  
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const pisos = ['todos', 'Planta Baja', 'Mezanina', 'Piso 1', 'Piso 2', 'Piso 3', 'Piso 4', 'Piso 5', 'Piso 6'];

  const departamentosList = ['todos', ...new Set(equipos.map(eq => eq.departamento_nombre || eq.departamento?.nombre).filter(Boolean))];

  const filtrarPorFecha = (fechaRegistro) => {
    if (!fechaDesde && !fechaHasta) return true;
    
    const fecha = new Date(fechaRegistro);
    const desde = fechaDesde ? new Date(fechaDesde) : null;
    const hasta = fechaHasta ? new Date(fechaHasta) : null;
    
    if (desde && hasta) {
      return fecha >= desde && fecha <= hasta;
    }
    if (desde) {
      return fecha >= desde;
    }
    if (hasta) {
      return fecha <= hasta;
    }
    return true;
  };

  const equiposFiltrados = equipos.filter((eq) => {
    const matchTipo = filtroTipo === 'todos' || eq.tipo === filtroTipo;
    const matchUso = filtroUso === 'todos' || eq.uso === filtroUso;
    const matchEstado = filtroEstado === 'todos' || eq.estado === filtroEstado;
    const matchPiso = filtroPiso === 'todos' || eq.piso === filtroPiso;
    const matchDepartamento = filtroDepartamento === 'todos' || 
      (eq.departamento_nombre || eq.departamento?.nombre) === filtroDepartamento;
    const matchSearch = !searchTerm ||
      eq.codigo_equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.usuario_asignado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.piso?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (eq.departamento_nombre || eq.departamento?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchFecha = filtrarPorFecha(eq.fecha_registro);
    
    return matchTipo && matchUso && matchEstado && matchPiso && matchDepartamento && matchSearch && matchFecha;
  });

  const handleVerDetalle = (id) => {
    navigate(`/equipo/${id}`);
  };

  const contarPorTipo = (tipo) => {
    return equipos.filter(eq => eq.tipo === tipo).length;
  };

  const limpiarFiltros = () => {
    setFiltroTipo('todos');
    setFiltroUso('todos');
    setFiltroEstado('todos');
    setFiltroPiso('todos');
    setFiltroDepartamento('todos');
    setFechaDesde('');
    setFechaHasta('');
    setSearchTerm('');
  };

  const hayFiltrosActivos = filtroTipo !== 'todos' || filtroUso !== 'todos' || 
    filtroEstado !== 'todos' || filtroPiso !== 'todos' || filtroDepartamento !== 'todos' ||
    searchTerm !== '' || fechaDesde !== '' || fechaHasta !== '';

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      bueno: <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">✅ Bueno</span>,
      regular: <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">⚠️ Regular</span>,
      malo: <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">❌ Malo</span>,
    };
    return badges[estado] || estado;
  };

  const getUsoBadge = (uso) => {
    const badges = {
      critico: <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">🔴 Crítico</span>,
      importante: <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">🟡 Importante</span>,
      basico: <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">🟢 Básico</span>,
    };
    return badges[uso] || uso;
  };

  const getTipoDisplay = (tipo) => {
    const tipos = {
      'computadora_escritorio': '💻 Computadora',
      'impresora': '🖨️ Impresora',
      'monitor': '🖥️ Monitor',
      'regulador': '⚡ Regulador',
    };
    return tipos[tipo] || tipo;
  };

  const generarPDF = () => {
    if (equiposFiltrados.length === 0) {
      alert('No hay equipos para exportar');
      return;
    }

    try {
      const doc = new jsPDF('landscape', 'mm', 'a4');
      
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Inventario de Equipos', 14, 15);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 25);
      
      let yOffset = 32;
      
      let filtrosTexto = [];
      if (filtroPiso !== 'todos') filtrosTexto.push(`Piso: ${filtroPiso}`);
      if (filtroDepartamento !== 'todos') filtrosTexto.push(`Departamento: ${filtroDepartamento}`);
      if (filtroTipo !== 'todos') filtrosTexto.push(`Tipo: ${getTipoDisplay(filtroTipo)}`);
      if (filtroUso !== 'todos') filtrosTexto.push(`Uso: ${filtroUso}`);
      if (filtroEstado !== 'todos') filtrosTexto.push(`Estado: ${filtroEstado}`);
      if (searchTerm) filtrosTexto.push(`Búsqueda: "${searchTerm}"`);
      
      if (filtrosTexto.length > 0) {
        doc.text(`Filtros: ${filtrosTexto.join(' | ')}`, 14, yOffset);
        yOffset += 7;
      }
      
      if (fechaDesde || fechaHasta) {
        let textoFechas = 'Rango de fechas: ';
        if (fechaDesde) textoFechas += `desde ${formatearFecha(fechaDesde)} `;
        if (fechaHasta) textoFechas += `hasta ${formatearFecha(fechaHasta)}`;
        doc.text(textoFechas, 14, yOffset);
        yOffset += 7;
      }
      
      doc.text(`Total de equipos: ${equiposFiltrados.length}`, 14, yOffset);
      yOffset += 10;
      
      const headers = [['Código', 'Tipo', 'Usuario', 'Piso', 'Departamento', 'Estado', 'Uso', 'Fecha']];
      const rows = equiposFiltrados.map(eq => {
        let tipoLimpio = eq.tipo;
        if (eq.tipo === 'computadora_escritorio') tipoLimpio = 'Computadora';
        else if (eq.tipo === 'impresora') tipoLimpio = 'Impresora';
        else if (eq.tipo === 'monitor') tipoLimpio = 'Monitor';
        else if (eq.tipo === 'regulador') tipoLimpio = 'Regulador';
        
        let estadoLimpio = eq.estado;
        if (eq.estado === 'bueno') estadoLimpio = 'Óptimo';
        else if (eq.estado === 'regular') estadoLimpio = 'Regular';
        else if (eq.estado === 'malo') estadoLimpio = 'Dañado';
        
        let usoLimpio = eq.uso;
        if (eq.uso === 'critico') usoLimpio = 'Crítico';
        else if (eq.uso === 'importante') usoLimpio = 'Importante';
        else if (eq.uso === 'basico') usoLimpio = 'Básico';
        
        return [
          eq.codigo_equipo,
          tipoLimpio,
          eq.usuario_asignado,
          eq.piso || '-',
          eq.departamento_nombre || eq.departamento?.nombre || '-',
          estadoLimpio,
          usoLimpio,
          formatearFecha(eq.fecha_registro)
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
          0: { cellWidth: 25 },
          1: { cellWidth: 25 },
          2: { cellWidth: 30 },
          3: { cellWidth: 20 },
          4: { cellWidth: 45 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 25 },
        },
      });
      
      doc.save('inventario.pdf');
      alert('✅ PDF descargado correctamente');
      
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al generar PDF: ' + error.message);
    }
  };

  // Tipos disponibles para el filtro
  const tiposFiltro = [
    { id: 'todos', label: 'Todos', count: equipos.length },
    { id: 'computadora_escritorio', label: '💻 Computadoras', count: contarPorTipo('computadora_escritorio') },
    { id: 'impresora', label: '🖨️ Impresoras', count: contarPorTipo('impresora') },
    { id: 'monitor', label: '🖥️ Monitores', count: contarPorTipo('monitor') },
    { id: 'regulador', label: '⚡ Reguladores', count: contarPorTipo('regulador') },
  ];

  return (
    <div>
      {/* Barra de búsqueda */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 mb-5 flex items-center gap-3">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por código, usuario, piso o departamento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none text-sm"
        />
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 transition-colors ${
            mostrarFiltros || hayFiltrosActivos
              ? 'bg-[#2a5298] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Filter size={14} />
          Filtros
          {hayFiltrosActivos && (
            <span className="ml-1 bg-white text-[#2a5298] rounded-full w-4 h-4 text-xs flex items-center justify-center">
              {[filtroTipo, filtroUso, filtroEstado, filtroPiso, filtroDepartamento].filter(f => f !== 'todos').length + 
               (searchTerm ? 1 : 0) + (fechaDesde ? 1 : 0) + (fechaHasta ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Panel de filtros */}
      {mostrarFiltros && (
        <div className="bg-white rounded-xl shadow-md p-5 mb-5 border border-gray-100 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <Filter size={16} /> Filtros avanzados
            </h3>
            {hayFiltrosActivos && (
              <button onClick={limpiarFiltros} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                <X size={12} /> Limpiar todos
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por TIPO */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">📦 Tipo de Equipo</label>
              <div className="flex flex-wrap gap-2">
                {tiposFiltro.map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setFiltroTipo(btn.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filtroTipo === btn.id ? 'bg-[#2a5298] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {btn.label}
                    {btn.count > 0 && <span className="ml-1 text-xs text-gray-400">({btn.count})</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por USO */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">⭐ Clasificación de Uso</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'critico', label: '🔴 Crítico' },
                  { id: 'importante', label: '🟡 Importante' },
                  { id: 'basico', label: '🟢 Básico' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setFiltroUso(btn.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filtroUso === btn.id ? 'bg-[#2a5298] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por ESTADO */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">🔧 Estado del Equipo</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'bueno', label: '✅ Bueno' },
                  { id: 'regular', label: '⚠️ Regular' },
                  { id: 'malo', label: '❌ Malo' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setFiltroEstado(btn.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filtroEstado === btn.id ? 'bg-[#2a5298] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por PISO */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">🏢 Piso</label>
              <select value={filtroPiso} onChange={(e) => setFiltroPiso(e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                {pisos.map((piso) => (
                  <option key={piso} value={piso}>{piso === 'todos' ? 'Todos los pisos' : piso}</option>
                ))}
              </select>
            </div>

            {/* Filtro por DEPARTAMENTO */}
            <div className="md:col-span-2 lg:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-2">📍 Departamento / Ubicación</label>
              <select value={filtroDepartamento} onChange={(e) => setFiltroDepartamento(e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                {departamentosList.map((depto) => (
                  <option key={depto} value={depto}>{depto === 'todos' ? 'Todos los departamentos' : depto}</option>
                ))}
              </select>
            </div>

            {/* Filtro por FECHA DESDE */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">📅 Fecha Desde</label>
              <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
            </div>

            {/* Filtro por FECHA HASTA */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">📅 Fecha Hasta</label>
              <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>

          {/* Resumen de filtros activos */}
          {hayFiltrosActivos && (
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500">Filtros activos:</span>
              {filtroTipo !== 'todos' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {getTipoDisplay(filtroTipo)}
                  <button onClick={() => setFiltroTipo('todos')} className="hover:text-blue-900">×</button>
                </span>
              )}
              {filtroUso !== 'todos' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                  {filtroUso === 'critico' && '🔴 Crítico'}
                  {filtroUso === 'importante' && '🟡 Importante'}
                  {filtroUso === 'basico' && '🟢 Básico'}
                  <button onClick={() => setFiltroUso('todos')} className="hover:text-yellow-900">×</button>
                </span>
              )}
              {filtroEstado !== 'todos' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  {filtroEstado === 'bueno' && '✅ Bueno'}
                  {filtroEstado === 'regular' && '⚠️ Regular'}
                  {filtroEstado === 'malo' && '❌ Malo'}
                  <button onClick={() => setFiltroEstado('todos')} className="hover:text-green-900">×</button>
                </span>
              )}
              {filtroPiso !== 'todos' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                  🏢 {filtroPiso}
                  <button onClick={() => setFiltroPiso('todos')} className="hover:text-indigo-900">×</button>
                </span>
              )}
              {filtroDepartamento !== 'todos' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                  📍 {filtroDepartamento}
                  <button onClick={() => setFiltroDepartamento('todos')} className="hover:text-purple-900">×</button>
                </span>
              )}
              {fechaDesde && <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs">📅 Desde: {formatearFecha(fechaDesde)}<button onClick={() => setFechaDesde('')}>×</button></span>}
              {fechaHasta && <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs">📅 Hasta: {formatearFecha(fechaHasta)}<button onClick={() => setFechaHasta('')}>×</button></span>}
              {searchTerm && <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">🔍 "{searchTerm}"<button onClick={() => setSearchTerm('')}>×</button></span>}
            </div>
          )}
        </div>
      )}

      {/* Botón de PDF */}
      <div className="mb-4 flex justify-end">
        <button onClick={generarPDF} className="px-4 py-2 bg-[#1e3c72] text-white rounded-lg hover:bg-[#2a5298] transition-colors flex items-center gap-2 text-sm">
          <FileText size={16} /> 📄 Descargar PDF
        </button>
      </div>

      {/* Resultados */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">Mostrando <span className="font-semibold text-gray-700">{equiposFiltrados.length}</span> de <span className="font-semibold text-gray-700">{equipos.length}</span> equipos</p>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Código</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Usuario</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Piso</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Departamento</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Uso</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {equiposFiltrados.length === 0 ? (
                <tr><td colSpan="9" className="text-center py-12 text-gray-500">No hay equipos que coincidan con los filtros seleccionados</td></tr>
              ) : (
                equiposFiltrados.map((eq) => (
                  <tr key={eq.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handleVerDetalle(eq.id)}>
                    <td className="px-4 py-3 text-sm font-medium text-blue-600 hover:text-blue-800">{eq.codigo_equipo}</td>
                    <td className="px-4 py-3 text-sm">{getTipoDisplay(eq.tipo)}</td>
                    <td className="px-4 py-3 text-sm">{eq.usuario_asignado}</td>
                    <td className="px-4 py-3 text-sm font-medium">{eq.piso || '-'}</td>
                    <td className="px-4 py-3 text-sm">{eq.departamento_nombre || eq.departamento?.nombre || '-'}</td>
                    <td className="px-4 py-3 text-sm">{getEstadoBadge(eq.estado)}</td>
                    <td className="px-4 py-3 text-sm">{getUsoBadge(eq.uso)}</td>
                    <td className="px-4 py-3 text-sm"><div className="flex items-center gap-1 text-gray-500"><Calendar size={12} /><span>{formatearFecha(eq.fecha_registro)}</span></div></td>
                    <td className="px-4 py-3 text-sm" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleVerDetalle(eq.id)} className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors flex items-center gap-1 text-xs"><Eye size={12} /> Ver</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Inventario;