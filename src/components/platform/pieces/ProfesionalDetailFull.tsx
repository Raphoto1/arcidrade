import React from "react";
import Image from "next/image";

import { IoDocumentAttachOutline } from "react-icons/io5";
import ModalForForm from "../../modals/ModalForForms";
import FileCvForm from "@/components/forms/platform/profesional/FileCvForm";

export default function ProfesionalDetailFull() {
  return (
    <div className='Total grid gap-2 md:grid-cols-3 pt-2 overflow-auto'>
      <div className='flex flex-col justify-center align-middle items-center'>
        <Image
          src='https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp'
          className='w-40 h-40 max-w-96 rounded-full justify-center align-middle items-center'
          width={500}
          height={500}
          objectFit='cover'
          alt='fillImage'
        />
        <h1 className='text-2xl fontArci text-center'>Nombre Bastante Largo</h1>
        <p className='text-center'>Medico Profesional Full</p>
        <button className='btn bg-[var(--main-arci)] text-white'>Agregar Al Proceso</button>
      </div>
      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
        <h1 className='text-2xl fontArci text'>Presentación</h1>
        <p className='text-sm'>Lorem ipsum dolor sit amet consectetur.</p>
      </div>
      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
        <div className='fileSpace bg-gray-50 w-full rounded-sm p-2 grid grid-cols-3 gap-2 shadow-xl'>
          <div className='flex max-w-xs flex-shrink-0 justify-center items-center border-2 border-dashed border-gray-300 rounded-md p-2'>
            <IoDocumentAttachOutline size={36} />
          </div>
          <div>
            <span>Archivo:</span>
            <p className='text-accent'>Nombre de archivo</p>
          </div>
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
              <h3 className='font-light'>Numero de Contacto</h3>
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
            <div className='flex justify-between'>
              <h3 className='font-light'>Profesión</h3>
              <p className='text-(--main-arci)'>Medico General</p>
            </div>
            <div className='flex justify-between'>
              <h3 className='font-light'>Institución</h3>
              <p className='text-(--main-arci)'>Pontificia Universidad Javeriana</p>
            </div>
            <div className='flex justify-between'>
              <h3 className='font-light'>Status</h3>
              <p className='text-(--main-arci)'>Graduado</p>
            </div>
          </div>
        </div>
      </div>
      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
        <h1 className='text-2xl fontArci text'>Especialidades</h1>
        <div className='bg-white rounded-md p-1'>
          <h3 className='fontArci text-[var(--main-arci)]'>Especialidad especial</h3>
          <p className='text-sm text-[var(--soft-arci)]'>Universidad Javeriana</p>
          <p className='text-xs'>2018</p>
          <div className='flex justify-end'>
            <button className='btn bg-[var(--main-arci)] text-white justify-end'>Ver Respaldo</button>
          </div>
        </div>
      </div>
      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
        <h1 className='text-2xl fontArci text'>Certificaciones</h1>
        <div className='bg-white rounded-md p-1'>
          <h3 className='fontArci text-[var(--main-arci)]'>Medicina Familiar</h3>
          <p className='text-sm text-[var(--soft-arci)]'>Universidad Nacional</p>
          <p className='text-xs'>2010</p>
          <div className='flex justify-end'>
            <button className='btn bg-[var(--main-arci)] text-white justify-end'>Ver Respaldo</button>
          </div>
        </div>
      </div>

      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>

          <h1 className='text-2xl fontArci'>Experiencia</h1>
          

        <div className='bg-white rounded-md p-1'>
          <div className="flex justify-between">
            <h3 className='fontArci text-[var(--main-arci)]'>Cargo X</h3>
            <button className='btn bg-[var(--main-arci)] text-white justify-end'>Ver Respaldo</button>
          </div>
          <p className='text-sm text-[var(--soft-arci)]'>Clinica alejada</p>
          <div>
            <p className='text-xs'>Cartagena</p>
            <p className='text-xs text-[var(--soft-arci)]'>2019</p>
          </div>
          <div>
            <h3 className='text-[var(--main-arci)]'>Descripción:</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel magnam soluta repudiandae esse delectus vero aliquid, maiores dolorem! Sed
              cupiditate minima eaque dicta mollitia voluptas?...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
