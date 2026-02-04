import React from "react";
import Image from "next/image";
import { useInstitutionById, useInstitutionFull, useInstitutionFullById } from "@/hooks/usePlatInst";
import { Country, ICountry } from "country-state-city";
import { InlineLoader } from "@/components/pieces/Loader";

export default function InstitutionDetailById(props: any) {
  const { data, error, isLoading, mutate } = useInstitutionFullById(props.userId);
  if (isLoading) return <div className='p-4 text-center'><InlineLoader /> <span className='ml-2'>Cargando...</span></div>;
  if (error) return <div>Error en Base de datos... intente recargar la pagina</div>;
  // console.log("data full", data);
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

  //formateo de pais
  const countryName: ICountry | undefined = Country?.getCountryByCode(InstitutionData.country);
  return (
    <div className='Total grid gap-2 md:grid-cols-3 pt-2 overflow-auto md:text-lg'>
      <div className='flex flex-col justify-center align-middle items-center'>
        <div className='relative w-40 h-40'>
          <Image src='/logos/Logo Arcidrade Cond.png' className='w-full h-full rounded-full object-cover' width={500} height={500} alt='fillImage' />
        </div>
        <h1 className='text-2xl fontArci text-center'>{InstitutionData.fake_name || "Nombre de la institución"}</h1>
        <p className='text-center capitalize'>{InstitutionData.main_speciality || "Especialización"}</p>
      </div>
      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
        <h1 className='text-2xl fontArci text'>Presentación</h1>
        <p className='text-sm line-clamp-2'>{InstitutionData.description || "Descripción de la institución"}</p>
        <div className='dataSpace bg-gray-50 w-full rounded-sm p-2 grid mt-2 shadow-xl'>
          <h2 className='text-bold text-xl text-nowrap dataSpaceTitle pl-4'>Datos Institucionales</h2>
          <div className='w-full'>
            <div className='flex justify-between'>
              <h3 className='font-light'>Nombre</h3>
              <p className='text-(--main-arci) text-end'>{InstitutionData.fake_name || "Nombre de la institución"}</p>
            </div>
            <div className='flex justify-between'>
              <h3 className='text-light'>Fecha de Fundación</h3>
              <p className='text-(--main-arci) text-end'>{formattedDate || "fecha"}</p>
            </div>
            <div className='flex justify-between'>
              <h3 className='font-light'>Pais</h3>
              <p className='text-(--main-arci) text-end'>{countryName?.name || "País"}</p>
            </div>
            <div className='flex justify-between'>
              <h3 className='font-light'>Ciudad</h3>
              <p className='text-(--main-arci) text-end'>{InstitutionData.city || "Ciudad"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
        <h1 className='text-2xl fontArci text'>Logros</h1>
        <div className='bg-white rounded-md p-1 mt-2'>
          {goals.length === 0 ? (
            <p className='fontArci text-(--main-arci)'>No hay logros registrados</p>
          ) : (
            goals.map((goal: any) => (
              <div key={goal.id} className='mb-2'>
                <h3 className='fontArci text-(--main-arci) font-bold'>{goal.title}</h3>
              </div>
            ))
          )}
        </div>
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

      <div className='Der flex w-full bg-gray-200 rounded-sm z-10'>
        <div className=' p-2 rounded-sm z-10 w-full'>
          <h1 className='text-2xl fontArci'>Certificaciones</h1>
          <div className='bg-white rounded-md p-1 mt-2'>
            {certifications.length === 0 ? (
              <p className='fontArci text-(--main-arci)'>No hay certificaciones registradas</p>
            ) : (
              certifications.map((cert: any) => (
                <div key={cert.id} className='mb-2'>
                  <h3 className='fontArci text-(--main-arci) font-bold'>{cert.title}</h3>
                  <p className='text-sm'>Emitido por: {cert.institution || "Entidad no registrada"}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className='Der flex w-full bg-gray-200 rounded-sm z-10'>
        <div className=' p-2 rounded-sm z-10 w-full'>
          <h1 className='text-2xl fontArci'>Procesos Disponibles</h1>
          <div className='bg-white rounded-md p-1 justify-center text-center mt-2'>
            {processes.length > 0 ? (
              <div className='flex items-center justify-center h-20 fontArci text-(--main-arci) font-bold text-2xl'>
                <p>{ processes.length}</p>
              </div>
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
