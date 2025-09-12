import React from 'react'

import GridSearch from './GridSearch'

export default function SearchCandidates() {
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
