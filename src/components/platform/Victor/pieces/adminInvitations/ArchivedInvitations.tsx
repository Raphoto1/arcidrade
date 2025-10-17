import React, { useState, useMemo } from "react";

import InvitationPill from "./InvitationPill";
import { useSentInvitations } from "@/hooks/useInvitation";

export default function ArchivedInvitations() {
  const { data, error, isLoading, mutate } = useSentInvitations('archived');
  const [filterType, setFilterType] = useState<string>('');
  const invitationsData = data?.payload || [];

  // Filtrar invitaciones según el tipo seleccionado
  const filteredInvitations = useMemo(() => {
    if (!filterType || filterType === '') {
      return invitationsData;
    }
    
    return invitationsData.filter((invitation: any) => {
      // Mapear los valores del select a los valores del campo 'area'
      const typeMapping: { [key: string]: string } = {
        'profesional': 'profesional',
        'institucion': 'institution',
        'seleccion': 'manager'
      };
      
      return invitation.area?.toLowerCase() === typeMapping[filterType];
    });
  }, [invitationsData, filterType]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(event.target.value);
  };

  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Solicitudes Archivadas(en Desarrollo)</h1>
      </div>
      <div className='flex flex-col justify-center md:gap-1 md:h-auto align-middle items-center'>
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
            <p>No se encontraron invitaciones archivadas {filterType && `de tipo "${filterType}"`}</p>
          </div>
        )}
      </div>
    </div>
  );
}
