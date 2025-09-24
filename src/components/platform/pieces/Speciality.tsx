//impports de app
import React from "react";
import { FaStar } from "react-icons/fa";
//imports propios
import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ConfirmDeleteSpecialityForm from "@/components/forms/platform/profesional/ConfirmDeleteSpecialityForm";
export default function Speciality(props: any) {
  //manejo de fechas
  const date = new Date(props.end_date);
  let endDate: number | null = date.getFullYear();
  if (props.end_date === null) {
    endDate = null;
  }
  //handler de eliminar

  //handler de hacer Principal
  const makeMainHandler = () => {};
  //handler de agregar Respaldo

  //handler de eliminar respaldo

  //handler de actualizar
  return (
    <div>
      <div className=' bg-gray-50 w-full rounded-sm p-2 grid grid-cols-2 gap-2 shadow-xl mt-2 justify-between items-center'>
        <div className='w-2/3'>
          <div className=''>
            <FaStar />
          </div>
          <h2 className='text-(--main-arci) text-bold text-nowrap font-bold'>{props.title || "Especialidad"}</h2>
          <p className='text-sm text-gray-800 w-100'>{props.title_category || "Categoria Universidad"}</p>
          <span className='text-sm text-gray-600 w-100'>{props.institution || "Universidad Grande"}</span>
          <p className='font-light'>{endDate || "No Filanizado"}</p>
          <h4>Archivo</h4>
          <p>documento.pdf</p>
        </div>
        <div className='controles grid justify-center gap-2 mt-4'>
          <ModalForFormsRedBtn title='Eliminar Especialidad'>
            <ConfirmDeleteSpecialityForm id={props.id} />
          </ModalForFormsRedBtn>
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
