import React from "react";
import Image from "next/image";
import { useProfesional, useProfesionalFull } from "@/hooks/usePlatPro";
import { fakerES as faker } from "@faker-js/faker";
import { ICountry } from "country-state-city";
import { Country } from "country-state-city";

export default function ProfesionalDetail() {
  const { data, error, isLoading } = useProfesionalFull();
  // console.log("full data", data?.payload.experience);
  const personalData = data?.payload.profesional_data[0] || {};
  const mainStudy = data?.payload.main_study[0] || {};
  const speciality = data?.payload.study_specialization || [];
  const certifications = data?.payload.profesional_certifications || [];
  const experience = data?.payload.experience || [];

  const fakeLastName = faker.person.lastName(); // Generar un apellido falso
  const fechaEnDate = new Date(personalData.birth_date);
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
    // console.log(dateIn);
    if (dateIn == null) {
      return "No terminado";
    }
    const date = new Date(dateIn);
    const endDate = date.getFullYear();
    return endDate;
  };
  return (
    <div className='Total grid gap-2 md:grid-cols-2 pt-2 overflow-auto'>
      <div className='Izqui grid gap-2 md:grid-cols-2 w-full'>
        <div className='flex flex-col justify-center align-middle items-center'>
          <div className='relative w-40 h-40'>
            {personalData.avatar ? (
              <Image src={personalData.avatar} className='w-full h-full rounded-full object-cover' width={500} height={500} alt='fillImage' />
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
          <h1 className='text-2xl fontArci text-center'>{personalData.fake_name || "Nombre"}</h1>
          <p className='text-center'>{mainStudy.title || "Estudio Principal"}</p>
          <button className='btn bg-[var(--main-arci)] text-white'>Agregar Al Proceso</button>
        </div>
        <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
          <h1 className='text-2xl fontArci text'>Presentación</h1>
          <p className='text-sm line-clamp-2'>{personalData.description || "Descripción breve de la persona"}</p>
          <div className='dataSpace bg-gray-50 w-full rounded-sm p-2 grid mt-2 shadow-xl'>
            <h2 className='text-bold text-xl text-nowrap dataSpaceTitle pl-4'>Datos Personales</h2>
            <div className='w-full'>
              <div className='flex justify-between'>
                <h3 className='font-light'>Nombre</h3>
                <p className='text-(--main-arci)'>{personalData.fake_name || "Nombre"}</p>
              </div>
              <div className='flex justify-between'>
                <h3 className='font-light'>Apellido</h3>
                <p className='text-(--main-arci)'>{fakeLastName || "Apellido"}</p>
              </div>
              <div className='flex justify-between'>
                <h3 className='text-light'>Fecha de Nacimiento</h3>
                <p className='text-(--main-arci)'>{fechaString || "fecha"}</p>
              </div>
              <div className='flex justify-between'>
                <h3 className='font-light'>Pais</h3>
                <p className='text-(--main-arci)'>{countryName?.name}</p>
              </div>
              <div className='flex justify-between'>
                <h3 className='font-light'>Ciudad</h3>
                <p className='text-(--main-arci)'>{personalData.city}</p>
              </div>
              <div className='flex justify-between'>
                <h3 className='font-light'>Profesión</h3>
                <p className='text-(--main-arci)'>{mainStudy.title}</p>
              </div>
              <div className='flex justify-between'>
                <h3 className='font-light'>Institución:</h3>
                <p className='text-(--main-arci)'>{mainStudy.institution}</p>
              </div>
              <div className='flex justify-between'>
                <h3 className='font-light'>Status</h3>
                <p className='text-(--main-arci)'>{handleStatusName(mainStudy.status)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
          <h1 className='text-2xl fontArci text mb-2'>Especialidades</h1>
          <div className='flex flex-col gap-2'>
            {speciality?.map((item: any, index: number) => (
              <div key={index} className='bg-white rounded-md p-1'>
                <h3 className='fontArci text-[var(--main-arci)]'>{item.title}</h3>
                <p className='text-sm text-[var(--soft-arci)]'>{item.institution}</p>
                <p className='text-xs'>{handleDateToYear(item.end_date)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
          <h1 className='text-2xl fontArci text mb-2'>Certificaciones</h1>
          <div className='flex flex-col gap-2'>
            {certifications?.map((item: any, index: number) => (
              <div key={index} className='bg-white rounded-md p-1'>
                <h3 className='fontArci text-[var(--main-arci)]'>{item.title}</h3>
                <p className='text-sm text-[var(--soft-arci)]'>{item.institution}</p>
                <p className='text-xs'>{handleDateToYear(item.endDate)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='Der flex w-full bg-gray-200 rounded-sm z-10'>
        <div className=' p-2 rounded-sm z-10 md:w-full'>
          <h1 className='text-2xl fontArci mb-2'>Experiencia</h1>
          <div className='flex flex-col gap-2'>
            {experience?.map((item: any, index: number) => (
              <div key={index} className='bg-white rounded-md p-1'>
                <h3 className='fontArci text-[var(--main-arci)]'>{item.title}</h3>
                <p className='text-sm text-[var(--soft-arci)]'>{item.institution}</p>
                <div>
                  <p className='text-xs'>{item.city}</p>
                  <p className='text-xs text-[var(--soft-arci)]'>{`${handleDateToYear(item.start_date)} - ${handleDateToYear(item.end_date)}`}</p>
                </div>
                <div>
                  <h3 className='text-[var(--main-arci)]'>Descripción:</h3>
                  <p className="line-clamp-6">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
