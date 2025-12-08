import React from "react";

import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ConfirmDeleteExperienceForm from "@/components/forms/platform/profesional/ConfirmDeleteExperienceForm";
import ModalForFormsSoftBlue from "@/components/modals/ModalForFormsSoftBlue";
import ProfesionalExperienceUpdateForm from "@/components/forms/platform/profesional/ProfesionalExperienceUpdateForm";
import FileExperienceForm from "@/components/forms/platform/profesional/FileExperienceForm";
import ConfirmDeleteGoalInstitutionForm from "@/components/forms/platform/institution/ConfirmDeleteGoalInstitutionForm";
import InstitutionGoalUpdateForm from "@/components/forms/platform/institution/InstitutionGoalUpdateForm";
import FileGoalForm from "@/components/forms/platform/institution/FileGoalForm";

export default function Goal(props: any) {
  const date = new Date(props.year);
  const year = props.year ? date.getFullYear() : null;
  return (
    <div>
      <div className=' bg-gray-50 w-auto min-w-full rounded-sm p-2 grid grid-cols-2 shadow-xl mt-2 items-center'>
        <div className='w-full'>
          <h2 className='text-(--main-arci) text-bold font-bold'>{props.title || "Logro"}</h2>
          <p className='font-light text-sm'>{year || "Año de logro"}</p>
          {props.link && props.file && <h4>Respaldo</h4>}
          {props.link ? (
            <div className='m-0 p-0'>
              <h4 className='mt-2 font-semibold'>Link</h4>
              <a href={props.link} target='_blank' className='text-sm text-gray-700'>
                preview
              </a>
            </div>
          ) : null}
          {props.file ? (
            <div>
              <h4 className='mt-2 font-semibold'>Archivo</h4>
              <a href={props.file} target='_blank' className='text-sm text-gray-700'>
                preview
              </a>
            </div>
          ) : null}
          <div className='w-full'>
            <h3>Descripcion:</h3>
            <p className='text-sm min-w-full font-extralight'>{props.description || "Descripción"}</p>
          </div>
        </div>
        <div className='controles w-auto grid justify-end gap-2'>
          <ModalForFormsRedBtn title='Eliminar Logro'>
            <ConfirmDeleteGoalInstitutionForm id={props.id} />
          </ModalForFormsRedBtn>
          <ModalForFormsSoftBlue title='Agregar Respaldo'>
            <FileGoalForm id={props.id} />
          </ModalForFormsSoftBlue>
          <ModalForFormsSoftBlue title='Actualizar'>
            <InstitutionGoalUpdateForm id={props.id} />
          </ModalForFormsSoftBlue>
        </div>
      </div>
    </div>
  );
}
