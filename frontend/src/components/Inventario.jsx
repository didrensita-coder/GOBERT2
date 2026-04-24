import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Calendar, Filter, X, ChevronDown } from 'lucide-react';
import { deleteEquipo, getEquipos } from '../services/api';

const Inventario = ({ equipos, setEquipos }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtros principales
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroUso, setFiltroUso] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroDepartamento, setFiltroDepartamento] = useState('todos');
  
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Obtener departamentos únicos de las ubicaciones
  const departamentos = ['todos', ...new Set(equipos.map(eq => eq.ubicacion).filter(Boolean))];

  // Función para extraer departamento de la ubicación (si quieres buscar por palabra clave)
  const buscarEnUbicacion = (ubicacion, termino) => {
    if (!termino || termino === 'todos') return true;
    return ubicacion.toLowerCase().includes(termino.toLowerCase());
  };

  const equiposFiltrados = equipos.filter((eq) => {
    // Filtro por TIPO (principal)
    const matchTipo = filtroTipo === 'todos' || eq.tipo === filtroTipo;
    
    // Filtro por USO
    const matchUso = filtroUso === 'todos' || eq.uso === filtroUso;
    
    // Filtro por ESTADO
    const matchEstado = filtroEstado === 'todos' || eq.estado === filtroEstado;
    
    // Filtro por DEPARTAMENTO/UBICACIÓN
    const matchDepartamento = filtroDepartamento === 'todos' || 
      eq.ubicacion.toLowerCase().includes(filtroDepartamento.toLowerCase());
    
    // Búsqueda general
    const matchSearch = !searchTerm ||
      eq.codigo_equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.usuario_asignado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchTipo && matchUso && matchEstado && matchDepartamento && matchSearch;
  });

  const handleVerDetalle = (id) => {
    navigate(`/equipo/${id}`);
  };

  // Contar equipos por tipo para mostrar badges
  const contarPorTipo = (tipo) => {
    return equipos.filter(eq => eq.tipo === tipo).length;
  };

  const limpiarFiltros = () => {
    setFiltroTipo('todos');
    setFiltroUso('todos');
    setFiltroEstado('todos');
    setFiltroDepartamento('todos');
    setSearchTerm('');
  };

  const hayFiltrosActivos = filtroTipo !== 'todos' || filtroUso !== 'todos' || filtroEstado !== 'todos' || filtroDepartamento !== 'todos' || searchTerm !== '';

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
    };
    return tipos[tipo] || tipo;
  };

  return (
    <div>
      {/* Barra de búsqueda principal */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 mb-5 flex items-center gap-3">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por código, usuario o ubicación..."
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
              {[filtroTipo, filtroUso, filtroEstado, filtroDepartamento].filter(f => f !== 'todos').length + (searchTerm ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Panel de filtros desplegable */}
      {mostrarFiltros && (
        <div className="bg-white rounded-xl shadow-md p-5 mb-5 border border-gray-100 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <Filter size={16} /> Filtros avanzados
            </h3>
            {hayFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <X size={12} /> Limpiar todos
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por TIPO */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                📦 Tipo de Equipo
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'todos', label: 'Todos', count: equipos.length },
                  { id: 'computadora_escritorio', label: '💻 Computadoras', count: contarPorTipo('computadora_escritorio') },
                  { id: 'impresora', label: '🖨️ Impresoras', count: contarPorTipo('impresora') },
                  { id: 'monitor', label: '🖥️ Monitores', count: contarPorTipo('monitor') },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setFiltroTipo(btn.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filtroTipo === btn.id
                        ? 'bg-[#2a5298] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {btn.label}
                    {btn.count > 0 && (
                      <span className={`ml-1 text-xs ${filtroTipo === btn.id ? 'text-white/80' : 'text-gray-400'}`}>
                        ({btn.count})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por USO */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                ⭐ Clasificación de Uso
              </label>
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
                      filtroUso === btn.id
                        ? 'bg-[#2a5298] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por ESTADO */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                🔧 Estado del Equipo
              </label>
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
                      filtroEstado === btn.id
                        ? 'bg-[#2a5298] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por DEPARTAMENTO/UBICACIÓN */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                📍 Departamento / Ubicación
              </label>
              <select
                value={filtroDepartamento}
                onChange={(e) => setFiltroDepartamento(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {departamentos.map((depto) => (
                  <option key={depto} value={depto}>
                    {depto === 'todos' ? 'Todos los departamentos' : depto}
                  </option>
                ))}
              </select>
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
              {filtroDepartamento !== 'todos' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                  📍 {filtroDepartamento}
                  <button onClick={() => setFiltroDepartamento('todos')} className="hover:text-purple-900">×</button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  🔍 "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:text-gray-900">×</button>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Resultados y contadores */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          Mostrando <span className="font-semibold text-gray-700">{equiposFiltrados.length}</span> de{' '}
          <span className="font-semibold text-gray-700">{equipos.length}</span> equipos
        </p>
        {hayFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <X size={12} /> Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla de equipos */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Código</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Usuario</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ubicación</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Procesador</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">RAM</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Uso</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fecha Registro</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {equiposFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-12 text-gray-500">
                    No hay equipos que coincidan con los filtros seleccionados
                  </td>
                </tr>
              ) : (
                equiposFiltrados.map((eq) => (
                  <tr 
                    key={eq.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleVerDetalle(eq.id)}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-blue-600 hover:text-blue-800">
                      {eq.codigo_equipo}
                    </td>
                    <td className="px-4 py-3 text-sm">{getTipoDisplay(eq.tipo)}</td>
                    <td className="px-4 py-3 text-sm">{eq.usuario_asignado}</td>
                    <td className="px-4 py-3 text-sm">{eq.ubicacion}</td>
                    <td className="px-4 py-3 text-sm">{eq.procesador || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{eq.ram || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{getEstadoBadge(eq.estado)}</td>
                    <td className="px-4 py-3 text-sm">{getUsoBadge(eq.uso)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar size={12} />
                        <span>{formatearFecha(eq.fecha_registro)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleVerDetalle(eq.id)}
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors flex items-center gap-1 text-xs"
                        title="Ver detalles"
                      >
                        <Eye size={12} /> Ver
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Inventario;