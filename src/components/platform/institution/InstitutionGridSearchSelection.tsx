"use client";
import React, { useState, useEffect } from "react";
import InstitutionCard from "../../pieces/InstitutionCard";
import ProfesionalCard from "@/components/pieces/ProfesionalCard";
import { ImSearch } from "react-icons/im";
import { FiFilter, FiX } from "react-icons/fi";
import { usePaginatedProfesionals } from "@/hooks/usePlatPro";
import { medicalOptions, nurseOptions, pharmacistOptions } from "@/static/data/staticData";

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
  const [selectedSubArea, setSelectedSubArea] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 9;

  // Opciones de categorías de profesional
  const subAreaOptions = [
    { value: "doctor", label: "Médico" },
    { value: "nurse", label: "Enfermería" },
    { value: "pharmacist", label: "Farmacia" }
  ];

  // Función para obtener las especialidades según la categoría seleccionada
  const getSpecialityOptions = () => {
    switch (selectedSubArea) {
      case "doctor":
        return medicalOptions;
      case "nurse":
        return nurseOptions;
      case "pharmacist":
        return pharmacistOptions;
      default:
        return medicalOptions; // Por defecto mostrar opciones médicas (incluyendo null)
    }
  };

  // Función para mapear el valor para la API (null se convierte en doctor)
  const getSubAreaForAPI = () => {
    return selectedSubArea || "doctor"; // Si está vacío, usar doctor por defecto
  };

  // Debounce para el término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Resetear a la primera página cuando se busca
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Resetear página cuando cambia la especialidad o categoría
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSpeciality, selectedSubArea]);

  // Resetear especialidad cuando cambia la categoría del profesional
  useEffect(() => {
    setSelectedSpeciality("");
  }, [selectedSubArea]);

  const { data: paginatedData, error, isLoading } = usePaginatedProfesionals(
    currentPage, 
    itemsPerPage, 
    debouncedSearchTerm, 
    selectedSpeciality, 
    selectedSubArea ? selectedSubArea : undefined // Solo enviar si hay algo seleccionado
  );

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

  // Manejar cambio de categoría del profesional
  const handleSubAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubArea(e.target.value);
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedSpeciality("");
    setSelectedSubArea("");
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = debouncedSearchTerm || selectedSpeciality || selectedSubArea;

  // Mostrar error solo si hay error
  // Mostrar error con más detalle
  if (error) {
    return (
      <div className='text-center p-4 text-red-500'>
        <p>Error al cargar profesionales</p>
        <p className='text-sm text-gray-600 mt-2'>
          {error.message || 'Error desconocido'}
        </p>
      </div>
    );
  }

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
            {isLoading && currentPage === 1 && (
              <div className="loading loading-spinner loading-xs ml-1"></div>
            )}
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

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {/* Filtro por categoría del profesional */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Categoría del Profesional</label>
                <select
                  value={selectedSubArea}
                  onChange={handleSubAreaChange}
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'>
                  <option value=''>Todas las categorías</option>
                  {subAreaOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por especialidad */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  {selectedSubArea ? `Especialidades de ${subAreaOptions.find(opt => opt.value === selectedSubArea)?.label}` : 'Especialidad'}
                </label>
                <select
                  value={selectedSpeciality}
                  onChange={handleSpecialityChange}
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'>
                  <option value=''>Todas las especialidades</option>
                  {getSpecialityOptions().map((option: any) => (
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
              {selectedSubArea && (
                <span className='inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs'>
                  Categoría: {subAreaOptions.find(opt => opt.value === selectedSubArea)?.label}
                  <button onClick={() => setSelectedSubArea("")} className='text-purple-600 hover:text-purple-800'>
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
          {/* Loader superpuesto para primera carga y aplicación de filtros */}
          {isLoading && currentPage === 1 && (
            <div className='absolute inset-0 bg-gray-200 bg-opacity-90 flex items-center justify-center z-10 rounded-md'>
              <div className='bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-3'>
                <div className='loading loading-spinner loading-lg text-primary'></div>
                <p className='text-gray-700 font-medium'>
                  {hasActiveFilters ? 'Aplicando filtros...' : 'Cargando profesionales...'}
                </p>
                {hasActiveFilters && (
                  <p className='text-gray-500 text-sm text-center'>
                    Buscando profesionales que coincidan con tus criterios
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Loader secundario para cambios de filtros sin overlay completo */}
          {isLoading && currentPage === 1 && hasActiveFilters && (
            <div className='absolute top-4 right-4 z-20'>
              <div className='bg-white p-2 rounded-lg shadow-md flex items-center gap-2'>
                <div className='loading loading-spinner loading-sm text-primary'></div>
                <span className='text-xs text-gray-600'>Filtrando...</span>
              </div>
            </div>
          )}

          <div className='grid grid-cols-1 gap-4 p-4 bg-gray-200 rounded-md md:grid-cols-3 md:justify-center md:align-middle md:items-center'>
            {paginatedData?.data?.length > 0
              ? paginatedData.data.map((profesional: any, index: number) => (
                <ProfesionalCard 
                  key={profesional.referCode || index} 
                  userId={profesional.referCode} 
                  profesionalData={profesional}
                  isFake={isFake} 
                  btnActive 
                  processId={processId} 
                  processPosition={processPosition} 
                  addedBy={addedBy || 'institution'} 
                  isArci={isArci || false} 
                />
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
              className='btn btn-primary bg-[var(--orange-arci)] border-none hover:bg-[var(--orange-arci)]/80 disabled:opacity-50 min-w-[200px]'>
              {isLoading && currentPage > 1 ? (
                <div className='flex items-center gap-2'>
                  <div className='loading loading-spinner loading-sm'></div>
                  <span>Cargando más...</span>
                </div>
              ) : (
                "Cargar más profesionales"
              )}
            </button>
          </div>
        )}

        {/* Loader para paginación adicional */}
        {isLoading && currentPage > 1 && (
          <div className='flex justify-center mt-2 mb-4'>
            <div className='flex items-center gap-2 text-gray-600'>
              <div className='loading loading-dots loading-sm'></div>
              <span className='text-sm'>Cargando página {currentPage}...</span>
            </div>
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
