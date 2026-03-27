'use client'
//imports de app
import React from "react";
import Image from "next/image";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { ICountry } from "country-state-city";
import { Country } from "country-state-city";
import { useSession } from "next-auth/react";
//imports propios
import { useProfesionalById } from "@/hooks/usePlatPro";
import { useProfessionalProfileDownload } from "@/hooks/useProfessionalProfileDownload";
import ModalForPreviewTextLink from "@/components/modals/ModalForPreviewTextLink";
import UserDescription from "./UserDescription";
import { useHandleCategoryName } from "@/hooks/useUtils";
import Loader from "@/components/pieces/Loader";

export default function ProfesionalDetailFull(props: any) {
  const { data, error, isLoading } = useProfesionalById(props.userId);
  const { data: session } = useSession();
  
  // Validación defensiva para prevenir errores
  const payload = data?.payload || {};
  const personalData = payload.profesional_data || {};
  const mainStudy = payload.main_study || {};
  const speciality = payload.study_specialization || [];
  const certifications = payload.profesional_certifications || [];
  const experience = payload.experience || [];
  
  const fechaEnDate = personalData.birth_date ? new Date(personalData.birth_date) : new Date();
  const fechaString = fechaEnDate.toLocaleString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit" });
  const countryName: ICountry | undefined = Country.getCountryByCode(personalData?.country);
  //adjust status
  const handleStatusName = (status: string | undefined) => {
    if (status === "inProcess") {
      return "En Proceso";
    } else if (status === "graduated") {
      return "Graduado";
    } else {
      return "No Registrado";
    }
  };
  //adjust fate to year
  const handleDateToYear = (dateIn: any) => {

    if (dateIn == null) {
      return "No terminado";
    }
    const date = new Date(dateIn);
    const endDate = date.getFullYear();
    return endDate;
  };

  const renderHomologationBadge = (isHomologated: any) => {
    if (!Boolean(isHomologated)) {
      return null;
    }

    return <span className='badge badge-success badge-outline'>Homologado UE</span>;
  };
  const {
    isDownloadingProfile,
    isDownloadingPdf,
    downloadError,
    handleDownloadProfile,
    handleDownloadProfilePdf,
  } = useProfessionalProfileDownload({
    payload,
    userId: props.userId,
    countryName: countryName?.name,
    isEnabled: ["victor", "admin", "colab", "manager"].includes(session?.user?.area || ""),
  });

  const canDownloadProfile = ["victor", "admin", "colab", "manager"].includes(session?.user?.area || "");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="md" text="Cargando perfil completo..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-error">Error al cargar el profesional: {error?.message}</p>
      </div>
    );
  }

  if (!data?.payload) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-warning">No se encontraron datos del profesional</p>
      </div>
    );
  }

  return (
    <div className='Total grid gap-2 pt-2 overflow-x-hidden md:grid-cols-3'>
      <div className='flex flex-col justify-center align-middle items-center'>
        <div className='relative w-40 h-40'>
          {personalData.avatar ? (
            <Image
              src={personalData.avatar}
              className='w-full h-full rounded-full object-cover'
              width={500}
              height={500}
              alt='fillImage'
            />
          ) : (
            <Image
              src='/logos/Logo Arcidrade Cond.png'
              className='w-40 h-40 max-w-96 rounded-full justify-center align-middle items-center'
              width={500}
              height={500}
              alt='fillImage'
            />
          )}
        </div>
        <h1 className='text-2xl fontArci text-center'>{`${personalData.name} ${personalData.last_name} `}</h1>
        <p className='text-center'>{mainStudy.title}</p>
        {renderHomologationBadge(mainStudy.isHomologated)}
        {canDownloadProfile ? (
          <>
            <div className='mt-2 flex flex-wrap items-center justify-center gap-2'>
              <button
                className='btn bg-(--main-arci) text-white'
                onClick={handleDownloadProfile}
                disabled={isDownloadingProfile || isDownloadingPdf}
              >
                {isDownloadingProfile ? "Preparando Excel..." : "Descargar Excel"}
              </button>
              <button
                className='btn btn-outline border-(--main-arci) text-(--main-arci)'
                onClick={handleDownloadProfilePdf}
                disabled={isDownloadingProfile || isDownloadingPdf}
              >
                {isDownloadingPdf ? "Preparando PDF..." : "Descargar PDF"}
              </button>
            </div>
            {downloadError ? <p className='mt-2 text-center text-sm text-red-500'>{downloadError}</p> : null}
          </>
        ) : null}
      </div>
      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
        <h1 className='text-2xl fontArci text'>Presentación</h1>
        <p className='text-sm max-h-fit'>{personalData.description}</p>
        <ModalForPreviewTextLink title='Ver Más...'>
          <UserDescription description={personalData.description} />
        </ModalForPreviewTextLink>
      </div>
      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
        <div className='fileSpace grid w-full grid-cols-1 gap-2 rounded-sm bg-gray-50 p-2 shadow-xl sm:grid-cols-3'>
          <div className='flex min-h-20 w-full justify-center items-center border-2 border-dashed border-gray-300 rounded-md p-2'>
            <IoDocumentAttachOutline size={36} />
          </div>
          <div className='sm:col-span-2'>
            {personalData.cv_link ? (
              <div className='flex flex-col'>
                <span>CV Link:</span>
                <a href={personalData.cv_link} target='_blank' rel='noopener noreferrer' className='text-accent link'>
                  Previsualizar
                </a>
              </div>
            ) : null}
            {personalData.cv_file ? (
              <div className='flex flex-col'>
                <span>CV Archivo:</span>
                <a href={personalData.cv_file} target='_blank' rel='noopener noreferrer' className='text-accent link'>
                  Previsualizar
                </a>
              </div>
            ) : null}
            {!personalData.cv_link && !personalData.cv_file ? <span>Aún no existe CV registrada.</span> : null}
          </div>
        </div>
        <div className='dataSpace bg-gray-50 w-full rounded-sm p-2 grid mt-2 shadow-xl'>
          <h2 className='text-bold text-xl text-nowrap dataSpaceTitle pl-4'>Datos Personales</h2>
          <div className='w-full md:text-lg'>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-2'>
              <h3 className='font-light'>Nombre:</h3>
              <p className='min-w-0 wrap-break-word text-(--main-arci) text-end'>{personalData.name}</p>
            </div>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-2'>
              <h3 className='font-light'>Apellido:</h3>
              <p className='min-w-0 wrap-break-word text-(--main-arci) text-end'>{personalData.last_name}</p>
            </div>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-2'>
              <h3 className='text-light'>Fecha de Nacimiento:</h3>
              <p className='min-w-0 wrap-break-word text-(--main-arci) text-end'>{fechaString}</p>
            </div>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-2'>
              <h3 className='font-light'>Email:</h3>
              <p className='min-w-0 wrap-break-word text-(--main-arci) text-end'>{data?.payload.email}</p>
            </div>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-2'>
              <h3 className='font-light'>Numero de Contacto:</h3>
              <p className='min-w-0 wrap-break-word text-(--main-arci) text-end'>{personalData.phone}</p>
            </div>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-2'>
              <h3 className='font-light'>Pais:</h3>
              <p className='min-w-0 wrap-break-word text-(--main-arci) text-end'>{countryName?.name}</p>
            </div>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-2'>
              <h3 className='font-light'>Ciudad:</h3>
              <p className='min-w-0 wrap-break-word text-(--main-arci) text-end'>{personalData.city}</p>
            </div>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-2'>
              <h3 className='font-light'>Categoría de Profesión:</h3>
              <p className='min-w-0 wrap-break-word text-(--main-arci) text-end'>{useHandleCategoryName(mainStudy.sub_area)}</p>
            </div>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-2'>
              <h3 className='font-light'>Profesión:</h3>
              <p className='min-w-0 wrap-break-word text-(--main-arci) text-end'>{mainStudy.title}</p>
            </div>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-2'>
              <h3 className='font-light'>Institución:</h3>
              <p className='min-w-0 wrap-break-word text-(--main-arci) text-end'>{mainStudy.institution}</p>
            </div>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-2'>
              <h3 className='font-light'>Status:</h3>
              <p className='min-w-0 wrap-break-word text-(--main-arci) text-end'>{handleStatusName(mainStudy.status)}</p>
            </div>
            {mainStudy?.link || mainStudy?.file ? (
              <div className='pt-2'>
                <h3 className='font-light'>Respaldo del Título Principal:</h3>
                <div className='mt-1 flex flex-wrap justify-end gap-2'>
                  {mainStudy?.link ? (
                    <a href={mainStudy.link} target='_blank' rel='noopener noreferrer' className='btn btn-sm bg-(--main-arci) text-white'>
                      Ver Link
                    </a>
                  ) : null}
                  {mainStudy?.file ? (
                    <a href={mainStudy.file} target='_blank' rel='noopener noreferrer' className='btn btn-sm bg-(--soft-arci) text-white'>
                      Ver Archivo
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}
            {Boolean(mainStudy.isHomologated) ? (
              <div className='flex justify-end pt-2'>
                {renderHomologationBadge(mainStudy.isHomologated)}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full md:text-lg'>
        <h1 className='text-2xl fontArci text mb-2'>Especialidades</h1>
        <div className='flex flex-col gap-2'>
          {speciality.map((item: any, index: number) => (
            <div key={index} className='bg-white rounded-md p-1 gap-2 flex flex-col'>
              <div className='flex items-start justify-between gap-2'>
                <h3 className='fontArci text-(--main-arci)'>{item.title}</h3>
                {renderHomologationBadge(item.isHomologated)}
              </div>
              <p className='text-sm text-(--soft-arci)'>{item.institution}</p>
              <p className='text-xs'>{handleDateToYear(item.end_date)}</p>
              {item.link ? (
                <div className='flex justify-end'>
                  <a href={item.link} target='_blank' className='btn bg-(--main-arci) text-white justify-end'>
                    Ver Respaldo
                  </a>
                </div>
              ) : null}
              {item.file ? (
                <div className='flex justify-end'>
                  <a href={item.file} target='_blank' className='btn bg-(--main-arci) text-white justify-end'>
                    Ver Respaldo
                  </a>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full md:text-lg'>
        <h1 className='text-2xl fontArci text mb-2'>Certificaciones</h1>
        <div className='flex flex-col gap-2'>
          {certifications.map((item: any, index: number) => (
            <div key={index} className='bg-white rounded-md p-1 gap-2 flex flex-col'>
              <div className='flex items-start justify-between gap-2'>
                <h3 className='fontArci text-(--main-arci)'>{item.title}</h3>
                {renderHomologationBadge(item.isHomologated)}
              </div>
              <p className='text-sm text-(--soft-arci)'>{item.institution}</p>
              <p className='text-xs'>{handleDateToYear(item.end_date)}</p>
              {item.link ? (
                <div className='flex justify-end'>
                  <a href={item.link} target='_blank' className='btn bg-(--main-arci) text-white justify-end'>
                    Ver Respaldo
                  </a>
                </div>
              ) : null}
              {item.file ? (
                <div className='flex justify-end'>
                  <a href={item.file} target='_blank' className='btn bg-(--main-arci) text-white justify-end'>
                    Ver Respaldo
                  </a>
                </div>
              ) : null}
              <div>
                <h3 className='text-(--main-arci)'>Descripción:</h3>
                <p className='line-clamp-3'>{item.description}</p>
                <ModalForPreviewTextLink title='Ver Más...'>
                  <UserDescription description={item.description} />
                </ModalForPreviewTextLink>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full md:text-lg'>
        <h1 className='text-2xl fontArci'>Experiencia</h1>
        <div className='flex flex-col gap-2'>
          {experience?.map((item: any, index: number) => (
            <div key={index} className='bg-white rounded-md p-1 flex flex-col gap-2'>
              <div className='flex justify-between gap-2'>
                <h3 className='fontArci text-(--main-arci)'>{item.title}</h3>
                {item.link ? (
                  <a href={item.link} target='_blank' className='btn bg-(--main-arci) text-white justify-end'>
                    Ver Respaldo
                  </a>
                ) : null}
                {item.file ? (
                  <a href={item.file} target='_blank' className='btn bg-(--main-arci) text-white justify-end'>
                    Ver Respaldo
                  </a>
                ) : null}
              </div>
              <p className='text-sm text-(--soft-arci)'>{item.institution}</p>
              <div>
                <p className='text-xs'>{item.city}</p>
                <p className='text-xs text-(--soft-arci)'>{`${handleDateToYear(item.start_date)} - ${handleDateToYear(item.end_date)}`}</p>
              </div>
              <div>
                <h3 className='text-(--main-arci)'>Descripción:</h3>
                <p className='line-clamp-6'>{item.description}</p>
                <ModalForPreviewTextLink title='Ver Más...'>
                  <UserDescription description={item.description} />
                </ModalForPreviewTextLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
