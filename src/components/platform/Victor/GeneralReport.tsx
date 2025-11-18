import React, { useState } from "react";
import { useProcessStats } from "@/hooks/useProcessStats";
import { useUserStats } from "@/hooks/useUserStats";

export default function GeneralReport() {
  const { processStats, isLoading: processLoading, error: processError } = useProcessStats();
  const { userStats, isLoading: userLoading, error: userError } = useUserStats();
  
  // Estados para controlar dropdowns - usuarios desplegado por defecto
  const [showProcesses, setShowProcesses] = useState(false);
  const [showUsers, setShowUsers] = useState(true);

  const isLoading = processLoading || userLoading;
  const error = processError || userError;

  if (isLoading) {
    return (
      <div className='description bg-gray-200 p-4 rounded-sm z-10 md:w-1/3'>
        <h1 className='text-xl font-bold font-var(--font-oswald) mb-4'>Informe General</h1>
        <div className="flex justify-center items-center h-32">
          <div className="loading loading-spinner loading-md"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='description bg-gray-200 p-4 rounded-sm z-10 md:w-1/3'>
        <h1 className='text-xl font-bold font-var(--font-oswald) mb-4'>Informe General</h1>
        <div className="flex flex-col justify-center items-center h-32">
          <p className="text-error text-center">Error al cargar datos</p>
          {typeof error === 'string' && (
            <p className="text-error text-xs text-center mt-2">{error}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='description bg-gray-200 p-3 rounded-sm z-10 w-full'>
      <h1 className='text-lg font-bold font-var(--font-oswald) mb-3'>Informe General</h1>
      
      {/* Sección de Procesos - Dropdown */}
      <div className="mb-3">
        <button
          onClick={() => setShowProcesses(!showProcesses)}
          className="w-full flex justify-between items-center p-2 bg-white rounded hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-semibold text-gray-600 flex items-center">
            <span className="mr-2">📊</span>Procesos
          </span>
          <span className={`transform transition-transform text-gray-400 ${showProcesses ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
        {showProcesses && (
          <div className="mt-2">
            <div className="grid grid-cols-2 gap-1 mb-2">
              <div className='flex justify-between items-center p-1.5 bg-white rounded text-xs'>
                <span className='text-gray-600'>Activos</span>
                <span className="font-bold text-green-600">{processStats.active}</span>
              </div>
              
              <div className='flex justify-between items-center p-1.5 bg-white rounded text-xs'>
                <span className='text-gray-600'>Pendientes</span>
                <span className="font-bold text-yellow-600">{processStats.pending}</span>
              </div>
              
              <div className='flex justify-between items-center p-1.5 bg-white rounded text-xs'>
                <span className='text-gray-600'>Finalizados</span>
                <span className="font-bold text-gray-600">{processStats.completed}</span>
              </div>
              
              <div className='flex justify-between items-center p-1.5 bg-white rounded text-xs'>
                <span className='text-gray-600'>Archivados</span>
                <span className="font-bold text-gray-500">{processStats.archived}</span>
              </div>
            </div>
            
            <div className='flex justify-between items-center p-2 bg-[var(--main-arci)] bg-opacity-10 rounded border border-[var(--main-arci)] border-opacity-20'>
              <span className='text-[var(--soft-arci)] font-bold text-sm'>Total Procesos</span>
              <span className="font-bold text-[var(--soft-arci)] text-base">{processStats.total}</span>
            </div>
          </div>
        )}
      </div>

      {/* Sección de Usuarios - Dropdown (desplegado por defecto) */}
      <div>
        <button
          onClick={() => setShowUsers(!showUsers)}
          className="w-full flex justify-between items-center p-2 bg-white rounded hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-semibold text-gray-600 flex items-center">
            <span className="mr-2">👥</span>Usuarios
          </span>
          <span className={`transform transition-transform text-gray-400 ${showUsers ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
        {showUsers && (
          <div className="mt-2">
            <div className="grid grid-cols-2 gap-1 mb-2">
              <div className='flex justify-between items-center p-1.5 bg-white rounded text-xs'>
                <span className='text-gray-600'>Invitados</span>
                <span className="font-bold text-blue-600">
                  {userLoading ? <span className="loading loading-spinner loading-xs"></span> : userError ? "-" : userStats.invited}
                </span>
              </div>
              
              <div className='flex justify-between items-center p-1.5 bg-white rounded text-xs'>
                <span className='text-gray-600'>Registrados</span>
                <span className="font-bold text-orange-600">
                  {userLoading ? <span className="loading loading-spinner loading-xs"></span> : userError ? "-" : userStats.registered}
                </span>
              </div>
              
              <div className='flex justify-between items-center p-1.5 bg-white rounded text-xs'>
                <span className='text-gray-600'>Activos</span>
                <span className="font-bold text-green-600">
                  {userLoading ? <span className="loading loading-spinner loading-xs"></span> : userError ? "-" : userStats.active}
                </span>
              </div>
              
              <div className='flex justify-between items-center p-1.5 bg-white rounded text-xs'>
                <span className='text-gray-600'>Pausados</span>
                <span className="font-bold text-red-600">
                  {userLoading ? <span className="loading loading-spinner loading-xs"></span> : userError ? "-" : userStats.deactivated}
                </span>
              </div>
            </div>
            
            <div className='flex justify-between items-center p-2 bg-[var(--main-arci)] bg-opacity-10 rounded border border-[var(--main-arci)] border-opacity-20'>
              <span className='text-[var(--soft-arci)] font-bold text-sm'>Total Usuarios</span>
              <span className="font-bold text-[var(--soft-arci)] text-base">
                {userLoading ? <span className="loading loading-spinner loading-sm"></span> : userError ? "-" : userStats.total}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}