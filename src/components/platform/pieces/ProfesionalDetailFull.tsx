'use client'
//imports de app
import React from "react";
import Image from "next/image";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { fakerES as faker } from "@faker-js/faker";
import { ICountry } from "country-state-city";
import { Country } from "country-state-city";
//imports propios
import { useProfesionalFull } from "@/hooks/usePlatPro";
import ModalForPreviewTextLink from "@/components/modals/ModalForPreviewTextLink";
import UserDescription from "./UserDescription";

export default function ProfesionalDetailFull() {
  const { data, error, isLoading } = useProfesionalFull();
  
  // Validación defensiva para prevenir errores
  const payload = data?.payload || {};
  const personalData = (payload.profesional_data && Array.isArray(payload.profesional_data)) 
    ? payload.profesional_data[0] || {} 
    : {};
  const mainStudy = (payload.main_study && Array.isArray(payload.main_study)) 
    ? payload.main_study[0] || {} 
    : {};
  const speciality = payload.study_specialization || [];
  const certifications = payload.profesional_certifications || [];
  const experience = payload.experience || [];
  
  const fakeLastName = faker.person.lastName(); // Generar un apellido falso
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
    // console.log(dateIn);
    if (dateIn == null) {
      return "No terminado";
    }
    const date = new Date(dateIn);
    const endDate = date.getFullYear();
    return endDate;
  };
  return (
    <div className='Total grid gap-2 md:grid-cols-3 pt-2 overflow-auto'>
      <div className='flex flex-col justify-center align-middle items-center'>
        <Image
          src='https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp'
          className='w-40 h-40 max-w-96 rounded-full justify-center align-middle items-center'
          width={500}
          height={500}
          objectFit='cover'
          alt='fillImage'
        />
        <h1 className='text-2xl fontArci text-center'>{`${personalData.name} ${personalData.last_name} `}</h1>
        <p className='text-center'>{mainStudy.title}</p>
        <button className='btn bg-[var(--main-arci)] text-white'>Agregar Al Proceso</button>
      </div>
      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
        <h1 className='text-2xl fontArci text'>Presentación</h1>
        <p className='text-sm max-h-fit'>{personalData.description}</p>
        <ModalForPreviewTextLink title='Ver Más...'>
          <UserDescription description={personalData.description} />
        </ModalForPreviewTextLink>
      </div>
      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
        <div className='fileSpace bg-gray-50 w-full rounded-sm p-2 grid grid-cols-3 gap-2 shadow-xl'>
          <div className='flex max-w-xs flex-shrink-0 justify-center items-center border-2 border-dashed border-gray-300 rounded-md p-2'>
            <IoDocumentAttachOutline size={36} />
          </div>
          <div>
            {mainStudy.link ? (
              <div className='flex flex-col'>
                <span>Link:</span>
                <a href={mainStudy.link} target='_blank' className='text-accent link'>
                  Ver aquí
                </a>
              </div>
            ) : null}
            {mainStudy.file ? (
              <div className='flex flex-col'>
                <span>Archivo:</span>
                <a href={mainStudy.file} target='_blank' className='text-accent link'>
                  Ver aquí
                </a>
              </div>
            ) : null}
          </div>
        </div>
        <div className='dataSpace bg-gray-50 w-full rounded-sm p-2 grid mt-2 shadow-xl'>
          <h2 className='text-bold text-xl text-nowrap dataSpaceTitle pl-4'>Datos Personales</h2>
          <div className='w-full'>
            <div className='flex justify-between'>
              <h3 className='font-light'>Nombre</h3>
              <p className='text-(--main-arci)'>{personalData.name}</p>
            </div>
            <div className='flex justify-between'>
              <h3 className='font-light'>Apellido</h3>
              <p className='text-(--main-arci)'>{personalData.last_name}</p>
            </div>
            <div className='flex justify-between'>
              <h3 className='text-light'>Fecha de Nacimiento</h3>
              <p className='text-(--main-arci)'>{fechaString}</p>
            </div>
            <div className='flex justify-between'>
              <h3 className='font-light'>Email</h3>
              <p className='text-(--main-arci)'>{data?.payload.email}</p>
            </div>
            <div className='flex justify-between'>
              <h3 className='font-light'>Numero de Contacto</h3>
              <p className='text-(--main-arci)'>{personalData.phone}</p>
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
              <h3 className='font-light'>Institución</h3>
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
          {speciality.map((item: any, index: number) => (
            <div key={index} className='bg-white rounded-md p-1'>
              <h3 className='fontArci text-[var(--main-arci)]'>{item.title}</h3>
              <p className='text-sm text-[var(--soft-arci)]'>{item.institution}</p>
              <p className='text-xs'>{handleDateToYear(item.end_date)}</p>
              {item.link ? (
                <div className='flex justify-end'>
                  <a href={item.link} target='_blank' className='btn bg-[var(--main-arci)] text-white justify-end'>
                    Ver Respaldo
                  </a>
                </div>
              ) : null}
              {item.file ? (
                <div className='flex justify-end'>
                  <a href={item.file} target='_blank' className='btn bg-[var(--main-arci)] text-white justify-end'>
                    Ver Respaldo
                  </a>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
        <h1 className='text-2xl fontArci text'>Certificaciones</h1>
        {certifications.map((item: any, index: number) => (
          <div key={index} className='bg-white rounded-md p-1'>
            <h3 className='fontArci text-[var(--main-arci)]'>{item.title}</h3>
            <p className='text-sm text-[var(--soft-arci)]'>{item.institution}</p>
            <p className='text-xs'>{handleDateToYear(item.end_date)}</p>
            {item.link ? (
              <div className='flex justify-end'>
                <a href={item.link} target='_blank' className='btn bg-[var(--main-arci)] text-white justify-end'>
                  Ver Respaldo
                </a>
              </div>
            ) : null}
            {item.file ? (
              <div className='flex justify-end'>
                <a href={item.file} target='_blank' className='btn bg-[var(--main-arci)] text-white justify-end'>
                  Ver Respaldo
                </a>
              </div>
            ) : null}
            <div>
              <h3 className='text-[var(--main-arci)]'>Descripción:</h3>
              <p className='line-clamp-3'>{item.description}</p>
              <ModalForPreviewTextLink title='Ver Más...'>
                <UserDescription description={item.description} />
              </ModalForPreviewTextLink>
            </div>
          </div>
        ))}
      </div>

      <div className=' bg-gray-200 p-2 rounded-sm z-10 md:w-full'>
        <h1 className='text-2xl fontArci'>Experiencia</h1>
        <div className='flex flex-col gap-2'>
          {experience?.map((item: any, index: number) => (
            <div key={index} className='bg-white rounded-md p-1'>
              <div className='flex justify-between'>
                <h3 className='fontArci text-[var(--main-arci)]'>{item.title}</h3>
                {item.link ? (
                  <a href={item.link} target='_blank' className='btn bg-[var(--main-arci)] text-white justify-end'>
                    Ver Respaldo
                  </a>
                ) : null}
                {item.file ? (
                  <a href={item.file} target='_blank' className='btn bg-[var(--main-arci)] text-white justify-end'>
                    Ver Respaldo
                  </a>
                ) : null}
              </div>
              <p className='text-sm text-[var(--soft-arci)]'>{item.institution}</p>
              <div>
                <p className='text-xs'>{item.city}</p>
                <p className='text-xs text-[var(--soft-arci)]'>{`${handleDateToYear(item.start_date)} - ${handleDateToYear(item.end_date)}`}</p>
              </div>
              <div>
                <h3 className='text-[var(--main-arci)]'>Descripción:</h3>
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
