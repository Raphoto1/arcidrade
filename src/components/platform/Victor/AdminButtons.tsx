import React from "react";

export default function AdminButtons() {
  return (
    <div className='FatsActions md:flex grid justify-center'>
      <button className='btn bg-[var(--main-arci)] text-white text-2xl h-auto p-2'>Administrar Procesos</button>
      <button className='btn bg-[var(--main-arci)] text-white text-2xl h-auto p-2'>Administrar Invitaciones</button>
      <button className='btn bg-[var(--main-arci)] text-white text-2xl h-auto p-2'>Administrar Instituciones</button>
      <button className='btn bg-[var(--main-arci)] text-white text-2xl h-auto p-2'>Administrar Profesionales</button>
    </div>
  );
}
