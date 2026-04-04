export interface Equipo {
  __backendId?: number;
  codigo_equipo: string;
  tipo: string;
  usuario_asignado: string;
  ubicacion: string;
  procesador: string;
  ram: string;
  disco_duro: string;
  sistema_operativo: string;
  estado: 'optimo' | 'regular' | 'danado';
  uso: 'critico' | 'importante' | 'basico';
  observaciones: string;
  fecha_registro: string;
}

export type FiltroUso = 'todos' | 'critico' | 'importante' | 'basico';
export type EstadoEquipo = 'optimo' | 'regular' | 'danado';
export type TipoUso = 'critico' | 'importante' | 'basico';