import React from "react";

import { IoDocumentAttachOutline } from "react-icons/io5";
import ProfesionalDataForm from "../../modals/platform/profesional/ProfesionalDataForm";
import ModalForForm from "../../modals/ModalForForms";
import ProfesionalProfileForm from "../../forms/platform/profesional/ProfesionalProfileForm";

export default function PersonalData() {
  return (
      <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:h-auto'>
          <div className="pb-2">
              <h1 className="text-2xl fontArci text-center">Curriculum</h1>
          </div>
      <div className='fileSpace bg-gray-50 w-full rounded-sm p-2 grid grid-cols-3 gap-2 shadow-xl'>
        <div className='flex max-w-xs flex-shrink-0 justify-center items-center border-2 border-dashed border-gray-300 rounded-md p-2'>
          <IoDocumentAttachOutline size={36} />
        </div>
        <div>
          <span>Archivo:</span>
          <p>Nombre de archivo</p>
        </div>
        <div className='controls grid'>
          <button className='btn bg-[var(--orange-arci)] h-7 w-20 text-white'>Eliminar</button>
          <button className='btn bg-[var(--soft-arci)] h-7 w-20' type='submit'>
            Modificar
          </button>
        </div>
      </div>
          <div className='dataSpace bg-gray-50 w-full rounded-sm p-2 grid mt-2 shadow-xl'>
              <h2 className="text-bold text-xl text-nowrap dataSpaceTitle pl-4">Datos Personales</h2>
              <div className="w-full">
                  <div className="flex justify-between">
                    <h3 className="font-light">Nombre</h3>
                    <p className="text-(--main-arci)">Juan Pérez</p>
                  </div>
                  <div className="flex justify-between">
                    <h3 className="font-light">Apellido</h3>
                    <p className="text-(--main-arci)">Juan Pérez</p>
                  </div>
                  <div className="flex justify-between">
                    <h3 className="text-light">Fecha de Nacimiento</h3>
                    <p className="text-(--main-arci)">30/06/1987</p>
                  </div>
                  <div className="flex justify-between">
                    <h3 className="font-light">Email</h3>
                    <p className="text-(--main-arci)">juan.perez@example.com</p>
                  </div>
                  <div className="flex justify-between">
                    <h3 className="font-light">Numero de Contacto</h3>
                    <p className="text-(--main-arci)">123-456-7890</p>
                  </div>
                  <div className="flex justify-between">
                    <h3 className="font-light">Pais</h3>
                    <p className="text-(--main-arci)">México</p>
                  </div>
                  <div className="flex justify-between">
                    <h3 className="font-light">Ciudad</h3>
                    <p className="text-(--main-arci)">Guanajuato</p>
                  </div>
                  <div className="flex justify-between">
                    <h3 className="font-light">Profesión</h3>
                    <p className="text-(--main-arci)">Medico General</p>
                  </div>
                  <div className="flex justify-between">
                    <h3 className="font-light">Institución</h3>
                    <p className="text-(--main-arci)">Pontificia Universidad Javeriana</p>
                  </div>
                  <div className="flex justify-between">
                    <h3 className="font-light">Status</h3>
                    <p className="text-(--main-arci)">Graduado</p>
                  </div>
              </div>
              <div className="controles justify-end flex gap-2 mt-4">
          <button className="btn bg-[var(--soft-arci)] h-7">Cambiar contraseña</button>
          <ModalForForm title="Modificar">
            <ProfesionalProfileForm />
          </ModalForForm>
              </div>
      </div>
    </div>
  );
}
