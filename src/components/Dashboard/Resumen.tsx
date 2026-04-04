import React, { useEffect, useState } from 'react';
import { Equipo } from '../../types';

interface ResumenProps {
  equipos: Equipo[];
}

export const Resumen: React.FC<ResumenProps> = ({ equipos }) => {
  const [stats, setStats] = useState({
    critico: 0, importante: 0, basico: 0,
    optimo: 0, regular: 0, danado: 0,
  });

  useEffect(() => {
    const nuevosStats = equipos.reduce(
      (acc, eq) => {
        acc[eq.uso]++;
        acc[eq.estado]++;
        return acc;
      },
      { critico: 0, importante: 0, basico: 0, optimo: 0, regular: 0, danado: 0 }
    );
    setStats(nuevosStats);
  }, [equipos]);

  const getEstadoBadge = (estado: string) => {
    const clases = {
      optimo: 'badge-optimo', regular: 'badge-regular', danado: 'badge-danado'
    };
    const textos = {
      optimo: '✓ Óptimo', regular: '⚠ Regular', danado: '✗ Dañado'
    };
    return <span className={`badge ${clases[estado as keyof typeof clases]}`}>{textos[estado as keyof typeof textos]}</span>;
  };

  const getUsoBadge = (uso: string) => {
    const clases = {
      critico: 'badge-critical', importante: 'badge-important', basico: 'badge-basic'
    };
    const textos = {
      critico: '🔴 Crítico', importante: '🟡 Importante', basico: '🟢 Básico'
    };
    return <span className={`badge ${clases[uso as keyof typeof clases]}`}>{textos[uso as keyof typeof textos]}</span>;
  };

  const recientes = [...equipos].slice(-5).reverse();

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card critical">
          <div className="stat-label">Equipos Críticos</div>
          <div className="stat-value">{stats.critico}</div>
        </div>
        <div className="stat-card important">
          <div className="stat-label">Equipos Importantes</div>
          <div className="stat-value">{stats.importante}</div>
        </div>
        <div className="stat-card basic">
          <div className="stat-label">Equipos Básicos</div>
          <div className="stat-value">{stats.basico}</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeftColor: '#27ae60' }}>
          <div className="stat-label">Estado Óptimo</div>
          <div className="stat-value">{stats.optimo}</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#f39c12' }}>
          <div className="stat-label">Estado Regular</div>
          <div className="stat-value">{stats.regular}</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#e74c3c' }}>
          <div className="stat-label">Estado Dañado</div>
          <div className="stat-value">{stats.danado}</div>
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        <div className="section-title">Últimos Equipos Registrados</div>
        <div className="table-container">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Código</th><th>Tipo</th><th>Usuario</th>
                  <th>Ubicación</th><th>Estado</th><th>Uso</th>
                </tr>
              </thead>
              <tbody>
                {recientes.length === 0 ? (
                  <tr><td colSpan={6} className="empty-state">Sin equipos registrados</td></tr>
                ) : (
                  recientes.map((eq) => (
                    <tr key={eq.__backendId}>
                      <td><strong>{eq.codigo_equipo}</strong></td>
                      <td>{eq.tipo}</td>
                      <td>{eq.usuario_asignado}</td>
                      <td>{eq.ubicacion}</td>
                      <td>{getEstadoBadge(eq.estado)}</td>
                      <td>{getUsoBadge(eq.uso)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};