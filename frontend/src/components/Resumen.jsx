import React, { useState, useEffect } from 'react';
import { getStats } from '../services/api';

const Resumen = ({ equipos }) => {
  const [stats, setStats] = useState({
    critico: 0,
    importante: 0,
    basico: 0,
    optimo: 0,
    regular: 0,
    danado: 0,
  });

  useEffect(() => {
    cargarStats();
  }, [equipos]);

  const cargarStats = async () => {
    const data = await getStats();
    if (data) setStats(data);
  };

  const recientes = [...equipos].slice(-5).reverse();

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-red-500">
          <div className="text-xs text-gray-500 uppercase font-semibold mb-2">Equipos Críticos</div>
          <div className="text-3xl font-bold text-[#1e3c72]">{stats.critico}</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-orange-500">
          <div className="text-xs text-gray-500 uppercase font-semibold mb-2">Equipos Importantes</div>
          <div className="text-3xl font-bold text-[#1e3c72]">{stats.importante}</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-green-500">
          <div className="text-xs text-gray-500 uppercase font-semibold mb-2">Equipos Básicos</div>
          <div className="text-3xl font-bold text-[#1e3c72]">{stats.basico}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-green-600">
          <div className="text-xs text-gray-500 uppercase font-semibold mb-2">Estado Óptimo</div>
          <div className="text-3xl font-bold text-[#1e3c72]">{stats.optimo}</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-yellow-500">
          <div className="text-xs text-gray-500 uppercase font-semibold mb-2">Estado Regular</div>
          <div className="text-3xl font-bold text-[#1e3c72]">{stats.regular}</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-red-500">
          <div className="text-xs text-gray-500 uppercase font-semibold mb-2">Estado Dañado</div>
          <div className="text-3xl font-bold text-[#1e3c72]">{stats.danado}</div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#1e3c72] mb-5">Últimos Equipos Registrados</h2>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Código</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Usuario</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ubicación</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Uso</th>
                </tr>
              </thead>
              <tbody>
                {recientes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-500">Sin equipos registrados</td>
                  </tr>
                ) : (
                  recientes.map((eq) => (
                    <tr key={eq.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{eq.codigo_equipo}</td>
                      <td className="px-4 py-3 text-sm">{eq.tipo}</td>
                      <td className="px-4 py-3 text-sm">{eq.usuario_asignado}</td>
                      <td className="px-4 py-3 text-sm">{eq.ubicacion}</td>
                      <td className="px-4 py-3 text-sm">{getEstadoBadge(eq.estado)}</td>
                      <td className="px-4 py-3 text-sm">{getUsoBadge(eq.uso)}</td>
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

export default Resumen;