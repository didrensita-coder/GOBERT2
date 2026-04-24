import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Printer, Cpu, ArrowLeft, TrendingUp, CheckCircle } from 'lucide-react';

const SeleccionTipoEquipo = () => {
  const navigate = useNavigate();

  const tiposEquipo = [
    {
      id: 'computadora',
      nombre: 'Computadora / CPU',
      descripcion: 'Registra componentes del CPU',
      precio: 'Especificaciones técnicas',
      icono: <Cpu size={48} />,
      imagen: '🖥️',
      color: 'from-blue-800 to-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'hover:border-blue-500',
      caracteristicas: ['Procesador', 'RAM', 'Disco Duro', 'Sistema Operativo']
    },
    {
      id: 'impresora',
      nombre: 'Impresora',
      descripcion: 'Registra impresoras multifuncionales y de red',
      precio: 'Datos de identificación',
      icono: <Printer size={48} />,
      imagen: '🖨️',
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'hover:border-green-500',
      caracteristicas: ['Marca', 'Modelo', 'Serial', 'Ubicación']
    },
    {
      id: 'monitor',
      nombre: 'Monitor',
      descripcion: 'Registra monitores',
      precio: 'Características visuales',
      icono: <Monitor size={48} />,
      imagen: '🖥️',
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'hover:border-purple-500',
      caracteristicas: ['Marca', 'Modelo', 'Tamaño', 'Resolución']
    }
  ];

  const handleSeleccion = (tipo) => {
    navigate(`/agregar/${tipo}`);
  };

  return (
    <div className="p-6">
      {/* Botón volver */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/resumen')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          Volver al Dashboard
        </button>
      </div>

      {/* Título */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#1e3c72] mb-2">Selecciona el tipo de equipo</h2>
        <p className="text-gray-500">Elige la categoría del equipo que deseas registrar</p>
      </div>

      {/* Tarjetas estilo producto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiposEquipo.map((tipo) => (
          <div
            key={tipo.id}
            onClick={() => handleSeleccion(tipo.id)}
            className={`group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 border-transparent ${tipo.borderColor}`}
          >
            {/* Imagen/Icono superior */}
            <div className={`${tipo.bgColor} p-8 text-center relative overflow-hidden`}>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <TrendingUp className="text-gray-400" size={20} />
              </div>
              <div className={`inline-flex p-6 rounded-full bg-gradient-to-r ${tipo.color} text-white mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {tipo.icono}
              </div>
              <div className="text-6xl absolute bottom-0 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {tipo.imagen}
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{tipo.nombre}</h3>
              <p className="text-gray-500 text-sm mb-4">{tipo.descripcion}</p>
              
              {/* Precio (simulado) */}
              <div className="mb-4">
                <span className="text-xs text-gray-400 uppercase tracking-wide">Información</span>
                <div className="text-lg font-semibold text-[#1e3c72]">{tipo.precio}</div>
              </div>

              {/* Características */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {tipo.caracteristicas.map((carac, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {carac}
                    </span>
                  ))}
                </div>
              </div>

              {/* Botón de acción */}
              <button
                className={`w-full mt-2 py-2 rounded-lg bg-gradient-to-r ${tipo.color} text-white font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2`}
              >
                <CheckCircle size={18} />
                Registrar {tipo.nombre.split(' ')[0]}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer informativo */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">
          Ingreso de datos de equipos
        </p>
      </div>
    </div>
  );
};

export default SeleccionTipoEquipo;