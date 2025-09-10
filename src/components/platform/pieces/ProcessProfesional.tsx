import React from "react";

import { FaStar } from "react-icons/fa";

export default function ProcessProfesional() {
  return (
    <div>
      <div className=' bg-gray-50 w-full rounded-sm p-2 grid grid-cols-2 gap-2 shadow-xl mt-2 justify-between items-center'>
        <div className='w-2/3'>
          <h2 className='text-(--main-arci) text-bold text-nowrap font-bold'>Carlos Contreras</h2>
          <p className='text-sm text-(--orange-arci) w-100'>Hospital de Sada</p>
          <span className='text-sm text-gray-600 w-100'>Medicina General</span>
          <p className='font-light'>10/10/2025</p>
        </div>
        <div className='controles grid justify-center gap-2 mt-4'>
          <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Ver Profesional</button>
          <button className='btn btn-wide bg-[var(--orange-arci)] text-sm h-auto'>Eliminar</button>
          <button className='btn bg-success h-auto text-sm'>Aceptar Proceso</button>
        </div>
      </div>
    </div>
  );
}
