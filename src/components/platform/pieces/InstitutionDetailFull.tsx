'use client'
import React from "react";
import Image from "next/image";

import { IoDocumentAttachOutline } from "react-icons/io5";
import ModalForForm from "../../modals/ModalForForms";
import FileCvForm from "@/components/forms/platform/profesional/FileCvForm";
import { useInstitutionFull } from "@/hooks/usePlatInst";
import { ICountry } from "country-state-city/lib/interface";
import { Country } from "country-state-city";
import ModalForPreviewTextLink from "@/components/modals/ModalForPreviewTextLink";
import UserDescription from "./UserDescription";
import { InlineLoader } from "@/components/pieces/Loader";

export default function InstitutionDetailFull() {
  const { data, error, isLoading, mutate } = useInstitutionFull();
  if (isLoading) return <div className='p-4 text-center'><InlineLoader /> <span className='ml-2'>Cargando...</span></div>;
  if (error) return <div>Error en Base de datos... intente recargar la pagina</div>;

  const InstitutionData = data?.payload.institution_data || {};
  const goals = data?.payload.goals || [];
  const speciality = data?.payload.institution_specialization || [];
  const certifications = data?.payload.institution_certifications || [];
  const processes = data?.payload.process || [];
  //formateo dee fecha
  const foundationDate = new Date(InstitutionData.established);
  const formattedDate = foundationDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
 //adjust fate to year
  const handleDateToYear = (dateIn: any) => {

    if (dateIn == null) {
      return "No registrado";
    }
    const date = new Date(dateIn);
    const endDate = date.getFullYear();
    return endDate;
  };
  //formateo de pais
  const countryName: ICountry | undefined = Country?.getCountryByCode(InstitutionData.country);
  return (
    <div className='Total grid gap-2 md:grid-cols-3 pt-2 overflow-auto'>
      <div className='flex flex-col justify-center align-middle items-center'>
        <div className='relative w-40 h-40'>
          {InstitutionData?.avatar ? (
            <Image src={InstitutionData?.avatar} className='w-full h-full rounded-full object-cover' width={500} height={500} alt='fillImage' />
          ) : (
            <Image src='/logos/Logo Arcidrade Cond.png' className='w-full h-full rounded-full object-cover' width={500} height={500} alt='fillImage' />
          )}
        </div>
        <h1 className='text-2xl fontArci text-center'>{InstitutionData.name || "Nombre Bastante Largo de Hospital"}</h1>
        <p className='text-center'>{InstitutionData.main_speciality || "Medico Profesional Full"}</p>
        <button className='btn bg-(--main-arci) text-white'>Agregar Al Proceso</button>
      </div>
      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
        <h1 className='text-2xl fontArci text'>Presentación</h1>
        <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
          <p className='text-sm max-h-fit line-clamp-5'>{InstitutionData.description}</p>
          <ModalForPreviewTextLink title='Ver Más...'>
            <UserDescription description={InstitutionData.description} />
          </ModalForPreviewTextLink>
        </div>
        <div className='dataSpace bg-gray-50 w-full rounded-sm p-2 grid mt-2 shadow-xl'>
          <h2 className='text-bold text-xl text-nowrap dataSpaceTitle pl-4'>Datos Institucionales</h2>
          <div className='w-full'>
            <div className='flex justify-between'>
              <h3 className='font-light'>Nombre:</h3>
              <p className='text-(--main-arci) text-end'>{InstitutionData.name || "Nombre de la institución"}</p>
            </div>
            <div className='flex justify-between'>
              <h3 className='text-light'>Fecha de Fundación</h3>
              <p className='text-(--main-arci)'>{formattedDate || "fecha"}</p>
            </div>
            <div className='flex justify-between'>
              <h3 className='font-light'>Email</h3>
              <p className='text-(--main-arci)'>{data?.payload.email || "Email no registrado"}</p>
            </div>
            <div className='flex justify-between'>
              <h3 className='font-light'>Numero de Contacto</h3>
              <p className='text-(--main-arci)'>{InstitutionData.phone || "Número de contacto no registrado"}</p>
            </div>
            <div className='flex justify-between'>
              <h3 className='font-light'>Pais</h3>
              <p className='text-(--main-arci)'>{countryName?.name || "País no registrado"}</p>
            </div>
            <div className='flex justify-between'>
              <h3 className='font-light'>Ciudad</h3>
              <p className='text-(--main-arci)'>{InstitutionData.city || "Ciudad no registrada"}</p>
            </div>
            <div className='flex justify-between'>
              <h3 className='font-light'>Especialidad Principal</h3>
              <p className='text-(--main-arci)'>{InstitutionData.main_speciality || "No registrada"}</p>
            </div>
          </div>
        </div>
      </div>
      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
        <h1 className='text-2xl fontArci text'>Logros</h1>
        {goals.length === 0 ? (
          <div className='bg-white rounded-md p-1 mt-2'>
            <p className='fontArci text-(--main-arci)'>No hay logros registrados</p>
          </div>
        ) : (
          goals.map((goal: any) => (
            <div key={goal.id} className='bg-white rounded-md p-1 mt-2'>
              <div className="flex justify-between">
                <div className="gap-2">
                  <h3 className='fontArci text-(--main-arci) font-bold'>{goal.title}</h3>
                  <p className='text-xs'>{handleDateToYear(goal.year)}</p>
                </div>
                <div className='flex justify-end'>
                  {goal.link || goal.file ? <a href={goal.link || goal.file} target="_blank" className='btn bg-(--main-arci) text-white justify-end'>Ver Respaldo</a> : null}
                </div>
              </div>
              <div>
                <h3 className='text-(--main-arci)'>Descripción:</h3>
                <p className='text-sm'>{goal.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
        <h1 className='text-2xl fontArci text'>Especialidades</h1>
        <div className='bg-white rounded-md p-1 mt-2'>
          {speciality.length === 0 ? (
            <p className='fontArci text-(--main-arci)'>No hay especialidades registradas</p>
          ) : (
            speciality.map((spec: any) => (
              <div key={spec.id} className='mb-2'>
                <h3 className='fontArci text-(--main-arci) font-bold'>{spec.title}</h3>
                <p className='text-sm'>{spec.title_category || "Categoría general no registrada"}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
         <h1 className='text-2xl fontArci text'>Certifiaciones</h1>
       {certifications.length === 0 ? (
          <div className='bg-white rounded-md p-1 mt-2'>
            <p className='fontArci text-(--main-arci)'>No hay certificaciones registradas</p>
          </div>
        ) : (
          <div className='bg-white rounded-md p-1 mt-2'>
            <h1 className='text-2xl fontArci'>Certificaciones</h1>
            {certifications.map((cert: any) => (
              <div key={cert.id} className='mb-2 flex justify-between'>
                <div>
                  <h3 className='fontArci text-(--main-arci) font-bold'>{cert.title}</h3>
                  <p className='text-sm'>Emitido por: {cert.institution || "Entidad no registrada"}</p>
                  <p className='text-sm'>Año de obtención: {handleDateToYear(cert.year)}</p>
                </div>
                <div>
                  {cert.link || cert.file ? <a href={cert.link || cert.file} target="_blank" className='btn bg-(--main-arci) text-white justify-end'>Ver Respaldo</a> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className='Der flex w-full bg-gray-200 rounded-sm z-10'>
        <div className=' p-2 rounded-sm z-10 w-full'>
          <h1 className='text-2xl fontArci'>Procesos Disponibles</h1>
                    <div className='bg-white rounded-md p-1 justify-center text-center mt-2 w-full'>
               {processes.length > 0 ? (
              processes.map((proc: any) => (
                <div key={proc.id} className='mb-2'>
                  <h4 className='text-lg font-bold'>{proc.position}</h4>
                </div>
              ))
            ) : (
              <div className='flex items-center justify-center h-20'>
                <p>No hay procesos disponibles.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
