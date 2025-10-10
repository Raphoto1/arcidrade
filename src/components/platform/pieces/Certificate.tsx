'use client'
import React from "react";

import { FaStar } from "react-icons/fa";

import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ConfirmDeleteCertificationForm from "@/components/forms/platform/profesional/ConfirmDeleteCertificationForm";
import ModalForFormsSoftBlue from "@/components/modals/ModalForFormsSoftBlue";
import FileCertificationForm from "@/components/forms/platform/profesional/FileCertificationForm";
import ProfesionalCertificationUpdateForm from "@/components/forms/platform/profesional/ProfesionalCertificationUpdateForm";

export default function Certificate(props: any) {
  const date = new Date(props.end_date);
  const endDate = props.end_date ? date.getFullYear() : null;
  return (
    <div>
      <div className=' bg-gray-50 w-full rounded-sm p-2 grid grid-cols-2 gap-2 shadow-xl mt-2 justify-between items-center'>
        <div className='w-2/3'>
          <h2 className='text-(--main-arci) text-bold text-nowrap font-bold'>{props.title || "Nombre Cert"}</h2>
          <span className='text-sm text-gray-600 w-100'>{props.institution || "Universidad Grande"}</span>
          <p className='font-light'>{endDate || "No Finalizado"}</p>
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
        </div>
        <div className='controles grid justify-center gap-2 mt-4'>
          <ModalForFormsRedBtn title='Eliminar Certificado'>
            <ConfirmDeleteCertificationForm id={props.id} />
          </ModalForFormsRedBtn>
          <ModalForFormsSoftBlue title='Agregar Respaldo'>
            <FileCertificationForm id={props.id} />
          </ModalForFormsSoftBlue>
          <ModalForFormsSoftBlue title='Actualizar'>
            <ProfesionalCertificationUpdateForm id={props.id } />
          </ModalForFormsSoftBlue>
        </div>
      </div>
    </div>
  );
}
