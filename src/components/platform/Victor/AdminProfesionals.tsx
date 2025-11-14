import React from "react";

import ActiveProfesionals from "./pieces/adminProfesionals.tsx/ActiveProfesionals";
import PausedProfesionals from "./pieces/adminProfesionals.tsx/PausedProfesionals";
export default function AdminProfesional() {
  return (
    <div className='flex-col justify-start w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <h2 className='font-bold font-oswald text-xl text-center'>Administrar Profesionales</h2>
      <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:max-h-3/4 justify-center'>
        <ActiveProfesionals />
        <PausedProfesionals />
      </div>
    </div>
  );
}
