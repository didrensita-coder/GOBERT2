import React, { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { apiService } from '../../services/api';

interface AgregarEquipoProps {
  onEquipoAgregado: () => void;
  limiteAlcanzado: boolean;
}

const equipoInicial = {
  codigo_equipo: '',
  tipo: '',
  usuario_asignado: '',
  ubicacion: '',
  procesador: '',
  ram: '',
  disco_duro: '',
  sistema_operativo: '',
  estado: 'optimo' as const,
  uso: 'critico' as const,
  observaciones: '',
};

export const AgregarEquipo: React.FC<AgregarEquipoProps> = ({ onEquipoAgregado, limiteAlcanzado }) => {
  const [equipo, setEquipo] = useState(equipoInicial);
  const [loading, setLoading] = useState(false);

  const tiposEquipo = [
    'Computadora Escritorio',
    'Laptop',
    'Servidor',
    'Impresora',
    'Monitor',
    'Otro',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setEquipo({
      ...equipo,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (limiteAlcanzado) return;

    setLoading(true);
    try {
      await apiService.createEquipo(equipo);
      setEquipo(equipoInicial);
      onEquipoAgregado();
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el equipo');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEquipo(equipoInicial);
  };

  return (
    <div className="form-container">
      <div className="section-title">Registrar Nuevo Equipo</div>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="codigo_equipo">Código del Equipo *</label>
            <input
              type="text"
              id="codigo_equipo"
              value={equipo.codigo_equipo}
              onChange={handleChange}
              placeholder="Ej: PC-001"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo de Equipo *</label>
            <select id="tipo" value={equipo.tipo} onChange={handleChange} required>
              <option value="">Seleccione un tipo</option>
              {tiposEquipo.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="usuario_asignado">Usuario Asignado *</label>
            <input
              type="text"
              id="usuario_asignado"
              value={equipo.usuario_asignado}
              onChange={handleChange}
              placeholder="Nombre del usuario"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ubicacion">Ubicación (Departamento) *</label>
            <input
              type="text"
              id="ubicacion"
              value={equipo.ubicacion}
              onChange={handleChange}
              placeholder="Ej: Administración"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="procesador">Procesador</label>
            <input
              type="text"
              id="procesador"
              value={equipo.procesador}
              onChange={handleChange}
              placeholder="Ej: Intel Core i7"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ram">RAM</label>
            <input
              type="text"
              id="ram"
              value={equipo.ram}
              onChange={handleChange}
              placeholder="Ej: 16GB"
            />
          </div>

          <div className="form-group">
            <label htmlFor="disco_duro">Disco Duro</label>
            <input
              type="text"
              id="disco_duro"
              value={equipo.disco_duro}
              onChange={handleChange}
              placeholder="Ej: 512GB SSD"
            />
          </div>

          <div className="form-group">
            <label htmlFor="sistema_operativo">Sistema Operativo</label>
            <input
              type="text"
              id="sistema_operativo"
              value={equipo.sistema_operativo}
              onChange={handleChange}
              placeholder="Ej: Windows 10"
            />
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado *</label>
            <select id="estado" value={equipo.estado} onChange={handleChange} required>
              <option value="optimo">Óptimo</option>
              <option value="regular">Regular</option>
              <option value="danado">Dañado</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="uso">Clasificación de Uso *</label>
            <select id="uso" value={equipo.uso} onChange={handleChange} required>
              <option value="critico">🔴 Crítico (Administración, Servidores)</option>
              <option value="importante">🟡 Importante (Uso diario)</option>
              <option value="basico">🟢 Básico (Uso ocasional)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            value={equipo.observaciones}
            onChange={handleChange}
            placeholder="Notas adicionales sobre el equipo..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading || limiteAlcanzado}>
            <Save size={16} />
            {loading ? 'Guardando...' : 'Guardar Equipo'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            <RotateCcw size={16} />
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};