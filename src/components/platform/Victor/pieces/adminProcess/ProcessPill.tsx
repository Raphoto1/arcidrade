import React from "react";

export default function ProcessPill() {
  return (
    <div className='w-full h-auto bg-white rounded-md flex flex-col'>
      <div className='w-full h-auto flex'>
        <div className='flex flex-col align-middle justify-center w-1/2 p-1'>
          <h3 className='text-(--main-arci) text-bold text-nowrap font-bold'>Institución</h3>
          <p className='text-sm text-gray-600 w-100'>Cirujano</p>
          <p className='font-light'>24/10/2025</p>
        </div>
        <div className='w-1/2 p-1'>
          <button className='btn bg-[var(--main-arci)] w-full text-white h-auto '>Detalle</button>
          <button className='btn bg-[var(--orange-arci)] w-full text-white h-auto '>Eliminar</button>
          <button className='btn bg-success w-full text-white h-auto '>Aceptar</button>
          <button className='btn bg-warning w-full text-white h-auto '>Solicitar Contacto</button>
        </div>
      </div>
        <div className="w-full flex justify-center">
          <span className="fontArci text-[var(--orange-arci)]">Proceso Arcidrade</span>
        </div>
    </div>
  );
}
