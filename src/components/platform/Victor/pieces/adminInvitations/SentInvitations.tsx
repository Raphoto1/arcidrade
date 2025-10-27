import React, { useState, useMemo } from "react";

import InvitationPill from "./InvitationPill";
import { useSentInvitations } from "@/hooks/useInvitation";

export default function SentInvitations() {
  const { data, error, isLoading, mutate } = useSentInvitations('invited');
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
        'seleccion': 'selection'
      };
      
      return invitation.area?.toLowerCase() === typeMapping[filterType];
    });
  }, [invitationsData, filterType]);

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
            <p>No se encontraron invitaciones {filterType && `de tipo "${filterType}"`}</p>
          </div>
        )}
      </div>
    </div>
  );
}
