import React from "react";

import { IoDocumentAttachOutline } from "react-icons/io5";
import ModalForForm from "../../modals/ModalForForms";
import ProfesionalProfileHookForm from "@/components/forms/platform/profesional/ProfesionalProfileHookForm";

export default function InstitutionData() {
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Información General</h1>
      </div>
      <div className='dataSpace bg-gray-50 w-full rounded-sm p-2 grid mt-2 shadow-xl'>
        <h2 className='text-bold text-xl text-nowrap dataSpaceTitle pl-4'>Datos Personales</h2>
        <div className='w-full'>
          <div className='flex justify-between'>
            <h3 className='font-light'>Nombre</h3>
            <p className='text-(--main-arci)'>Juan Pérez</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Apellido</h3>
            <p className='text-(--main-arci)'>Juan Pérez</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='text-light'>Fecha de Nacimiento</h3>
            <p className='text-(--main-arci)'>30/06/1987</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Email</h3>
            <p className='text-(--main-arci)'>juan.perez@example.com</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Campaña</h3>
            <p className='text-(--main-arci)'>123-456-7890</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Pais</h3>
            <p className='text-(--main-arci)'>México</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Ciudad</h3>
            <p className='text-(--main-arci)'>Guanajuato</p>
          </div>
        </div>
        <div className='controles justify-end flex gap-2 mt-4'>
          <button className='btn bg-[var(--soft-arci)] h-7'>Cambiar contraseña</button>
          <ModalForForm title='Modificar'>
            <ProfesionalProfileHookForm />
          </ModalForForm>
        </div>
      </div>
    </div>
  );
}
