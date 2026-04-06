import React, { useState } from 'react';
import { Search, Edit2, Trash2 } from 'lucide-react';
import ModalEditar from './ModalEditar';
import { deleteEquipo, getEquipos } from '../services/api';

const Inventario = ({ equipos, setEquipos }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [equipoEditando, setEquipoEditando] = useState(null);

  const equiposFiltrados = equipos.filter((eq) => {
    const matchFiltro = filtro === 'todos' || eq.uso === filtro;
    const matchSearch = !searchTerm ||
      eq.codigo_equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.usuario_asignado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFiltro && matchSearch;
  });

  const handleEliminar = async (id, codigo) => {
    if (window.confirm(`¿Está seguro que desea eliminar el equipo ${codigo}?`)) {
      const result = await deleteEquipo(id);
      if (result.success) {
        const nuevosEquipos = await getEquipos();
        setEquipos(nuevosEquipos);
        mostrarNotificacion('Equipo eliminado exitosamente', 'success');
      } else {
        mostrarNotificacion('Error al eliminar el equipo', 'error');
      }
    }
  };

  const mostrarNotificacion = (mensaje, tipo) => {
    const notification = document.createElement('div');
    notification.className = `fixed top-5 right-5 px-5 py-4 rounded-lg text-white font-medium z-50 animate-slideIn bg-${tipo === 'success' ? 'green' : 'red'}-500`;
    notification.textContent = mensaje;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add('animate-slideOut');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      optimo: <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">✓ Óptimo</span>,
      regular: <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">⚠ Regular</span>,
      danado: <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">✗ Dañado</span>,
    };
    return badges[estado] || estado;
  };

  const getUsoBadge = (uso) => {
    const badges = {
      critico: <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">🔴 Crítico</span>,
      importante: <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">🟡 Importante</span>,
      basico: <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">🟢 Básico</span>,
    };
    return badges[uso] || uso;
  };

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-3 mb-5 flex items-center gap-3">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por código, usuario o ubicación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none text-sm"
        />
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        {[
          { id: 'todos', label: 'Todos' },
          { id: 'critico', label: '🔴 Críticos' },
          { id: 'importante', label: '🟡 Importantes' },
          { id: 'basico', label: '🟢 Básicos' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFiltro(btn.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filtro === btn.id
                ? 'bg-[#2a5298] text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:border-[#2a5298] hover:text-[#2a5298]'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {equipos.length >= 999 && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md mb-5 text-sm font-medium">
          ⚠️ Se ha alcanzado el límite máximo de 999 equipos. Elimine algunos para agregar nuevos.
        </div>
      )}

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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {equiposFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-gray-500">No hay equipos que coincidan con la búsqueda</td>
                </tr>
              ) : (
                equiposFiltrados.map((eq) => (
                  <tr key={eq.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{eq.codigo_equipo}</td>
                    <td className="px-4 py-3 text-sm">{eq.tipo}</td>
                    <td className="px-4 py-3 text-sm">{eq.usuario_asignado}</td>
                    <td className="px-4 py-3 text-sm">{eq.ubicacion}</td>
                    <td className="px-4 py-3 text-sm">{eq.procesador}</td>
                    <td className="px-4 py-3 text-sm">{eq.ram}</td>
                    <td className="px-4 py-3 text-sm">{getEstadoBadge(eq.estado)}</td>
                    <td className="px-4 py-3 text-sm">{getUsoBadge(eq.uso)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEquipoEditando(eq)}
                          className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors flex items-center gap-1 text-xs"
                        >
                          <Edit2 size={12} /> Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(eq.id, eq.codigo_equipo)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors flex items-center gap-1 text-xs"
                        >
                          <Trash2 size={12} /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {equipoEditando && (
        <ModalEditar
          equipo={equipoEditando}
          onClose={() => setEquipoEditando(null)}
          setEquipos={setEquipos}
        />
      )}
    </div>
  );
};

export default Inventario;