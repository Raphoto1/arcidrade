import React from "react";

import { FaStar } from "react-icons/fa";

export default function Experience() {
  return (
    <div>
      <div className=' bg-gray-50 w-auto min-w-full rounded-sm p-2 grid grid-cols-2 shadow-xl mt-2 items-center'>
        <div className='w-full'>
          <h2 className='text-(--main-arci) text-bold text-nowrap font-bold'>Medico Pasante</h2>
          <span className='text-sm text-gray-600 w-100'>Clinica San Juan</span>
          <div className='font-light flex justify-start'>
            <span className='text-sm text-gray-600 w-100'>Ciudad: Cali</span>
          </div>
          <p className='font-light text-sm'>2020</p>
          <h4>Respaldo</h4>
          <div className="w-full">
            <h3>Descripcion:</h3>
            <p className="text-sm min-w-full font-extralight">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis illo inventore magni quam fugiat voluptatem, dolorem officiis aut eius blanditiis!</p>
          </div>
        </div>
        <div className='controles w-auto grid justify-end gap-2'>
          <button className='btn btn-wide bg-[var(--orange-arci)] text-sm h-auto'>Cancelar</button>
          <button className='btn bg-[var(--soft-arci)] h-auto text-sm'>Agregar Respaldo</button>
          <button className='btn bg-[var(--soft-arci)] h-auto text-sm' type='submit'>
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
}
