import React from 'react'

import GridSearch from './GridSearch'

export default function SearchCandidates(props: any) {
  //id del proceso para filtrar candidatos, se extrae especialidad principal y extra del proceso
  //luego se filtran los candidatos que tengan esas especialidades
  //se puede agregar un select para filtrar por especialidad extra
  //y un boton para aplicar filtros adicionales (experiencia, disponibilidad, etc)
  //luego se muestra un grid con los candidatos filtrados
  //cada candidato es un card con su informacion basica y un boton para ver mas detalles
  //o para seleccionar al candidato para el proceso
  //IMPORTANTE FILTRAR SI LOS CANDIDATOS SON FAKE O REALES SEGUN SI ES UN PROCESO ACTIVE O PENDING
  return (
    <div>
          <div className='flex flex-col md:flex-row w-full pt-2 justify-around fontRoboto align-middle items-center'>
              <h1 className='text-2xl font-bold'>Candidatos Disponibles</h1>
              <p>Cirujano</p>
              <div className='flex flex-col justify-center'>
                <label htmlFor="extraSpecial" className='text-center'>Especialidad Extra</label>
                <select name="extraSpecial" id="" className='select select-bordered w-full mb-2'>
                    <option value="esp3">Seleccione especialidad</option>
                    
                    <option value="esp1">especialidad 1</option>
                    <option value="esp2">especialidad 2</option>
                    <option value="esp3">especialidad 3</option>
                </select>
              </div>
          </div>
          <GridSearch />
    </div>
  )
}
