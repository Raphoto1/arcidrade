'use client'
import React, { use } from "react";
import { CiMedal } from "react-icons/ci";
import Image from "next/image";
import { useProfesional, useProfesionalById } from "@/hooks/usePlatPro";
import { useFullName, useHandleStatusName } from "@/hooks/useUtils";
import ModalForPreview from "../modals/ModalForPreview";
import ProfesionalDetail from "../platform/pieces/ProfesionalDetail";
import ProfesionalDetailById from "../platform/pieces/ProfesionalDetailById";
import ProfesionalDetailFullById from "../platform/pieces/ProfesionalDetailFullById";
import ModalForPreviewTextLink from "../modals/ModalForPreviewTextLink";
import UserDescription from "../platform/pieces/UserDescription";
import ModalForFormsSoftBlue from "../modals/ModalForFormsSoftBlue";
import ConfirmAddProfesionalToProcessForm from "../forms/platform/process/ConfirmAddProfesionalToProcessForm";
import ModalForFormsRedBtn from "../modals/ModalForFormsRedBtn";
import ConfirmDeleteProfesionalToProcessForm from "../forms/platform/process/ConfirmDeleteProfesionalToProcessForm";
import ModalForForms from "../modals/ModalForForms";

export default function ProfesionalCard(props: any) {
  const isFake = props.isFake;
  const userId = props.userId || "cmgi49p7q0003ytea9dc5yzjg";
  const { data, error, isLoading } = useProfesionalById(userId);
  const profesionalData = data ? data.payload : {};
  
  // Acceso seguro a los arrays
  const profesionalInfo = profesionalData.profesional_data?.[0] || {};
  const mainStudyInfo = profesionalData.main_study?.[0] || {};
  
  // Llamar todos los hooks al inicio, no condicionalmente
  const fullName = useFullName(profesionalInfo.name, profesionalInfo.last_name);
  const statusName = useHandleStatusName(mainStudyInfo.status);
  
  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar el profesional</div>;
  // console.log("profesional data Card", data?.payload);
  return (
    <div className='card w-96 bg-base-100 card-sm shadow-sm max-w-80'>
      <div className='topHat bg-[var(--soft-arci)] w-full h-20 flex align-middle items-center justify-between rounded-t-lg pr-2'>
        {props.btnActive ? (
          <div className='buttons w-40 h-15 ml-2 grid flex-col content-between'>
            <ModalForForms title='Agregar Candidato'>
              <ConfirmAddProfesionalToProcessForm UserID={userId} ProcessId={props.processId} fullName={isFake ? profesionalInfo.fake_name : fullName || "noname"} processPosition={props.processPosition} addedBy={props.addedBy||'noBody' } />
            </ModalForForms>
            <ModalForFormsRedBtn title='Eliminar Candidato'>
              <ConfirmDeleteProfesionalToProcessForm UserID={userId} ProcessId={props.processId} fullName={isFake ? profesionalInfo.fake_name : fullName || "noname"} processPosition={props.processPosition}/>
            </ModalForFormsRedBtn>

          </div>
        ) : (
          <div></div>
        )}

        {props.isSelected && (
          <div className='Badge w-15 h-15 ml-2 flex justify-center align-middle items-center'>
            <div className='badge badge-success badge-xs'>
              <CiMedal />
              Seleccionado
            </div>
          </div>
        )}
        <div className='relative w-15 h-15'>
          {profesionalInfo.avatar ? (
            <Image
              src={profesionalInfo.avatar}
              className='w-full h-full rounded-full object-cover'
              width={500}
              height={500}
              alt='fillImage'
            />
          ) : (
            <Image src='/logos/Logo Arcidrade Cond.png' className='w-full h-full rounded-full object-cover' width={500} height={500} alt='fillImage' />
          )}
        </div>
      </div>

      <div className='card-body'>
        <h2 className='card-title font-oswald text-xl text-(--main-arci)'>{isFake ? profesionalInfo.fake_name : fullName || "noname"}</h2>

        <p className='description h-10 font-roboto-condensed line-clamp-2'>{profesionalInfo.description || "Sin descripción"}</p>
        {isFake ? <div></div> : (
          profesionalInfo.description ? (
            <ModalForPreviewTextLink title='Ver Más...'>
              <UserDescription description={profesionalInfo.description} />
            </ModalForPreviewTextLink>
          ) : <div className="h-5">   </div>
        )}
        <div className='flex justify-between card-actions items-end'>
          <div className='extraInfo font-roboto-condensed text-red-700'>
            <p className='capitalize'>{mainStudyInfo.title || "sin título"}</p>
          </div>
          <div className='rightActions flex flex-col justify-end font-roboto-condensed'>
            <p>{statusName || "no registrado"}</p>
            {isFake ? (
              <ModalForPreview title={"Ver Detalle"}>
                <ProfesionalDetailById userId={userId} />
              </ModalForPreview>
            ) : (
              <ModalForPreview title={"Ver Detalle"}>
                <ProfesionalDetailFullById userId={userId} />
              </ModalForPreview>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
