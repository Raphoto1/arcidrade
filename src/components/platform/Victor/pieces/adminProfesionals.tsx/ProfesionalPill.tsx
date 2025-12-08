import React from "react";
import { useHandleStatusName, formatDateToString, useFullName, useHandleCategoryName } from "@/hooks/useUtils";
import ModalForPreview from "@/components/modals/ModalForPreview";
import ProfesionalDetailFullById from "@/components/platform/pieces/ProfesionalDetailFullById";
import ModalForForms from "@/components/modals/ModalForForms";
import ConfirmAskContactForm from "@/components/forms/platform/victor/ConfirmAskContactForm";
import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ConfirmPauseUserForm from "@/components/forms/platform/victor/ConfirmPauseUserForm";
import ModalForFormsGreenBtn from "@/components/modals/ModalForFormsGreenBtn";
import ConfirmActivateUserForm from "../../../../forms/platform/victor/ConfirmActivateUserForm";
import UserDescriptionVictorForm from "@/components/forms/platform/victor/UserDescriptionVictorForm";
import ConfirmDeleteUserForm from "@/components/forms/platform/victor/ConfirmDeleteUserForm";
interface ProfesionalPillProps {
  profesional?: {
    referCode: string;
    email?: string;
    status?: string;
    profesional_data?: {
      name?: string;
      last_name?: string;
      description?: string;
      phone?: string;
      city?: string;
      country?: string;
      state?: string;
      fake_name?: string;
      birth_date?: string;
      local_id?: string;
      cv_file?: string;
      cv_link?: string;
      avatar?: string;
    };
    main_study?: {
      title?: string;
      institution?: string;
      status?: string;
      sub_area?: string;
    };
    study_specialization?: Array<{
      title?: string;
      title_category?: string;
      institution?: string;
      description?: string;
    }>;
    profesional_certifications?: Array<{
      title?: string;
      institution?: string;
    }>;
    experience?: Array<{
      title?: string;
      company?: string;
      description?: string;
    }>;
  };
  isPaused?: boolean;
}

export default function ProfesionalPill({ profesional, isPaused = false }: ProfesionalPillProps) {
  // Validación de seguridad: si no hay profesional, mostrar componente vacío
  
  if (!profesional) {
    return (
      <div className='w-full h-auto bg-gray-100 rounded-md flex flex-col shadow-sm border border-gray-200'>
        <div className='w-full h-auto flex items-center justify-center p-4'>
          <p className='text-gray-500'>Datos no disponibles</p>
        </div>
      </div>
    );
  }

  // Extraer datos de las estructuras - algunas son objetos, otras arrays
  const profesionalData = profesional.profesional_data || {};
  const mainStudy = profesional.main_study || {};
  const specialization = profesional.study_specialization?.[0] || {};
  const certification = profesional.profesional_certifications?.[0] || {};

  // Usar las utilidades existentes
  const fullName = useFullName(profesionalData.name, profesionalData.last_name) || "Sin nombre";
  const status = useHandleStatusName(mainStudy.status);

  // Otros datos formatados
  const specialty = specialization.title || mainStudy.title || "No especificada";
  const institution = specialization.institution || mainStudy.institution || certification.institution || "No registrada";
  const email = profesional.email || "No registrado";
  const city = profesionalData.city || "No registrada";
  const phone = profesionalData.phone || "No registrado";
  const referCode = profesional.referCode || "No generado";

  return (
    <div className='w-full h-auto bg-white rounded-md flex flex-col shadow-sm border border-gray-200 hover:shadow-md transition-shadow'>
      <div className='w-full h-auto flex'>
        <div className='flex flex-col align-middle justify-center w-2/3 p-3'>
          <h3 className='text-(--main-arci) text-bold text-nowrap font-bold mb-2 truncate' title={fullName}>
            {fullName}
          </h3>

          <div className='space-y-1'>
            <div className='flex'>
              <p className='text-sm text-gray-600 w-32 shrink-0'>Categoria de Profesion:</p>
              <p className='font-light text-(--main-arci) truncate' title={mainStudy.sub_area}>
                {useHandleCategoryName(mainStudy.sub_area)}
              </p>
            </div>
            <div className='flex'>
              <p className='text-sm text-gray-600 w-32 shrink-0'>Especialidad:</p>
              <p className='font-light text-(--main-arci) truncate' title={specialty}>
                {specialty}
              </p>
            </div>

            <div className='flex'>
              <p className='text-sm text-gray-600 w-32 shrink-0'>Institución:</p>
              <p className='font-light text-(--main-arci) truncate' title={institution}>
                {institution}
              </p>
            </div>

            <div className='flex'>
              <p className='text-sm text-gray-600 w-32 shrink-0'>Status:</p>
              <p className='font-light text-(--main-arci)'>{status}</p>
            </div>

            <div className='flex'>
              <p className='text-sm text-gray-600 w-32 shrink-0'>Email:</p>
              <p className='font-light text-(--main-arci) truncate' title={email}>
                {email}
              </p>
            </div>

            <div className='flex'>
              <p className='text-sm text-gray-600 w-32 shrink-0'>Ciudad:</p>
              <p className='font-light text-(--main-arci)'>{city}</p>
            </div>

            <div className='flex'>
              <p className='text-sm text-gray-600 w-32 shrink-0'>Teléfono:</p>
              <p className='font-light text-(--main-arci)'>{phone}</p>
            </div>

            <div className='flex'>
              <p className='text-sm text-gray-600 w-32 shrink-0'>Código:</p>
              <p className='font-light text-(--main-arci) text-xs truncate' title={referCode}>
                {referCode.length > 15 ? referCode.substring(0, 15) + "..." : referCode}
              </p>
            </div>
          </div>
        </div>

        <div className='w-1/3 p-3 flex flex-col justify-center gap-2'>
          <ModalForPreview title='Detalle'>
            <ProfesionalDetailFullById userId={profesional.referCode} />
          </ModalForPreview>
          <ModalForForms title='Actualizar descripción'>
            <UserDescriptionVictorForm userId={profesional.referCode} area={"profesional"} />
          </ModalForForms>
          {isPaused ? (
            <ModalForFormsGreenBtn title='Activar Profesional'>
              <ConfirmActivateUserForm userId={profesional.referCode} userName={fullName} userEmail={email} />
            </ModalForFormsGreenBtn>
          ) : (
            <ModalForFormsRedBtn title='Pausar Profesional'>
              <ConfirmPauseUserForm userId={profesional.referCode} userName={fullName} userEmail={email} />
            </ModalForFormsRedBtn>
          )}
          <ModalForForms title='Solicitar Contacto'>
            <ConfirmAskContactForm referCode={referCode} name={fullName} />
          </ModalForForms>
          <ModalForFormsRedBtn title='Eliminar Usuario'>
            <ConfirmDeleteUserForm userId={profesional.referCode} userName={fullName} userEmail={email} />
          </ModalForFormsRedBtn>
        </div>
      </div>
    </div>
  );
}
