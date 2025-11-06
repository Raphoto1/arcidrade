'use client'
import React, { useState, useMemo } from "react";

import InstitutionProcessCard from "@/components/pieces/InstitutionProcessCard";
import { ImSearch } from "react-icons/im";
import EmptyCard from "@/components/pieces/EmptyCard";

import Grid from "./Grid";
import { useAllActiveProcesses } from '@/hooks/useProcess';
import { medicalOptions } from "@/static/data/staticData";

export default function ProcessesGridSearch(props: any) {
  const isFake = props.isFake
  const applyButton = props.applyButton || false
  const [searchTerm, setSearchTerm] = useState("");
  const [specialityFilter, setSpecialityFilter] = useState("");

  // Obtener únicamente procesos activos
  const { data, error, isLoading } = useAllActiveProcesses();

  // Debug: Verificar qué datos estamos recibiendo
  console.log('ProcessesGridSearch Debug:', {
    data,
    error,
    isLoading,
    payload: data?.payload,
    isArray: Array.isArray(data?.payload),
    payloadLength: data?.payload?.length
  });

  // Filtrar procesos basado en la búsqueda
  const filteredProcesses = useMemo(() => {
    if (!data?.payload || !Array.isArray(data.payload)) {
      console.log('No hay datos válidos:', { payload: data?.payload, isArray: Array.isArray(data?.payload) });
      return [];
    }

    console.log('Datos recibidos:', data.payload);

    const filtered = data.payload.filter((process: any) => {
      // Verificar que el proceso sea válido y tenga un ID
      if (!process || !process.id) {
        console.log('Proceso inválido:', process);
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

      const matches = matchesSearch && matchesSpeciality;
      console.log('Proceso:', process.position, 'Matches:', matches);

      return matches;
    });

    console.log('Procesos filtrados:', filtered);
    return filtered;
  }, [data, searchTerm, specialityFilter]);

  console.log('Estado final de renderizado:', {
    isLoading,
    error,
    hasData: !!data,
    payloadLength: data?.payload?.length,
    filteredLength: filteredProcesses.length,
    searchTerm,
    specialityFilter
  });

  return (
    <div className='grid justify-center'>
      <div className='grid grid-cols-1 bg-gray-200 rounded-md md:justify-center md:align-middle md:items-center pt-4'>
        <div className="p-4 md:flex md:justify-center md:items-center">
          {/* Barra de búsqueda */}
          <div className='barraDeBusqueda flex justify-center mb-4 items-center pr-2'>
            <input
              type='text'
              placeholder='Buscar procesos por cargo, descripción...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='p-2 border border-gray-300 rounded-md mr-2 w-96'
            />
            <ImSearch size={30} />
          </div>
          {/* Filtro por especialidad */}
          <div className='flex flex-col justify-center'>
            <select
              name='specialityFilter'
              value={specialityFilter}
              onChange={(e) => setSpecialityFilter(e.target.value)}
              className='select select-bordered w-full mb-2'>
              <option value=''>Todas las especialidades</option>
              {medicalOptions.map((specialty: any) => (
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
                    <InstitutionProcessCard 
                      key={process.id || index} 
                      processId={process.id} 
                      isFake={isFake} 
                      isProfesional 
                      btnActive={applyButton} 
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
