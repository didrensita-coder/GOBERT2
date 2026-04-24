import React, { useState, useEffect } from 'react';

const Resumen = ({ equipos }) => {
  const [stats, setStats] = useState({
    // Por uso
    critico: 0,
    importante: 0,
    basico: 0,
    // Por estado
    optimo: 0,
    regular: 0,
    danado: 0,
    // Por tipo
    computadoras: 0,
    laptops: 0,
    impresoras: 0,
    monitores: 0,
    servidores: 0,
    otros: 0,
  });

  const [recientes, setRecientes] = useState([]);

  useEffect(() => {
    // Calcular estadísticas directamente desde los equipos
    const nuevosStats = {
      // Por uso
      critico: equipos.filter(eq => eq.uso === 'critico').length,
      importante: equipos.filter(eq => eq.uso === 'importante').length,
      basico: equipos.filter(eq => eq.uso === 'basico').length,
      // Por estado (normalizar: bueno = optimo, malo = danado)
      optimo: equipos.filter(eq => eq.estado === 'bueno' || eq.estado === 'optimo').length,
      regular: equipos.filter(eq => eq.estado === 'regular').length,
      danado: equipos.filter(eq => eq.estado === 'malo' || eq.estado === 'danado').length,
      // Por tipo
      computadoras: equipos.filter(eq => eq.tipo === 'computadora_escritorio').length,
      laptops: equipos.filter(eq => eq.tipo === 'laptop').length,
      impresoras: equipos.filter(eq => eq.tipo === 'impresora').length,
      monitores: equipos.filter(eq => eq.tipo === 'monitor').length,
      servidores: equipos.filter(eq => eq.tipo === 'servidor').length,
      otros: equipos.filter(eq => eq.tipo === 'otro' || eq.tipo === 'tablet' || eq.tipo === 'telefono').length,
    };
    setStats(nuevosStats);

    // Obtener los 5 equipos más recientes (ordenados por fecha_registro)
    const equiposOrdenados = [...equipos].sort((a, b) => {
      const fechaA = new Date(a.fecha_registro);
      const fechaB = new Date(b.fecha_registro);
      return fechaB - fechaA; // Más reciente primero
    });
    
    const ultimos5 = equiposOrdenados.slice(0, 5);
    setRecientes(ultimos5);
  }, [equipos]);

  const getEstadoBadge = (estado) => {
    const estadoNormalizado = estado === 'bueno' ? 'optimo' : (estado === 'malo' ? 'danado' : estado);
    const badges = {
      optimo: <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">✓ Óptimo</span>,
      regular: <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">⚠ Regular</span>,
      danado: <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">✗ Dañado</span>,
    };
    return badges[estadoNormalizado] || <span>{estado}</span>;
  };

  const getUsoBadge = (uso) => {
    const badges = {
      critico: <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">🔴 Crítico</span>,
      importante: <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">🟡 Importante</span>,
      basico: <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">🟢 Básico</span>,
    };
    return badges[uso] || <span>{uso}</span>;
  };

  const getTipoIcono = (tipo) => {
    const iconos = {
      computadora_escritorio: '🖥️',
      laptop: '💻',
      impresora: '🖨️',
      monitor: '🖥️',
      servidor: '🗄️',
    };
    return iconos[tipo] || '📦';
  };

  const getNombreTipo = (tipo) => {
    const nombres = {
      computadora_escritorio: 'Computadora',
      laptop: 'Laptop',
      impresora: 'Impresora',
      monitor: 'Monitor',
      servidor: 'Servidor',
    };
    return nombres[tipo] || tipo;
  };

  return (
    <div>
      {/* Tarjetas de USO */}
      <h3 className="text-lg font-semibold text-gray-700 mb-3">📊 Clasificación por Uso</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-red-500">
          <div className="text-xs text-gray-500 uppercase font-semibold mb-2">🔴 Equipos Críticos</div>
          <div className="text-3xl font-bold text-[#1e3c72]">{stats.critico}</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-orange-500">
          <div className="text-xs text-gray-500 uppercase font-semibold mb-2">🟡 Equipos Importantes</div>
          <div className="text-3xl font-bold text-[#1e3c72]">{stats.importante}</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-green-500">
          <div className="text-xs text-gray-500 uppercase font-semibold mb-2">🟢 Equipos Básicos</div>
          <div className="text-3xl font-bold text-[#1e3c72]">{stats.basico}</div>
        </div>
      </div>

      {/* Tarjetas de ESTADO */}
      <h3 className="text-lg font-semibold text-gray-700 mb-3">🔧 Estado de los Equipos</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-green-600">
          <div className="text-xs text-gray-500 uppercase font-semibold mb-2">✅ Estado Óptimo</div>
          <div className="text-3xl font-bold text-[#1e3c72]">{stats.optimo}</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-yellow-500">
          <div className="text-xs text-gray-500 uppercase font-semibold mb-2">⚠️ Estado Regular</div>
          <div className="text-3xl font-bold text-[#1e3c72]">{stats.regular}</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-red-500">
          <div className="text-xs text-gray-500 uppercase font-semibold mb-2">❌ Estado Dañado</div>
          <div className="text-3xl font-bold text-[#1e3c72]">{stats.danado}</div>
        </div>
      </div>

      {/* Tarjetas de TIPO DE EQUIPO */}
      <h3 className="text-lg font-semibold text-gray-700 mb-3">🖱️ Equipos por Tipo</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-2">🖥️</div>
          <div className="text-2xl font-bold text-[#1e3c72]">{stats.computadoras}</div>
          <div className="text-xs text-gray-500">Computadoras</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-2">🖨️</div>
          <div className="text-2xl font-bold text-[#1e3c72]">{stats.impresoras}</div>
          <div className="text-xs text-gray-500">Impresoras</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-2">🖥️</div>
          <div className="text-2xl font-bold text-[#1e3c72]">{stats.monitores}</div>
          <div className="text-xs text-gray-500">Monitores</div>
        </div>
      </div>

      {/* Tabla de últimos equipos */}
      <div>
        <h2 className="text-xl font-bold text-[#1e3c72] mb-5">📋 Últimos Equipos Registrados</h2>
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recientes.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-gray-500">Sin equipos registrados</td>
                  </tr>
                ) : (
                  recientes.map((eq, index) => (
                    <tr key={eq.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{eq.codigo_equipo}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="flex items-center gap-1">
                          {getTipoIcono(eq.tipo)} {getNombreTipo(eq.tipo)}
                        </span>
                       </td>
                      <td className="px-4 py-3 text-sm">{eq.usuario_asignado}</td>
                      <td className="px-4 py-3 text-sm">{eq.ubicacion}</td>
                      <td className="px-4 py-3 text-sm">{getEstadoBadge(eq.estado)}</td>
                      <td className="px-4 py-3 text-sm">{getUsoBadge(eq.uso)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {eq.fecha_registro ? new Date(eq.fecha_registro).toLocaleDateString('es-ES') : 'N/A'}
                      </td>
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