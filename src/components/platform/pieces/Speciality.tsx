import React from "react";

import { FaStar } from "react-icons/fa";

export default function Speciality() {
  return (
      <div>
        <div className=' bg-gray-50 w-full rounded-sm p-2 grid grid-cols-2 gap-2 shadow-xl mt-2 justify-between items-center'>
          <div className='w-2/3'>
          <div className="">
              <FaStar />
          </div>
            <h2 className='text-(--main-arci) text-bold text-nowrap font-bold'>Medicina Interna</h2>
            <span className='text-sm text-gray-600 w-100'>Universidad Grande</span>
                  <p className="font-light">2020</p>
                  <h4>Archivo</h4>
                  <p>documento.pdf</p>
          </div>
          <div className='controles grid justify-center gap-2 mt-4'>
            <button className='btn btn-wide bg-[var(--orange-arci)] text-sm h-auto'>Cancelar</button>
            <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Establecer como Principal</button>
            <button className='btn bg-[var(--soft-arci)] h-auto text-sm'>Agregar Respaldo</button>
            <button className='btn bg-[var(--soft-arci)] h-auto text-sm' type='submit'>
              Actualizar
            </button>
          </div>
        </div>
    </div>
  );
}
