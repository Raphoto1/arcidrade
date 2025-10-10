'use client'
import React from "react";

import { FaStar } from "react-icons/fa";

export default function ProcessInstitution() {
  return (
    <div>
      <div className=' bg-gray-50 w-full rounded-sm p-2 grid grid-cols-2 gap-2 shadow-xl mt-2 justify-between items-center'>
        <div className='w-2/3'>
          <h3 className="text-sm text-(--orange-arci)">Proceso Arcidrade</h3>
          <h2 className='text-(--main-arci) text-bold text-nowrap font-bold'>Clinica Grande</h2>
          <span className='text-sm text-gray-600 w-100'>Medicina General</span>
          <p className='font-light'>10/10/2025</p>
        </div>
        <div className='controles grid justify-center gap-2 mt-4'>
          <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Detalle</button>
          <button className='btn btn-wide bg-[var(--orange-arci)] text-sm h-auto'>Eliminar</button>
          <button className='btn bg-success h-auto text-sm'>Aceptar Proceso</button>
          <button className='btn bg-warning h-auto text-sm' type='submit'>
            Solicitar Contacto
          </button>
        </div>
      </div>
    </div>
  );
}
