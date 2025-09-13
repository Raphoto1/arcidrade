import React from 'react'

export default function InvitationPill() {
  return (
    <div className='w-full h-auto bg-white rounded-md flex flex-col'>
      <div className='w-full h-auto flex'>
        <div className='flex flex-col align-middle justify-center w-2/3 p-1'>
          <h3 className='text-(--main-arci) text-bold text-nowrap font-bold'>Nombre Institución/Profesional</h3>
          <div className='flex'>
            <p className='text-sm text-gray-600 w-100'>Tipo de Invitación:</p>
            <p className='font-light text-[var(--main-arci)]'>Profesional</p>
                  </div>
                  <div className='flex'>
            <p className='text-sm text-gray-600 w-100'>Fecha de Envio:</p>
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
        </div>
        <div className='w-1/3 p-1'>
          <button className='btn bg-warning w-full text-white h-auto '>Pausar Invitación</button>
          <button className='btn bg-[var(--orange-arci)] w-full text-white h-auto '>Archivar</button>
          <button className='btn bg-success w-full text-white h-auto '>Reenviar Invitación</button>
        </div>
      </div>
    </div>
  )
}
