"use client";
import React, { useState, useEffect } from "react";
import InstitutionCard from "../../pieces/InstitutionCard";
import ProfesionalCard from "@/components/pieces/ProfesionalCard";
import { ImSearch } from "react-icons/im";
import { FiFilter, FiX } from "react-icons/fi";
import { usePaginatedProfesionals } from "@/hooks/usePlatPro";
import { medicalOptions } from "@/static/data/staticData";

interface InstitutionGridSearchProps {
  isFake?: boolean;
  processId?: number;
  processPosition?: string;
  isArci?: boolean;
  addedBy?: string;
}
//REVISAR ADDEDBY CON MIGRATION
export default function InstitutionGridSearchSelection({ isFake = true, processId, processPosition, isArci, addedBy }: InstitutionGridSearchProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 9;

  // Debounce para el término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Resetear a la primera página cuando se busca
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Resetear página cuando cambia la especialidad
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSpeciality]);

  const { data: paginatedData, error, isLoading } = usePaginatedProfesionals(currentPage, itemsPerPage, debouncedSearchTerm, selectedSpeciality);

  // Función para cargar más elementos
  const loadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Manejar cambio de especialidad
  const handleSpecialityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSpeciality(e.target.value);
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedSpeciality("");
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = debouncedSearchTerm || selectedSpeciality;

  // Mostrar error solo si hay error
  if (error) return <div className='text-center p-4 text-red-500'>Error al cargar profesionales</div>;

  return (
    <div className='grid justify-center'>
      <div className='grid grid-cols-1 bg-gray-200 rounded-md md:justify-center md:align-middle md:items-center pt-4'>
        {/* Barra de búsqueda */}
        <div className='barraDeBusqueda flex justify-center mb-4 items-center flex-wrap gap-2'>
          <div className='flex items-center'>
            <input
              type='text'
              placeholder='Buscar Profesionales...'
              className='p-2 border border-gray-300 rounded-md mr-2 w-64'
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <ImSearch size={24} className='text-gray-500 mr-4' />
          </div>

          {/* Botón de filtros */}
          <button onClick={() => setShowFilters(!showFilters)} className='btn btn-sm bg-white border border-gray-300 hover:bg-gray-50 flex items-center gap-2'>
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
              <button onClick={() => setShowFilters(false)} className='text-gray-500 hover:text-gray-700'>
                <FiX size={20} />
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Filtro por especialidad */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Especialidad Médica</label>
                <select
                  value={selectedSpeciality}
                  onChange={handleSpecialityChange}
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'>
                  <option value=''>Todas las especialidades</option>
                  {medicalOptions.map((option: any) => (
                    <option key={option.id} value={option.name}>
                      {option.name.charAt(0).toUpperCase() + option.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botón limpiar filtros */}
              <div className='flex items-end'>
                <button
                  onClick={clearAllFilters}
                  disabled={!hasActiveFilters}
                  className='btn btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed'>
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mostrar filtros activos */}
        {hasActiveFilters && (
          <div className='text-center mb-2 text-sm text-gray-600 mx-4'>
            <div className='flex flex-wrap justify-center gap-2'>
              {debouncedSearchTerm && (
                <span className='inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs'>
                  Búsqueda: "{debouncedSearchTerm}"
                  <button onClick={() => setSearchTerm("")} className='text-blue-600 hover:text-blue-800'>
                    <FiX size={12} />
                  </button>
                </span>
              )}
              {selectedSpeciality && (
                <span className='inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs'>
                  Especialidad: {selectedSpeciality.charAt(0).toUpperCase() + selectedSpeciality.slice(1)}
                  <button onClick={() => setSelectedSpeciality("")} className='text-green-600 hover:text-green-800'>
                    <FiX size={12} />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Grid de profesionales con loader específico */}
        <div className='relative min-h-[400px]'>
          {/* Loader superpuesto solo para la primera carga */}
          {isLoading && currentPage === 1 && (
            <div className='absolute inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-10 rounded-md'>
              <div className='flex flex-col items-center gap-2'>
                <div className='loading loading-spinner loading-lg text-primary'></div>
                <p className='text-gray-600'>Cargando profesionales...</p>
              </div>
            </div>
          )}

          <div className='grid grid-cols-1 gap-4 p-4 bg-gray-200 rounded-md md:grid-cols-3 md:justify-center md:align-middle md:items-center'>
            {paginatedData?.data?.length > 0
              ? paginatedData.data.map((profesional: any, index: number) => (
                <ProfesionalCard key={profesional.referCode || index} userId={profesional.referCode} isFake={isFake} btnActive processId={processId} processPosition={processPosition} addedBy={addedBy || 'institution'} isArci={isArci || false} />
                ))
              : !isLoading && (
                  <div className='col-span-full text-center text-gray-500 py-8'>
                    {hasActiveFilters ? "No se encontraron profesionales que coincidan con los filtros aplicados" : "No hay profesionales disponibles"}
                  </div>
                )}
          </div>
        </div>

        {/* Botón Cargar Más */}
        {paginatedData?.hasMore && (
          <div className='flex justify-center mt-4 mb-4'>
            <button
              onClick={loadMore}
              disabled={isLoading}
              className='btn btn-primary bg-[var(--orange-arci)] border-none hover:bg-[var(--orange-arci)]/80 disabled:opacity-50'>
              {isLoading ? "Cargando..." : "Cargar más profesionales"}
            </button>
          </div>
        )}

        {/* Información de elementos mostrados */}
        {paginatedData && (
          <div className='text-center text-sm text-gray-600 mb-4'>
            Página {paginatedData.page} de {paginatedData.totalPages} - {paginatedData.total} profesionales en total
          </div>
        )}
      </div>
    </div>
  );
}
