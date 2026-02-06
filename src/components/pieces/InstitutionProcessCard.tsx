'use client'
import React from "react";
import { CiMedal } from "react-icons/ci";
import Image from "next/image";
import { useInstitutionById, useInstitutionFullById } from "@/hooks/usePlatInst";
import ModalForPreviewTextLink from "../modals/ModalForPreviewTextLink";
import UserDescription from "../platform/pieces/UserDescription";
import ModalForPreview from "../modals/ModalForPreview";
import InstitutionDetailById from "../platform/pieces/institutionDetailById";
import InstitutionDetailFullById from "../platform/pieces/InstitutionDetailFullById";
import { useProcess } from "@/hooks/useProcess";
import { useHandleStatusName } from "@/hooks/useUtils";
import ProcessDetail from "../platform/process/ProcessDetail";
import { useSession } from "next-auth/react";
import ModalForFormsGreenBtn from "../modals/ModalForFormsGreenBtn";
import ConfirmAddProfesionalToProcessForm from "../forms/platform/process/ConfirmAddProfesionalToProcessForm";
import { useProfesionalsListedInProcess } from "@/hooks/useProcess";


export default function InstitutionProcessCard(props: any) {
  const { data: session } = useSession()
  const profesionalIdBySession = session?.user.id
  const isProfesional = props.isProfesional;
  const isFake = props.isFake;
  const processId = props.processId || 1;
  const processDataProp = props.processData; // Datos del proceso pasados como prop
  const btnActive = props.btnActive !== undefined ? props.btnActive : true; // Por defecto es true 
  
  // Solo hacer fetch si no tenemos datos del proceso como prop
  const { data: processData, isLoading: processLoading, error: processError } = useProcess(processDataProp ? null : processId);
  
  const processPack = processDataProp || processData?.payload || {};

  const { data: listedPack } = useProfesionalsListedInProcess(processPack?.id || null);
  const alreadyApplied = Boolean(
    listedPack?.payload?.find(
      (entry: any) => entry?.profesional_id === profesionalIdBySession && entry?.added_by === "profesional"
    )
  );
  
  // Si los datos de institución vienen en el proceso (modo público), usarlos directamente
  const institutionDataFromProcess = processPack.auth?.institution_data;
  
  // En modo público (processDataProp existe), solo usar datos que ya vienen incluidos
  // En modo privado (sin processDataProp), buscar por userId si es necesario
  const shouldFetchInstitution = !processDataProp && !institutionDataFromProcess && processPack.user_id;
  const userId = shouldFetchInstitution ? processPack.user_id : null;
  
  // Solo hacer fetch de institución si estamos en modo privado y hay userId
  const { data, error, isLoading } = useInstitutionFullById(userId);
  
  // Acceso seguro a los datos de la institución
  const institutionData = institutionDataFromProcess || data?.payload?.institution_data || {};
  
  const institutionInfo = institutionData || {};

  if (isLoading || processLoading) return <div>Cargando...</div>;
  if (error || processError) return <div>Error al cargar la institución</div>;

  return (
    <div className='card w-96 bg-base-100 card-sm shadow-sm max-w-80'>
      <div className='topHat bg-(--orange-arci) w-full h-20 flex align-middle items-center justify-between rounded-t-lg pr-2'>
        <div className="pl-2">
          {processPack.status == 'pending' && <h1 className="text-xl font-bold text-white">Proceso sin Confirmar</h1>}
          <h2 className='font-oswald text-xl text-white capitalize'>{processPack.position || "Cargo Oferta"}</h2>
          <h3 className="font-oswald text-sm text-white capitalize">{useHandleStatusName(processPack.profesional_status) || "Estado Oferta"}</h3>
        </div>
        <div className='relative w-15 h-15'>
          {institutionInfo.avatar ? (
            <Image src={institutionInfo.avatar} className='w-full h-full rounded-full object-cover' width={500} height={500} alt='fillImage' />
          ) : (
            <Image src='/logos/Logo Arcidrade Cond.png' className='w-full h-full rounded-full object-cover' width={500} height={500} alt='fillImage' />
          )}
        </div>
      </div>

      <div className='card-body'>
        <h2 className='card-title font-oswald text-xl text-(--main-arci)'>{isFake ? institutionInfo.fake_name : institutionInfo.name || "Arcidrade"}</h2>
        <p className='description h-10 font-roboto-condensed line-clamp-2'>{processPack.description || "Sin descripción"}</p>
        {isFake ? (
          <div></div>
        ) : institutionInfo.description || processPack.description ? (
          <ModalForPreviewTextLink title='Ver Más...'>
            <UserDescription description={processPack.description} />
          </ModalForPreviewTextLink>
        ) : (
          <div className='h-5'> </div>
        )}
        <div className='flex justify-between card-actions items-end'>
          <div className='extraInfo font-roboto-condensed text-red-700'>
            <p>Especialización solicitada</p>
            <p className='font-bold text-xl capitalize text-wrap max-w-30'>{processPack.main_speciality || "especialización de la oferta"}</p>
          </div>
          <div className='rightActions flex flex-col justify-end font-roboto-condensed'>
            {/* <p>state</p> REVISAR LOGICA SIGUIENTE*/}
            {isFake & isProfesional? (
              <ModalForPreview title={"Ver Detalle"}>
                <ProcessDetail processData={{ ...processPack }} isFake />
              </ModalForPreview>
            ) : (
              <ModalForPreview title={"Ver Detalle"}>
                {processPack && Object.keys(processPack).length > 0 ? (
                    <ProcessDetail processData={{ ...processPack }} btnActive={btnActive} isFake={false} profesionalId={profesionalIdBySession } />
                ) : (
                  <div>Cargando datos del proceso...</div>
                )}
              </ModalForPreview>
            )}
            {btnActive && session?.user?.area === "profesional" && !alreadyApplied && (
              <ModalForFormsGreenBtn title={"Aplicar al Proceso"}>
                <ConfirmAddProfesionalToProcessForm ProcessId={processPack.id} UserID={session?.user.id} addedBy={"profesional"} processPosition={processPack.position} />
              </ModalForFormsGreenBtn>
            )}
            {btnActive && session?.user?.area === "profesional" && alreadyApplied && (
              <p className='text-xs text-gray-500'>Ya aplicaste a este proceso</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
