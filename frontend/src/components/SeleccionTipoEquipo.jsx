import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Printer, Cpu, ArrowLeft } from 'lucide-react';

const SeleccionTipoEquipo = () => {
  const navigate = useNavigate();

  const tiposEquipo = [
    {
      id: 'computadora',
      nombre: 'Computadora / CPU',
      icono: '🖥️',
      color: 'from-blue-500 to-blue-700',
      descripcion: 'Registrar equipo de escritorio o laptop'
    },
    {
      id: 'impresora',
      nombre: 'Impresora',
      icono: '🖨️',
      color: 'from-green-500 to-green-700',
      descripcion: 'Registrar impresora multifuncional'
    },
    {
      id: 'monitor',
      nombre: 'Monitor',
      icono: '🖥️',
      color: 'from-purple-500 to-purple-700',
      descripcion: 'Registrar monitor o pantalla'
    }
  ];

  const handleSeleccion = (tipo) => {
    navigate(`/agregar/${tipo}`);
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          onClick={() => navigate('/dashboard/resumen')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={18} />
          Volver al Dashboard
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-[#1e3c72] mb-6 text-center">Selecciona el tipo de equipo</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiposEquipo.map((tipo) => (
            <button
              key={tipo.id}
              onClick={() => handleSeleccion(tipo.id)}
              className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center hover:border-[#1e3c72] hover:shadow-lg transition-all"
            >
              <div className="text-6xl mb-4">{tipo.icono}</div>
              <h3 className="text-lg font-bold text-gray-800">{tipo.nombre}</h3>
              <p className="text-gray-500 text-sm mt-2">{tipo.descripcion}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeleccionTipoEquipo;