'use client'
import React, { useState, useMemo, useEffect } from "react";

import InstitutionProcessCardPublic from "@/components/pieces/InstitutionProcessCardPublic";
import { ImSearch } from "react-icons/im";
import EmptyCard from "@/components/pieces/EmptyCard";

import Grid from "@/components/platform/pieces/Grid";
import { usePublicActiveProcesses } from '@/hooks/useProcess';
import { medicalOptions, nurseOptions, pharmacistOptions } from "@/static/data/staticData";

export default function ProcessesGridSearchPublic(props: any) {
  const isFake = props.isFake
  const applyButton = props.applyButton || false
  const [searchTerm, setSearchTerm] = useState("");
  const [specialityFilter, setSpecialityFilter] = useState("");
  const [selectedSubArea, setSelectedSubArea] = useState("");

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
        return medicalOptions; // Por defecto mostrar opciones médicas
    }
  };

  // Obtener únicamente procesos activos públicos (sin autenticación)
  const { data, error, isLoading } = usePublicActiveProcesses();

  // Resetear especialidad cuando cambia la categoría del profesional
  useEffect(() => {
    setSpecialityFilter("");
  }, [selectedSubArea]);

  // Filtrar procesos basado en la búsqueda
  const filteredProcesses = useMemo(() => {
    if (!data?.payload || !Array.isArray(data.payload)) {
      return [];
    }

    return data.payload.filter((process: any) => {
      // Verificar que el proceso sea válido y tenga un ID
      if (!process || !process.id) {
        return false;
      }

      const matchesSearch =
        !searchTerm ||
        process.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.main_speciality?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpeciality =
        !specialityFilter ||
        process.main_speciality?.toLowerCase().includes(specialityFilter.toLowerCase()) ||
        process.extra_specialities?.some((spec: any) => spec.speciality?.toLowerCase().includes(specialityFilter.toLowerCase()));

      const matchesSubArea =
        !selectedSubArea ||
        process.area === selectedSubArea;

      return matchesSearch && matchesSpeciality && matchesSubArea;
    });
  }, [data, searchTerm, specialityFilter, selectedSubArea]);

  return (
    <div className='grid justify-center'>
      <div className='grid grid-cols-1 bg-gray-200 rounded-md md:justify-center md:align-middle md:items-center pt-4'>
        <div className="p-4 md:flex md:justify-center md:items-center gap-4">
          {/* Barra de búsqueda */}
          <div className='barraDeBusqueda flex justify-center mb-4 md:mb-0 items-center'>
            <input
              type='text'
              placeholder='Buscar procesos por cargo, descripción...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='p-2 border border-gray-300 rounded-md mr-2 w-96 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
            <ImSearch size={30} className="text-gray-600" />
          </div>
          {/* Filtro por categoría del profesional */}
          <div className='flex flex-col justify-center mb-4 md:mb-0'>
            <label className='text-sm font-medium text-gray-700 mb-1'>Categoría</label>
            <select
              name='subAreaFilter'
              value={selectedSubArea}
              onChange={(e) => setSelectedSubArea(e.target.value)}
              className='p-2 border border-gray-300 rounded-md w-48 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'>
              <option value=''>Todas las categorías</option>
              {subAreaOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {/* Filtro por especialidad */}
          <div className='flex flex-col justify-center mb-4 md:mb-0'>
            <label className='text-sm font-medium text-gray-700 mb-1'>
              {selectedSubArea ? `Especialidad ${subAreaOptions.find(opt => opt.value === selectedSubArea)?.label}` : 'Especialidad'}
            </label>
            <select
              name='specialityFilter'
              value={specialityFilter}
              onChange={(e) => setSpecialityFilter(e.target.value)}
              className='p-2 border border-gray-300 rounded-md w-56 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'>
              <option value=''>Todas las especialidades</option>
              {getSpecialityOptions().map((specialty: any) => (
                <option key={specialty.id} value={specialty.name}>
                  {specialty.name.charAt(0).toUpperCase() + specialty.name.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Resultados */}
        <div className='mb-4 text-center'>
          <p className='text-gray-600'>{isLoading ? "Cargando..." : `${filteredProcesses.length} procesos encontrados`}</p>
        </div>

        {/* Grid de procesos */}
        <Grid>
          {isLoading ? (
            <div className='col-span-full text-center py-8'>Cargando procesos...</div>
          ) : error ? (
            <div className='col-span-full text-center py-8 text-red-500'>Error al cargar procesos</div>
          ) : filteredProcesses.length > 0 ? (
                filteredProcesses
                  .filter((process: any) => process && process.id) // Filtro adicional de seguridad
                  .map((process: any, index: number) => (
                    <InstitutionProcessCardPublic 
                      key={process.id || index} 
                      processData={process}
                      isFake={isFake}
                    />
                  ))
          ) : (
            <div className='col-span-full text-center py-8 text-gray-500'>No se encontraron procesos con los filtros aplicados</div>
          )}

          {/* Mostrar EmptyCard solo si hay procesos pero queremos completar el grid */}
          {filteredProcesses.length > 0 &&
            filteredProcesses.length % 3 !== 0 &&
            Array.from({ length: 3 - (filteredProcesses.length % 3) }).map((_, index) => <EmptyCard key={`empty-${index}`} />)}
        </Grid>
      </div>
    </div>
  );
}
