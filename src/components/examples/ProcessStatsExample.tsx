import React from 'react';
import { useProcessStats, useProcessCountByStatus, useTopProcessStatuses } from '@/hooks/useProcessStats';

export default function ProcessStatsExample() {
  // Usar el hook principal para obtener todas las estadísticas
  const { processStats, isLoading, error } = useProcessStats();
  
  // Usar hooks específicos para contadores individuales
  const { count: activeCount } = useProcessCountByStatus('active');
  const { count: pendingCount } = useProcessCountByStatus('pending');
  
  // Obtener los top 3 status más comunes
  const { topStatuses } = useTopProcessStatuses(3);

  if (isLoading) return <div>Cargando estadísticas...</div>;
  if (error) return <div>Error al cargar estadísticas</div>;

  return (
    <div className="p-4 space-y-6">
      {/* Resumen general */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Resumen de Procesos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{processStats.active}</div>
            <div className="text-sm text-gray-600">Activos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{processStats.pending}</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{processStats.in_process}</div>
            <div className="text-sm text-gray-600">En Proceso</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{processStats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>

      {/* Ejemplo usando hooks específicos */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Usando hooks específicos:</h3>
        <p>Procesos activos: <span className="font-bold">{activeCount}</span></p>
        <p>Procesos pendientes: <span className="font-bold">{pendingCount}</span></p>
      </div>

      {/* Top status más comunes */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Top Status Más Comunes</h3>
        <div className="space-y-2">
          {topStatuses.map(({ status, count }, index) => (
            <div key={status} className="flex justify-between items-center">
              <span className="capitalize">{status.replace('_', ' ')}</span>
              <span className="font-bold">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Desglose completo */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Desglose Completo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Activos:</span>
              <span className="font-bold text-green-600">{processStats.active}</span>
            </div>
            <div className="flex justify-between">
              <span>Pendientes:</span>
              <span className="font-bold text-yellow-600">{processStats.pending}</span>
            </div>
            <div className="flex justify-between">
              <span>En Proceso:</span>
              <span className="font-bold text-blue-600">{processStats.in_process}</span>
            </div>
            <div className="flex justify-between">
              <span>Pausados:</span>
              <span className="font-bold text-orange-600">{processStats.paused}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Completados:</span>
              <span className="font-bold text-gray-600">{processStats.completed}</span>
            </div>
            <div className="flex justify-between">
              <span>Archivados:</span>
              <span className="font-bold text-gray-500">{processStats.archived}</span>
            </div>
            <div className="flex justify-between">
              <span>Rechazados:</span>
              <span className="font-bold text-red-600">{processStats.rejected}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-indigo-600">{processStats.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}