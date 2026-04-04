import { useState, useEffect } from 'react';
import { Equipo } from '../types';
import { apiService } from '../services/api';

export const useEquipos = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEquipos = async () => {
    setLoading(true);
    try {
      const data = await apiService.getEquipos();
      setEquipos(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar equipos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createEquipo = async (equipo: Omit<Equipo, '__backendId' | 'fecha_registro'>) => {
    try {
      const nuevoEquipo = await apiService.createEquipo(equipo);
      setEquipos([...equipos, nuevoEquipo]);
      return nuevoEquipo;
    } catch (err) {
      setError('Error al crear equipo');
      throw err;
    }
  };

  const updateEquipo = async (equipo: Equipo) => {
    try {
      const equipoActualizado = await apiService.updateEquipo(equipo);
      setEquipos(equipos.map(eq => eq.__backendId === equipoActualizado.__backendId ? equipoActualizado : eq));
      return equipoActualizado;
    } catch (err) {
      setError('Error al actualizar equipo');
      throw err;
    }
  };

  const deleteEquipo = async (id: number) => {
    try {
      await apiService.deleteEquipo(id);
      setEquipos(equipos.filter(eq => eq.__backendId !== id));
    } catch (err) {
      setError('Error al eliminar equipo');
      throw err;
    }
  };

  useEffect(() => {
    loadEquipos();
  }, []);

  return {
    equipos,
    loading,
    error,
    loadEquipos,
    createEquipo,
    updateEquipo,
    deleteEquipo,
  };
};