'use client';
import React, { useState, useEffect } from "react";
import InstitutionCard from "../../pieces/InstitutionCard";
import ProfesionalCard from "@/components/pieces/ProfesionalCard";
import { ImSearch } from "react-icons/im";
import { FiFilter, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { usePaginatedProfesionals } from "@/hooks/usePlatPro";
import { medicalOptions, nurseOptions, pharmacistOptions, subAreaOptions } from "@/static/data/staticData";

interface InstitutionGridSearchProps {
  isFake?: boolean;
}

export default function InstitutionGridSearch({ isFake = true }: InstitutionGridSearchProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [selectedSubArea, setSelectedSubArea] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const itemsPerPage = 6;
  
  // Función para obtener las opciones de especialidad según el subArea
  const getSpecialityOptions = () => {
    switch (selectedSubArea) {
      case 'doctor':
        return medicalOptions;
      case 'nurse':
        return nurseOptions;
      case 'pharmacist':
        return pharmacistOptions;
      default:
        return medicalOptions;
    }
  };
  
  // Debounce para el término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Resetear a la primera página cuando se busca
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Resetear página cuando cambia la especialidad o subArea
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSpeciality, selectedSubArea]);

  // Resetear especialidad cuando cambia subArea
  useEffect(() => {
    setSelectedSpeciality("");
  }, [selectedSubArea]);

  const { data: paginatedData, error, isLoading } = usePaginatedProfesionals(
    currentPage, 
    itemsPerPage,
    debouncedSearchTerm,
    selectedSpeciality,
    selectedSubArea ? selectedSubArea : undefined
  );

  // Controlar el loader de cambio de página
  useEffect(() => {
    if (isLoading && currentPage > 1) {
      setIsPageChanging(true);
    } else {
      setIsPageChanging(false);
    }
  }, [isLoading, currentPage]);

  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Manejar cambio de especialidad
  const handleSpecialityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSpeciality(e.target.value);
  };

  // Manejar cambio de subArea
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
  if (error) return <div className="text-center p-4 text-red-500">Error al cargar profesionales</div>;

  const totalPages = paginatedData?.totalPages || 1;

  return (
    <div className='grid justify-center'>
      <div className='grid grid-cols-1 bg-gray-200 rounded-md md:justify-center md:align-middle md:items-center pt-4'>
        {/* Barra de búsqueda */}
        <div className='barraDeBusqueda flex justify-center mb-4 items-center flex-wrap gap-2'>
          <div className="flex items-center">
            <input 
              type='text' 
              placeholder='Buscar Profesionales...' 
              className='p-2 border border-gray-300 rounded-md mr-2 w-64' 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <ImSearch size={24} className="text-gray-500 mr-4" />
          </div>
          
          {/* Botón de filtros */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-sm bg-white border border-gray-300 hover:bg-gray-50 flex items-center gap-2"
          >
            <FiFilter size={16} />
            Filtros
            {hasActiveFilters && <span className="badge badge-primary badge-xs">!</span>}
            {isLoading && currentPage === 1 && (
              <div className="loading loading-spinner loading-xs ml-1"></div>
            )}
          </button>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className='bg-white mx-4 mb-4 p-4 rounded-lg border border-gray-300 shadow-sm'>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">Filtros de búsqueda</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro por categoría profesional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría Profesional
                </label>
                <select 
                  value={selectedSubArea}
                  onChange={handleSubAreaChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas las categorías</option>
                  {subAreaOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por especialidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidad
                </label>
                <select 
                  value={selectedSpeciality}
                  onChange={handleSpecialityChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas las especialidades</option>
                  {getSpecialityOptions().map((option: any) => (
                    <option key={option.id} value={option.name}>
                      {option.name.charAt(0).toUpperCase() + option.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botón limpiar filtros */}
              <div className="flex items-end">
                <button
                  onClick={clearAllFilters}
                  disabled={!hasActiveFilters}
                  className="btn btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  Búsqueda: "{debouncedSearchTerm}"
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiX size={12} />
                  </button>
                </span>
              )}
              {selectedSubArea && (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                  Categoría: {subAreaOptions.find(opt => opt.value === selectedSubArea)?.label}
                  <button 
                    onClick={() => setSelectedSubArea("")}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    <FiX size={12} />
                  </button>
                </span>
              )}
              {selectedSpeciality && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  Especialidad: {selectedSpeciality.charAt(0).toUpperCase() + selectedSpeciality.slice(1)}
                  <button 
                    onClick={() => setSelectedSpeciality("")}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FiX size={12} />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Grid de profesionales con loader específico */}
        <div className='relative min-h-[400px]'>
          {/* Loader para primera carga y aplicación de filtros */}
          {isLoading && currentPage === 1 && (
            <div className="absolute inset-0 bg-gray-200 bg-opacity-90 flex items-center justify-center z-10 rounded-md">
              <div className='bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-3'>
                <div className="loading loading-spinner loading-lg text-primary"></div>
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

          {/* Loader para cambio de página */}
          {isPageChanging && currentPage > 1 && (
            <div className='absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20 rounded-md'>
              <div className='flex flex-col items-center gap-3'>
                <div className='loading loading-spinner loading-lg' style={{ color: 'var(--main-arci)' }}></div>
                <p className='text-gray-700 font-medium'>Cargando página {currentPage}...</p>
              </div>
            </div>
          )}

          <div className={`grid grid-cols-1 gap-4 p-4 bg-gray-200 rounded-md md:grid-cols-3 md:justify-center md:align-middle md:items-center transition-opacity duration-300 ${isPageChanging ? 'opacity-50' : 'opacity-100'}`}>
            {paginatedData?.data?.length > 0 ? (
              paginatedData.data.map((profesional: any, index: number) => (
                <ProfesionalCard 
                  key={profesional.referCode || index} 
                  userId={profesional.referCode} 
                  profesionalData={profesional}
                  isFake={isFake} 
                />
              ))
            ) : (
              !isLoading && (
                <div className='col-span-full text-center text-gray-500 py-8'>
                  {hasActiveFilters ? 
                    'No se encontraron profesionales que coincidan con los filtros aplicados' : 
                    'No hay profesionales disponibles'
                  }
                </div>
              )
            )}
          </div>
        </div>

        {/* Información y controles de paginación */}
        {paginatedData && paginatedData.total > 0 && (
          <div className='flex flex-col items-center gap-4 mt-6 mb-4'>
            {/* Información de paginación */}
            <div className='text-sm text-gray-600'>
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, paginatedData.total)} de {paginatedData.total} profesionales
            </div>

            {/* Controles de paginación */}
            {totalPages > 1 && (
              <div className='flex items-center gap-2'>
                {/* Botón anterior */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || isLoading || isPageChanging}
                  className='btn btn-sm btn-outline gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <FiChevronLeft size={16} />
                  Anterior
                </button>

                {/* Números de página */}
                <div className='flex gap-1'>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      disabled={isLoading || isPageChanging}
                      className={`btn btn-sm min-w-[40px] ${
                        currentPage === page 
                          ? 'bg-[var(--main-arci)] text-white border-none' 
                          : 'btn-outline'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Botón siguiente */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || isLoading || isPageChanging}
                  className='btn btn-sm btn-outline gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Siguiente
                  <FiChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Selector de página directa */}
            <div className='flex items-center gap-2'>
              <label className='text-sm text-gray-600'>Ir a página:</label>
              <input
                type='number'
                min='1'
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= totalPages) {
                    setCurrentPage(page);
                  }
                }}
                disabled={isLoading || isPageChanging}
                className='input input-sm input-bordered w-16 text-center disabled:opacity-50 disabled:cursor-not-allowed'
              />
              <span className='text-sm text-gray-600'>de {totalPages}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
