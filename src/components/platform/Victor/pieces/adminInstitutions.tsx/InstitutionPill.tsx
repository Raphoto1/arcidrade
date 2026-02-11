import ConfirmAskContactForm from "@/components/forms/platform/victor/ConfirmAskContactForm";
import ModalForForms from "@/components/modals/ModalForForms";
import ModalForPreview from "@/components/modals/ModalForPreview";
import InstitutionDetailFullById from "@/components/platform/pieces/InstitutionDetailFullById";
import { useInstitutionById, useInstitutionFullById } from "@/hooks/usePlatInst";
import { formatDateToString } from "@/hooks/useUtils";
import React from "react";
import ConfirmPauseUserForm from "@/components/forms/platform/victor/ConfirmPauseUserForm";
import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ModalForFormsGreenBtn from "@/components/modals/ModalForFormsGreenBtn";
import ConfirmActivateUserForm from "../../../../forms/platform/victor/ConfirmActivateUserForm";
import UserDescriptionVictorForm from "@/components/forms/platform/victor/UserDescriptionVictorForm";
import ConfirmDeleteUserForm from "@/components/forms/platform/victor/ConfirmDeleteUserForm";

export default function InstitutionPill({ institution, isPaused }: { institution: any; isPaused?: boolean }) {
  const { data, isLoading, error } = useInstitutionFullById(institution);
  const institutionPack = data?.payload;

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar la institución.</p>;
  if (!institutionPack) return <p>Institución no encontrada.</p>;

  // Verificación adicional para institution_data
  const institutionData = institutionPack?.institution_data;
  if (!institutionData) return <p>Datos de institución no disponibles.</p>;

  const isDeactivated = typeof isPaused === "boolean"
    ? isPaused
    : institutionPack?.status === "desactivated" || institutionPack?.auth?.status === "desactivated";

  return (
    <div className='w-full h-auto bg-white rounded-md flex flex-col'>
      <div className='w-full h-auto flex'>
        <div className='flex flex-col align-middle justify-center w-2/3 p-1'>
          <h3 className='text-(--main-arci) text-bold text-wrap font-bold'>{institutionData?.name || "Nombre no disponible"}</h3>
          <div className='flex'>
            <p className='text-sm text-gray-600 w-100'>Cantidad de Procesos:</p>
            <p className='font-light text-(--main-arci)'>{institutionPack?.process.length || 0}</p>
          </div>
          <div className='flex'>
            <p className='text-sm text-gray-600 w-100'>Inscrito desde:</p>
            <p className='font-light text-(--main-arci)'>{formatDateToString(institutionPack?.creation_date) || "Fecha no disponible"}</p>
          </div>
          <div className='flex'>
            <p className='text-sm text-gray-600 w-100'>Codigo Enviado:</p>
            <p className='font-light text-(--main-arci)'>{institutionPack?.referCode || "Código no disponible"}</p>
          </div>
          <div className='flex'>
            <p className='text-sm text-gray-600 w-100'>Email:</p>
            <p className='font-light text-(--main-arci)'>{institutionPack?.email || "Email no disponible"}</p>
          </div>
          <div className='flex'>
            <p className='text-sm text-gray-600 w-100'>NIF:</p>
            <p className='font-light text-(--main-arci) text-end'>{institutionData?.company_id || "NIF no disponible"}</p>
          </div>
          <div className='flex'>
            <p className='text-sm text-gray-600 w-100'>Ciudad:</p>
            <p className='font-light text-(--main-arci) text-end'>{institutionData?.city || "Ciudad no disponible"}</p>
          </div>
        </div>
        <div className='w-1/3 p-1 flex flex-col justify-center'>
          <ModalForPreview title={"Ver Detalle"}>
            <InstitutionDetailFullById userId={institutionPack?.referCode} />
          </ModalForPreview>
          <ModalForForms title='Actualizar descripción'>
            <UserDescriptionVictorForm userId={institutionPack?.referCode} area={"institution"} />
          </ModalForForms>
          {isDeactivated ? (
            <ModalForFormsGreenBtn title='Activar Institución'>
              <ConfirmActivateUserForm
                userId={institutionPack?.referCode}
                userName={institutionData?.name || "Nombre no disponible"}
                userEmail={institutionPack?.email || "Email no disponible"}
              />
            </ModalForFormsGreenBtn>
          ) : (
            <ModalForFormsRedBtn title='Pausar Institución'>
              <ConfirmPauseUserForm
                userId={institutionPack?.referCode}
                userName={institutionData?.name || "Nombre no disponible"}
                userEmail={institutionPack?.email || "Email no disponible"}
              />
            </ModalForFormsRedBtn>
          )}
          <ModalForForms title={"Solicitar Contacto"}>
            <ConfirmAskContactForm referCode={institutionPack?.referCode} name={institutionData?.name || "Nombre no disponible"} />
          </ModalForForms>
          <ModalForFormsRedBtn title={"Eliminar Institución"}>
            <ConfirmDeleteUserForm userId={institutionPack?.referCode} userName={institutionData?.name || "Nombre no disponible"} userEmail={institutionPack?.email || "Email no disponible"} />
          </ModalForFormsRedBtn>
          {/* <button className='btn bg-[var(--main-arci)] w-full text-white h-auto '>Procesos</button> */}
        </div>
      </div>
    </div>
  );
}
