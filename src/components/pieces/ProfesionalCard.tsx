'use client'
import React, { useMemo } from "react";
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
import { fakerES as faker } from "@faker-js/faker";
import { useHandleCategoryName } from "@/hooks/useUtils";

export default function ProfesionalCard(props: any) {
  const isFake = props.isFake;
  const userId = props.userId || "cmgi49p7q0003ytea9dc5yzjg";
  
  // Si se proporcionan datos del profesional como prop, usarlos; si no, hacer la llamada
  const shouldFetch = !props.profesionalData;
  const { data, error, isLoading } = useProfesionalById(shouldFetch ? userId : null);
  
  // Usar datos de props o de la llamada
  const profesionalData = props.profesionalData || data?.payload || {};
  
  // Acceso seguro a los datos con validación adicional
  const profesionalInfo = profesionalData.profesional_data || {};
  const mainStudyInfo = profesionalData.main_study || {};  // Función para generar iniciales
  const getInitials = (fullName: string) => {
    if (!fullName) return "N/A";
    return fullName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('.');
  };

  // Llamar todos los hooks al inicio, no condicionalmente
  const fullName = useFullName(profesionalInfo.name, profesionalInfo.last_name);
  const statusName = useHandleStatusName(mainStudyInfo.status);
  
  // Memoizar el nombre a mostrar basado en si es fake o no
  const displayName = useMemo(() => {
    if (isFake) {
      // Si es fake, generar apellido falso y mostrar solo iniciales
      const fakeLastName = faker.person.lastName();
      const fakeName = profesionalInfo.fake_name || "Nombre";
      const nameInitials = getInitials(fakeName);
      const lastNameInitials = getInitials(fakeLastName);
      return `${nameInitials} ${lastNameInitials}`;
    } else {
      // Si no es fake, mostrar el nombre completo
      return fullName || "Sin nombre";
    }
  }, [isFake, profesionalInfo.fake_name, fullName]);

  // Nombre para los formularios (necesita ser completo para identificación)
  const formName = useMemo(() => {
    if (isFake) {
      return profesionalInfo.fake_name || "noname";
    } else {
      return fullName || "noname";
    }
  }, [isFake, profesionalInfo.fake_name, fullName]);
  
  if (shouldFetch && isLoading) return <div>Cargando...</div>;
  if (shouldFetch && error) return <div>Error al cargar el profesional</div>;
  if (!profesionalData || (shouldFetch && !data?.payload)) return <div>No se encontró el profesional</div>;

  return (
    <div className='card w-96 bg-base-100 card-sm shadow-sm max-w-80'>
      <div className='topHat bg-[var(--soft-arci)] w-full h-20 flex align-middle items-center justify-between rounded-t-lg pr-2'>
        {props.btnActive ? (
          <div className='buttons w-40 h-15 ml-2 grid flex-col content-between'>
            {!props.hideAddCandidate && (
              props.disableAddCandidate ? (
                <button className='btn btn-disabled h-auto w-auto p-1 min-w-full' type='button' disabled>
                  Ya agregado
                </button>
              ) : (
                <ModalForForms title='Agregar Candidato'>
                  <ConfirmAddProfesionalToProcessForm 
                    UserID={userId} 
                    ProcessId={props.processId} 
                    fullName={formName} 
                    processPosition={props.processPosition} 
                    addedBy={props.addedBy || 'noBody'}
                    isArci={props.isArci || false}
                  />
                </ModalForForms>
              )
            )}
            {!props.hideDeleteCandidate && (
              <ModalForFormsRedBtn title='Eliminar Candidato'>
                <ConfirmDeleteProfesionalToProcessForm 
                  UserID={userId} 
                  ProcessId={props.processId} 
                  fullName={formName} 
                  processPosition={props.processPosition}
                />
              </ModalForFormsRedBtn>
            )}
          </div>
        ) : (
          <div></div>
        )}

        {props.isSelected && (
          <div className='Badge w-15 h-15 ml-2 flex justify-center align-middle items-center z-30'>
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
        <h2 className='card-title font-oswald text-xl text-[var(--main-arci)]'>{ useHandleCategoryName(mainStudyInfo.sub_area)} {displayName}</h2>
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
            <p className='capitalize'>{useHandleCategoryName(mainStudyInfo.sub_area) || "Sin registro"}</p>
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
