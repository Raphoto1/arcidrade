import { useMemo } from 'react';
import { useAllProcesses } from './useProcess';

interface ProcessStats {
  active: number;
  pending: number;
  completed: number;
  archived: number;
  paused: number;
  in_process: number;
  rejected: number;
  total: number;
  [key: string]: number; // Para permitir otros status dinámicos
}

export const useProcessStats = () => {
  const { data, error, isLoading } = useAllProcesses();

  const processStats: ProcessStats = useMemo(() => {
    if (!data?.payload || !Array.isArray(data.payload)) {
      return {
        active: 0,
        pending: 0,
        completed: 0,
        archived: 0,
        paused: 0,
        in_process: 0,
        rejected: 0,
        total: 0
      };
    }

    const processes = data.payload;
    const stats = processes.reduce((acc: any, process: any) => {
      const status = process.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Calcular el total simplemente usando la longitud del array
    const total = processes.length;

    return {
      active: stats.active || 0,
      pending: stats.pending || 0,
      completed: stats.completed || 0,
      archived: stats.archived || 0,
      paused: stats.paused || 0,
      in_process: stats.in_process || 0,
      rejected: stats.rejected || 0,
      total: total,
      ...stats // Incluye cualquier status adicional que pueda existir
    };
  }, [data]);

  return {
    processStats,
    isLoading,
    error,
    rawData: data?.payload
  };
};

// Hook para obtener estadísticas de un status específico
export const useProcessCountByStatus = (status: string) => {
  const { processStats, isLoading, error } = useProcessStats();
  
  return {
    count: processStats[status] || 0,
    isLoading,
    error
  };
};

// Hook para obtener los procesos más comunes (top N status)
export const useTopProcessStatuses = (limit: number = 5) => {
  const { processStats, isLoading, error } = useProcessStats();

  const topStatuses = useMemo(() => {
    const entries = Object.entries(processStats)
      .filter(([key]) => key !== 'total') // Excluir el total
      .sort(([, a], [, b]) => b - a) // Ordenar de mayor a menor
      .slice(0, limit); // Tomar solo los primeros N

    return entries.map(([status, count]) => ({ status, count }));
  }, [processStats, limit]);

  return {
    topStatuses,
    isLoading,
    error
  };
};