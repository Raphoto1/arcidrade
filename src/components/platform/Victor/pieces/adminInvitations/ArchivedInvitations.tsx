import React, { useState, useMemo } from "react";

import InvitationPill from "./InvitationPill";
import { useSentInvitations } from "@/hooks/useInvitation";

export default function ArchivedInvitations() {
  const { data, error, isLoading, mutate } = useSentInvitations('archived');
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
          'seleccion': 'manager'
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

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(event.target.value);
  };

  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Solicitudes Archivadas(en Desarrollo)</h1>
      </div>
      <div className='flex flex-col justify-center md:gap-1 md:h-auto align-middle items-center'>
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
        
        <label htmlFor='filter-type-archived'>Filtrar por tipo:</label>
        <select 
          id='filter-type-archived'
          name='filter-type-archived'
          className='select select-bordered w-3/4 mb-2'
          value={filterType}
          onChange={handleFilterChange}
        >
          <option value=''>Todos los tipos</option>
          <option value='profesional'>Profesional</option>
          <option value='institucion'>Institución</option>
          <option value='seleccion'>Selección</option>
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
                : `No se encontraron invitaciones archivadas${filterType ? ` de tipo "${filterType}"` : ''}`}
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
