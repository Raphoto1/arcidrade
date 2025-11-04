'use client'
import React, { useState, useMemo } from "react";
import { ImSearch } from "react-icons/im";

import ProfesionalPill from "./ProfesionalPill";
import { usePaginatedProfesionals } from "@/hooks/usePlatPro";

// Helper function para obtener nombre completo (no hook)
const getFullName = (name?: string | null, lastName?: string | null) => {
  if (!name && !lastName) return '';
  if (!name) return lastName || '';
  if (!lastName) return name || '';
  return `${name} ${lastName}`;
};

export default function ActiveProfesionals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  const { data, error, isLoading } = usePaginatedProfesionals(currentPage, itemsPerPage);
  
  // Filtrar profesionales por término de búsqueda
  const filteredProfesionals = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) {
      return [];
    }
    
    // Primero filtrar elementos válidos
    const validProfesionals = data.data.filter((profesional: any) => {
      return profesional && typeof profesional === 'object' && profesional.referCode;
    });
    
    if (!searchTerm.trim()) {
      return validProfesionals;
    }
    
    const filtered = validProfesionals.filter((profesional: any) => {
      try {
        const searchLower = searchTerm.toLowerCase();
        const profesionalData = profesional.profesional_data || {};
        const mainStudy = profesional.main_study || {};
        const specialization = profesional.study_specialization?.[0] || {};
        
        // Usar la función helper para obtener el nombre completo
        const fullName = getFullName(profesionalData.name, profesionalData.last_name)?.toLowerCase() || '';
        const email = profesional.email?.toLowerCase() || '';
        const mainStudyTitle = mainStudy.title?.toLowerCase() || '';
        const specializationTitle = specialization.title?.toLowerCase() || '';
        const mainStudyInstitution = mainStudy.institution?.toLowerCase() || '';
        const specializationInstitution = specialization.institution?.toLowerCase() || '';
        
        return fullName.includes(searchLower) || 
               email.includes(searchLower) || 
               mainStudyTitle.includes(searchLower) || 
               specializationTitle.includes(searchLower) ||
               mainStudyInstitution.includes(searchLower) ||
               specializationInstitution.includes(searchLower);
      } catch (error) {
        console.warn('Error filtering profesional:', error);
        return false;
      }
    });
    
    return filtered;
  }, [data?.data, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>
          Profesionales Activos 
          {data?.data && (
            <span className='text-lg text-gray-600 ml-2'>
              ({filteredProfesionals.length} de {data.data.length})
            </span>
          )}
        </h1>
      </div>
      
      {/* Barra de búsqueda */}
      <div className='barraDeBusqueda flex justify-center mb-4 items-center'>
        <div className='relative'>
          <input 
            type='text' 
            placeholder='Buscar por nombre, email, profesión o institución...' 
            className='p-2 pl-3 pr-10 border border-gray-300 rounded-md w-80'
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className='absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              title='Limpiar búsqueda'
            >
              ✕
            </button>
          )}
        </div>
        <ImSearch size={24} className='ml-2 text-gray-600' />
      </div>

      {/* Estados de carga y error */}
      {isLoading && (
        <div className='flex justify-center items-center p-8'>
          <div className='loading loading-spinner loading-lg'></div>
          <span className='ml-2'>Cargando profesionales...</span>
        </div>
      )}

      {error && (
        <div className='alert alert-error max-w-md mx-auto mb-4'>
          <p>Error al cargar los profesionales activos</p>
        </div>
      )}

      {/* Lista de profesionales */}
      {!isLoading && !error && (
        <div className='w-full'>
          {filteredProfesionals.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {filteredProfesionals.map((profesional: any, index: number) => (
                <ProfesionalPill 
                  key={profesional.referCode || `profesional-${index}`} 
                  profesional={profesional}
                />
              ))}
            </div>
          ) : (
            <div className='text-center p-12'>
              <div className='flex flex-col items-center gap-4'>
                {searchTerm ? (
                  <>
                    <svg className='w-20 h-20 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                    </svg>
                    <p className='text-gray-500 text-xl'>No se encontraron profesionales</p>
                    <p className='text-gray-400 text-sm'>
                      No hay profesionales que coincidan con "{searchTerm}"
                    </p>
                    <button 
                      onClick={clearSearch}
                      className='btn btn-outline btn-sm'
                    >
                      Limpiar búsqueda
                    </button>
                  </>
                ) : (
                  <>
                    <svg className='w-20 h-20 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
                    </svg>
                    <p className='text-gray-500 text-xl'>No hay profesionales activos</p>
                    <p className='text-gray-400 text-sm'>Los profesionales registrados aparecerán aquí</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Información adicional */}
      {!isLoading && !error && data?.data && (
        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-600'>
            Mostrando {filteredProfesionals.length} profesional(es) activo(s)
          </p>
          {searchTerm && (
            <p className='text-xs text-gray-500 mt-1'>
              Filtrado por: "{searchTerm}"
            </p>
          )}
        </div>
      )}
    </div>
  );
}
