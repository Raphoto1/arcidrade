"use client";
//imports de app
import { useEffect } from "react";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";
import Link from "next/link";
//immports propios
import ModalForForm from "../../modals/ModalForForms";
import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ModalForFormsSoftBlue from "@/components/modals/ModalForFormsSoftBlue";
import ProfesionalProfileHookForm from "@/components/forms/platform/profesional/ProfesionalProfileHookForm";
import ConfirmDeleteCvForm from "@/components/forms/platform/profesional/ConfirmDeleteCvForm";
import FileCvForm from "@/components/forms/platform/profesional/FileCvForm";
import FileMainStudyForm from "@/components/forms/platform/profesional/FileMainStudyForm";
import ConfirmDeleteMainStudyForm from "@/components/forms/platform/profesional/ConfirmDeleteMainStudyForm";
import { useProfesional } from "@/hooks/usePlatPro";
import { useHandleStatusName, useHandleCategoryName } from "@/hooks/useUtils";

export default function PersonalData() {
  const { data, error, isLoading } = useProfesional();
  const { data: session } = useSession();

  //loaders
  if (isLoading) {
    return <div>Cargando... datos</div>;
  }

  // error handling
  if (error) {
    return <div className='text-red-600'>Error al cargar datos: {error.message}</div>;
  }

  // data validation
  if (!data?.payload || !Array.isArray(data.payload) || data.payload.length === 0) {
    return <div className='text-yellow-600'>No hay datos disponibles</div>;
  }

  const personalData = data.payload[0];
  const studyData = data.payload[1] || {}; // Safe fallback

  //adjust birthdate with validation
  const formatBirthDate = () => {
    if (!personalData?.birth_date) return "No Registra Información";
    const fecha = new Date(personalData.birth_date);
    if (isNaN(fecha.getTime())) return "Fecha inválida";
    return fecha.toLocaleString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit" });
  };
  const fechaFormateada = formatBirthDate();

  //adjust country with validation
  const countryName: ICountry | undefined = personalData?.country ? Country.getCountryByCode(personalData.country) : undefined;

  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-1 md:justify-center md:h-auto'>
      <div className='pb-1'>
        {personalData?.name == null ? (
          <div>
            <h1 className='text-2xl font-extrabold capitalize fontArci text-center text-(--main-arci)'>
              Inicie AQUÍ Completando sus Datos Personales Para que pueda ser encontrado en la plataforma
            </h1>
          </div>
        ) : null}
        <h1 className='text-2xl fontArci text-center'>Curriculum</h1>
      </div>
      <div className='fileSpace bg-gray-50 w-full rounded-sm p-2 grid grid-cols-3 gap-2 shadow-xl'>
        <div className='flex max-w-xs flex-shrink-0 justify-center items-center border-2 border-dashed border-gray-300 rounded-md p-2'>
          <IoDocumentAttachOutline size={36} />
        </div>
        <div>
          {personalData?.cv_link ? (
            <div className='flex flex-col'>
              <span>Link</span>
              <a className='link text-blue-300' href={personalData.cv_link} target='_blank' rel='noopener noreferrer'>
                Previsualizar
              </a>
            </div>
          ) : personalData?.cv_file ? (
            <div className='flex flex-col'>
              <span>Archivo</span>
              <a className='link text-blue-300' href={personalData.cv_file} target='_blank' rel='noopener noreferrer'>
                Previsualizar
              </a>
            </div>
          ) : (
            <span>Aún no existe CV registrada.</span>
          )}
        </div>
        {personalData?.name != null ? (
          <div className='controls grid'>
            {personalData?.cv_link || personalData?.cv_file ? (
              <ModalForFormsRedBtn title='Eliminar'>
                <ConfirmDeleteCvForm />
              </ModalForFormsRedBtn>
            ) : null}
            <ModalForFormsSoftBlue title='Modificar'>
              <FileCvForm />
            </ModalForFormsSoftBlue>
          </div>
        ) : null}
      </div>
      <div className='dataSpace bg-gray-50 w-full rounded-sm p-2 grid mt-2 shadow-xl'>
        <h2 className='text-bold text-xl text-nowrap dataSpaceTitle pl-4'>Datos Personales</h2>
        <div className='w-full'>
          <div className='flex justify-between'>
            <h3 className='font-light'>Nombre:</h3>
            <p className='text-(--main-arci)'>{personalData?.name || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Apellido:</h3>
            <p className='text-(--main-arci)'>{personalData?.last_name || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='text-light'>Fecha de Nacimiento:</h3>
            <p className='text-(--main-arci) text-end'>{fechaFormateada}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Email:</h3>
            <p className='text-(--main-arci)'>{session?.user?.email || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Numero de Contacto:</h3>
            <p className='text-(--main-arci) text-end'>{personalData?.phone || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Pais:</h3>
            <p className='text-(--main-arci)'>{countryName?.name || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Ciudad:</h3>
            <p className='text-(--main-arci)'>{personalData?.city || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Categoria de Profesión:</h3>
            <p className='text-(--main-arci) text-end'>{useHandleCategoryName(studyData?.sub_area)}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Profesión:</h3>
            <p className='text-(--main-arci)'>{studyData?.title || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Institución:</h3>
            <p className='text-(--main-arci)'>{studyData?.institution || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Status:</h3>
            <p className='text-(--main-arci)'>{useHandleStatusName(studyData?.status) || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Respaldo:</h3>
            {studyData?.link ? (
              <a href={studyData.link} target='_blank' rel='noopener noreferrer' className='text-(--main-arci) link'>
                Previsualizar Link
              </a>
            ) : null}
            {studyData?.file ? (
              <a href={studyData.file} target='_blank' rel='noopener noreferrer' className='text-(--main-arci) link'>
                Previsualizar Archivo
              </a>
            ) : null}
            {!studyData?.link && !studyData?.file && <p className='text-(--main-arci)'>No Cargado</p>}
          </div>
        </div>

        <div className='controles justify-center flex gap-2 mt-4'>
          {/* --------------------------------------------------agregar Eliminar Titulo------------------------------- */}
          {studyData?.status === "graduated" ? (
            <div className='flex gap-2'>
              {studyData?.link || studyData?.file ? (
                <ModalForFormsRedBtn title='Eliminar Título'>
                  <ConfirmDeleteMainStudyForm />
                </ModalForFormsRedBtn>
              ) : null}
              <ModalForForm title={studyData?.link || studyData?.file ? "Actualizar Título" : "Agregar Título"}>
                <FileMainStudyForm />
              </ModalForForm>
            </div>
          ) : null}

          <ModalForForm title={personalData?.name == null ? "Agregar Información" : "Modificar"}>
            <ProfesionalProfileHookForm />
          </ModalForForm>
        </div>
        <ModalForForm title='Cambiar Contraseña'>
          <div className='flex flex-col gap-4'>
            <Link href={`/resetPassword/${session?.user.id}`} className='btn bg-[var(--soft-arci)] text-white hover:bg-[var(--main-arci)]'>
              Cambiar Contraseña
            </Link>
          </div>
        </ModalForForm>
      </div>
    </div>
  );
}
