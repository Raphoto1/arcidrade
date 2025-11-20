import React, { useState, useMemo } from "react";

import InvitationPill from "./InvitationPill";
import { useSentInvitations } from "@/hooks/useInvitation";

export default function SentInvitations() {
  const { data, error, isLoading, mutate } = useSentInvitations('invited');
  const [filterType, setFilterType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  

  const invitationsData = data?.payload || [];

  // Filtrar invitaciones según el tipo seleccionado y búsqueda
  const filteredInvitations = useMemo(() => {
    let filtered = invitationsData;
    
    // Filtrar por tipo
    if (filterType && filterType !== '') {
      filtered = filtered.filter((invitation: any) => {
        // Mapear los valores del select a los valores del campo 'area'
        const typeMapping: { [key: string]: string } = {
          'profesional': 'profesional',
          'institucion': 'institution',
          'seleccion': 'selection'
        };
        
        return invitation.area?.toLowerCase() === typeMapping[filterType];
      });
    }
    
    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((invitation: any) =>
        invitation.email?.toLowerCase().includes(query) ||
        invitation.nombre?.toLowerCase().includes(query) ||
        invitation.apellido?.toLowerCase().includes(query) ||
        invitation.referCode?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [invitationsData, filterType, searchQuery]);

  // Contar invitaciones por tipo
  const countByType = useMemo(() => {
    const counts = {
      profesional: 0,
      institution: 0,
      manager: 0
    };
    
    invitationsData.forEach((invitation: any) => {
      const area = invitation.area?.toLowerCase();
      if (area === 'profesional') counts.profesional++;
      else if (area === 'institution') counts.institution++;
      else if (area === 'manager') counts.manager++;
    });
    
    return counts;
  }, [invitationsData]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(event.target.value);
  };
  
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Solicitudes Pendientes</h1>
        <div className="text-center mt-2">
          <div className="stats stats-horizontal shadow-sm bg-white flex-wrap">
            <div className="stat py-2 px-4">
              <div className="stat-title text-xs">Total</div>
              <div className="stat-value text-lg text-[var(--main-arci)]">
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : error ? (
                  <span className="text-error">-</span>
                ) : (
                  invitationsData.length
                )}
              </div>
            </div>
            
            <div className="stat py-2 px-4">
              <div className="stat-title text-xs">Profesionales</div>
              <div className="stat-value text-lg text-blue-600">
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : error ? (
                  <span className="text-error">-</span>
                ) : (
                  countByType.profesional
                )}
              </div>
            </div>

            <div className="stat py-2 px-4">
              <div className="stat-title text-xs">Instituciones</div>
              <div className="stat-value text-lg text-green-600">
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : error ? (
                  <span className="text-error">-</span>
                ) : (
                  countByType.institution
                )}
              </div>
            </div>

            <div className="stat py-2 px-4">
              <div className="stat-title text-xs">Selección</div>
              <div className="stat-value text-lg text-purple-600">
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : error ? (
                  <span className="text-error">-</span>
                ) : (
                  countByType.manager
                )}
              </div>
            </div>

            {filterType && (
              <div className="stat py-2 px-4">
                <div className="stat-title text-xs">Filtradas</div>
                <div className="stat-value text-lg text-[var(--soft-arci)]">
                  {filteredInvitations.length}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center md:gap-1 md:h-auto align-middle items-center">
        {/* Campo de búsqueda */}
        <div className='w-full px-2 mb-3'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Buscar por email, nombre, apellido o código...'
              className='input input-bordered w-full bg-white text-[var(--main-arci)] border-[var(--main-arci)]/20 focus:border-[var(--main-arci)] fontRoboto pr-10'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--main-arci)]/40 hover:text-[var(--main-arci)] transition-colors'
                title='Limpiar búsqueda'>
                <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            ) : (
              <svg
                className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--main-arci)]/40'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            )}
          </div>
        </div>
        
        <label htmlFor="filter-type">Filtrar por tipo:</label>
        <select 
          id="filter-type"
          name="filter-type" 
          className="select select-bordered w-3/4 mb-2"
          value={filterType}
          onChange={handleFilterChange}
        >
          <option value="">Todos los tipos ({invitationsData.length})</option>
          <option value="profesional">Profesional ({countByType.profesional})</option>
          <option value="institucion">Institución ({countByType.institution})</option>
          <option value="manager">Selección ({countByType.manager})</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        {filteredInvitations.map((invitation: any) => (
          <InvitationPill key={invitation.referCode} invitationData={{ ...invitation }} />
        ))}
        {filteredInvitations.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            <p>
              {searchQuery
                ? `No se encontraron resultados para "${searchQuery}"${filterType ? ` en tipo "${filterType}"` : ''}`
                : `No se encontraron invitaciones${filterType ? ` de tipo "${filterType}"` : ''}`}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className='btn btn-sm bg-[var(--main-arci)] hover:bg-[var(--main-arci)]/90 text-white mt-2'>
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
