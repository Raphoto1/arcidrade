'use client'
import React, { useState, useMemo } from "react";
import { ImSearch } from "react-icons/im";
import { FiFilter, FiX } from "react-icons/fi";

import ProfesionalPill from "./ProfesionalPill";
import { usePaginatedProfesionals } from "@/hooks/usePlatPro";
import { useHandleCategoryName } from "@/hooks/useUtils";

// Helper function para obtener nombre completo (no hook)
const getFullName = (name?: string | null, lastName?: string | null) => {
  if (!name && !lastName) return '';
  if (!name) return lastName || '';
  if (!lastName) return name || '';
  return `${name} ${lastName}`;
};

export default function ActiveProfesionals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubArea, setSelectedSubArea] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  const { data, error, isLoading } = usePaginatedProfesionals(currentPage, itemsPerPage, undefined, undefined, undefined, 'active');
  
  // Calcular subAreas disponibles para el filtro
  const availableSubAreas = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) {
      return [];
    }
    
    const subAreaCounts = new Map<string, number>();
    
    data.data.forEach((profesional: any) => {
      if (profesional && profesional.main_study && profesional.main_study.sub_area) {
        const subArea = profesional.main_study.sub_area;
        const categoryName = useHandleCategoryName(subArea);
        subAreaCounts.set(subArea, (subAreaCounts.get(subArea) || 0) + 1);
      }
    });
    
    return Array.from(subAreaCounts.entries())
      .map(([subArea, count]) => ({ 
        subArea, 
        count, 
        displayName: useHandleCategoryName(subArea) 
      }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [data?.data]);
  
  // Filtrar profesionales por término de búsqueda y subArea
  const filteredProfesionals = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) {
      return [];
    }
    
    // Primero filtrar elementos válidos
    let validProfesionals = data.data.filter((profesional: any) => {
      return profesional && typeof profesional === 'object' && profesional.referCode;
    });
    
    // Filtrar por subArea si está seleccionada
    if (selectedSubArea) {
      validProfesionals = validProfesionals.filter((profesional: any) => {
        return profesional.main_study?.sub_area === selectedSubArea;
      });
    }
    
    // Filtrar por término de búsqueda
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
  }, [data?.data, searchTerm, selectedSubArea]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubArea(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSubArea("");
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = searchTerm || selectedSubArea;

  return (
    <div className='w-full justify-center bg-gray-200 px-2'>
      <div className='w-full grid grid-cols-1 bg-gray-200 rounded-md md:justify-center md:align-middle md:items-center pt-4'>
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
        <div className='w-full barraDeBusqueda flex justify-center mb-4 items-center flex-wrap gap-2'>
          <div className='w-full flex items-center justify-center'>
            <input
              type='text'
              placeholder='Buscar por nombre, email, profesión o institución...'
              className='p-2 border border-gray-300 rounded-md mr-2 w-full max-w-80'
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <ImSearch size={24} className='text-gray-500 mr-4' />
          </div>

          {/* Botón de filtros */}
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className='btn btn-sm bg-white border border-gray-300 hover:bg-gray-50 flex items-center gap-2'
          >
            <FiFilter size={16} />
            Filtros
            {hasActiveFilters && <span className='badge badge-primary badge-xs'>!</span>}
          </button>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className='bg-white mx-4 mb-4 p-4 rounded-lg border border-gray-300 shadow-sm'>
            <div className='flex justify-between items-center mb-3'>
              <h3 className='font-semibold text-gray-700'>Filtros de búsqueda</h3>
              <button 
                onClick={() => setShowFilters(false)} 
                className='text-gray-500 hover:text-gray-700'
              >
                <FiX size={20} />
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Filtro por SubArea */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Categoría Profesional
                </label>
                <select
                  value={selectedSubArea}
                  onChange={handleSubAreaChange}
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                >
                  <option value="">
                    Todas las categorías ({data?.data?.length || 0})
                  </option>
                  {availableSubAreas.map(({ subArea, count, displayName }) => (
                    <option key={subArea} value={subArea}>
                      {displayName} ({count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Área para futuros filtros */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Filtros adicionales
                </label>
                <div className='flex items-center gap-2'>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className='btn btn-outline btn-sm flex items-center gap-1'
                    >
                      <FiX size={14} />
                      Limpiar filtros
                    </button>
                  )}
                  <span className='text-sm text-gray-500'>
                    {filteredProfesionals.length} resultado(s)
                  </span>
                </div>
              </div>
            </div>

            {/* Filtros activos */}
            {hasActiveFilters && (
              <div className='mt-3 pt-3 border-t border-gray-200'>
                <div className='flex flex-wrap gap-2'>
                  <span className='text-sm text-gray-600'>Filtros activos:</span>
                  {searchTerm && (
                    <span className='badge badge-outline badge-sm'>
                      Búsqueda: "{searchTerm}"
                    </span>
                  )}
                  {selectedSubArea && (
                    <span className='badge badge-outline badge-sm'>
                      Categoría: "{useHandleCategoryName(selectedSubArea)}"
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
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
            <div className='grid grid-cols-1 gap-4'>
              {filteredProfesionals.map((profesional: any, index: number) => (
                <ProfesionalPill 
                  key={profesional.referCode || `profesional-${index}`} 
                  profesional={profesional}
                  isPaused={false}
                />
              ))}
            </div>
          ) : (
            <div className='text-center p-12'>
              <div className='flex flex-col items-center gap-4'>
                {(searchTerm || selectedSubArea) ? (
                  <>
                    <svg className='w-20 h-20 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                    </svg>
                    <p className='text-gray-500 text-xl'>No se encontraron profesionales</p>
                    <div className='text-gray-400 text-sm text-center space-y-1'>
                      <p>No hay profesionales que coincidan con los filtros:</p>
                      {searchTerm && <p className='font-medium'>Búsqueda: "{searchTerm}"</p>}
                      {selectedSubArea && <p className='font-medium'>SubArea: "{useHandleCategoryName(selectedSubArea)}"</p>}
                    </div>
                    <button 
                      onClick={clearFilters}
                      className='btn btn-outline btn-sm'
                    >
                      Limpiar todos los filtros
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
          {(searchTerm || selectedSubArea) && (
            <div className='text-xs text-gray-500 mt-1 space-y-1'>
              {searchTerm && (
                <p>Filtrado por texto: "{searchTerm}"</p>
              )}
              {selectedSubArea && (
                <p>SubArea: "{useHandleCategoryName(selectedSubArea)}"</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
