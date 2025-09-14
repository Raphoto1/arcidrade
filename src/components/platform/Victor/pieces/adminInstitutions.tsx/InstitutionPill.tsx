import React from "react";

export default function InstitutionPill() {
  return (
    <div className='w-full h-auto bg-white rounded-md flex flex-col'>
      <div className='w-full h-auto flex'>
        <div className='flex flex-col align-middle justify-center w-2/3 p-1'>
          <h3 className='text-(--main-arci) text-bold text-nowrap font-bold'>Nombre Institución</h3>
          <div className='flex'>
            <p className='text-sm text-gray-600 w-100'>Cantidad de Procesos:</p>
            <p className='font-light text-[var(--main-arci)]'>8</p>
          </div>
          <div className='flex'>
            <p className='text-sm text-gray-600 w-100'>Inscrito desde:</p>
            <p className='font-light text-[var(--main-arci)]'>05/08/2025</p>
          </div>
          <div className='flex'>
            <p className='text-sm text-gray-600 w-100'>Codigo Enviado:</p>
            <p className='font-light text-[var(--main-arci)]'>ds987adhb87adhiu87asdh</p>
          </div>
          <div className='flex'>
            <p className='text-sm text-gray-600 w-100'>Email:</p>
            <p className='font-light text-[var(--main-arci)]'>Profesional@pro.com</p>
          </div>
                    <div className='flex'>
            <p className='text-sm text-gray-600 w-100'>NIF:</p>
            <p className='font-light text-[var(--main-arci)]'>9876543</p>
          </div>
                    <div className='flex'>
            <p className='text-sm text-gray-600 w-100'>Ciudad:</p>
            <p className='font-light text-[var(--main-arci)]'>Sada</p>
          </div>
        </div>
        <div className='w-1/3 p-1 flex flex-col justify-center'>
          <button className='btn bg-[var(--main-arci)] w-full text-white h-auto '>Detalle</button>
          <button className='btn bg-[var(--orange-arci)] w-full text-white h-auto '>Pausar</button>
          <button className='btn bg-warning w-full text-white h-auto '>Solicitud de Contacto</button>
          <button className='btn bg-[var(--main-arci)] w-full text-white h-auto '>Procesos</button>
        </div>
      </div>
    </div>
  );
}
