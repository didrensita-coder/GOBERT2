import React, { useState } from 'react';
import { Search, Edit2, Trash2 } from 'lucide-react';
import { Equipo, FiltroUso } from '../../types';

interface InventarioProps {
  equipos: Equipo[];
  onEdit: (equipo: Equipo) => void;
  onDelete: (id: number) => void;
}

export const Inventario: React.FC<InventarioProps> = ({ equipos, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtro, setFiltro] = useState<FiltroUso>('todos');

  const filtros: { value: FiltroUso; label: string; emoji?: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'critico', label: 'Críticos', emoji: '🔴' },
    { value: 'importante', label: 'Importantes', emoji: '🟡' },
    { value: 'basico', label: 'Básicos', emoji: '🟢' },
  ];

  const equiposFiltrados = equipos.filter((eq) => {
    const matchFiltro = filtro === 'todos' || eq.uso === filtro;
    const matchSearch =
      !searchTerm ||
      eq.codigo_equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.usuario_asignado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFiltro && matchSearch;
  });

  const getEstadoBadge = (estado: string) => {
    const badges = {
      optimo: 'badge-optimo',
      regular: 'badge-regular',
      danado: 'badge-danado',
    };
    const textos = {
      optimo: '✓ Óptimo',
      regular: '⚠ Regular',
      danado: '✗ Dañado',
    };
    return { className: badges[estado as keyof typeof badges], text: textos[estado as keyof typeof textos] };
  };

  const getUsoBadge = (uso: string) => {
    const badges = {
      critico: 'badge-critical',
      importante: 'badge-important',
      basico: 'badge-basic',
    };
    const textos = {
      critico: '🔴 Crítico',
      importante: '🟡 Importante',
      basico: '🟢 Básico',
    };
    return { className: badges[uso as keyof typeof badges], text: textos[uso as keyof typeof textos] };
  };

  const isLimitReached = equipos.length >= 999;

  return (
    <div>
      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Buscar por código, usuario o ubicación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-section">
        {filtros.map((f) => (
          <button
            key={f.value}
            className={`filter-btn ${filtro === f.value ? 'active' : ''}`}
            onClick={() => setFiltro(f.value)}
          >
            {f.emoji && `${f.emoji} `}{f.label}
          </button>
        ))}
      </div>

      {isLimitReached && (
        <div className="limit-warning">
          ⚠️ Se ha alcanzado el límite máximo de 999 equipos. Elimine algunos para agregar nuevos.
        </div>
      )}

      <div className="table-container">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Tipo</th>
                <th>Usuario</th>
                <th>Ubicación</th>
                <th>Procesador</th>
                <th>RAM</th>
                <th>Estado</th>
                <th>Uso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {equiposFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty-state">
                    No hay equipos que coincidan con la búsqueda
                  </td>
                </tr>
              ) : (
                equiposFiltrados.map((eq) => {
                  const estado = getEstadoBadge(eq.estado);
                  const uso = getUsoBadge(eq.uso);
                  return (
                    <tr key={eq.__backendId}>
                      <td>
                        <strong>{eq.codigo_equipo}</strong>
                      </td>
                      <td>{eq.tipo}</td>
                      <td>{eq.usuario_asignado}</td>
                      <td>{eq.ubicacion}</td>
                      <td>{eq.procesador}</td>
                      <td>{eq.ram}</td>
                      <td>
                        <span className={`badge ${estado.className}`}>{estado.text}</span>
                      </td>
                      <td>
                        <span className={`badge ${uso.className}`}>{uso.text}</span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button className="btn-icon" onClick={() => onEdit(eq)}>
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="btn-icon delete"
                            onClick={() => eq.__backendId && onDelete(eq.__backendId)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};