import React from "react";

import Speciality from "../pieces/Speciality";

export default function Specialities() {
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-1 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-1'>
        <h1 className='text-2xl fontArci text-center'>Especialidades</h1>
      </div>
      <div className="max-h-110 overflow-auto">
        <Speciality />
        <Speciality />
        <Speciality />
        <Speciality />
        <Speciality />
      </div>
    </div>
  );
}
