import React from 'react'

import Speciality from '../pieces/Speciality'

export default function Specialities() {
  return (
    <div className='flex-col justify-start md:h-3/4 bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:overflow-auto'>
      <div className="pb-2">
              <h1 className="text-2xl fontArci text-center">Especialidades</h1>
      </div>
      <Speciality />
      <Speciality />
      <Speciality />
      <Speciality />
      <Speciality />
    </div>
  )
}
