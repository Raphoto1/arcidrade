"use client";
//imports de app
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";
import Link from "next/link";
//imports propios
import ModalForForm from "@/components/modals/ModalForForms";
import ColabProfileForm from "@/components/forms/platform/colab/ColabProfileForm";
import { useColab } from "@/hooks/useColab";
import { InlineLoader } from "@/components/pieces/Loader";

export default function ColabData() {
  const { data: session } = useSession();
  const { data, error, isLoading } = useColab();

  //loaders
  if (isLoading) {
    return <div className='p-4 text-center'><InlineLoader /> <span className='ml-2 text-gray-600'>Cargando datos...</span></div>;
  }

  // error handling
  if (error) {
    return <div className='text-red-600'>Error al cargar datos: {error.message}</div>;
  }

  // data validation - permitir payload vacío para usuarios nuevos
  const colabData = data?.payload || {};

  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-lg p-3 md:p-4 md:justify-center md:h-auto'>
      <div className='pb-2 md:pb-3'>
        {!colabData?.name && (
          <div>
            <h1 className='text-lg md:text-2xl font-extrabold capitalize fontArci text-center text-(--main-arci)'>
              Complete sus Datos de Colaborador
            </h1>
          </div>
        )}
        <h1 className='text-xl md:text-2xl fontArci text-center'>Información del Colaborador</h1>
      </div>

      <div className='dataSpace bg-gray-50 w-full rounded-lg p-3 md:p-4 grid mt-2 shadow-xl'>
        <h2 className='text-bold text-lg md:text-xl dataSpaceTitle pl-2 md:pl-4 mb-2'>Datos Personales</h2>
        <div className='w-full space-y-2'>
          <div className='flex flex-col md:flex-row md:justify-between gap-1 md:gap-2'>
            <h3 className='font-medium md:font-light text-sm md:text-base'>Nombre:</h3>
            <p className='text-(--main-arci) text-sm md:text-base wrap-break-word'>{colabData?.name || "No Registra Información"}</p>
          </div>
          <div className='flex flex-col md:flex-row md:justify-between gap-1 md:gap-2'>
            <h3 className='font-medium md:font-light text-sm md:text-base'>Apellido:</h3>
            <p className='text-(--main-arci) text-sm md:text-base wrap-break-word'>{colabData?.last_name || "No Registra Información"}</p>
          </div>
          <div className='flex flex-col md:flex-row md:justify-between gap-1 md:gap-2'>
            <h3 className='font-medium md:font-light text-sm md:text-base'>Email:</h3>
            <p className='text-(--main-arci) text-sm md:text-base wrap-break-word'>{session?.user?.email || "No Registra Información"}</p>
          </div>
          <div className='flex flex-col md:flex-row md:justify-between gap-1 md:gap-2'>
            <h3 className='font-medium md:font-light text-sm md:text-base'>Rol/Cargo:</h3>
            <p className='text-(--main-arci) text-sm md:text-base wrap-break-word'>{colabData?.role || "No Registra Información"}</p>
          </div>
          <div className='flex flex-col md:flex-row md:justify-between gap-1 md:gap-2'>
            <h3 className='font-medium md:font-light text-sm md:text-base'>País:</h3>
            <p className='text-(--main-arci) text-sm md:text-base wrap-break-word'>{colabData?.country || "No Registra Información"}</p>
          </div>
          <div className='flex flex-col md:flex-row md:justify-between gap-1 md:gap-2'>
            <h3 className='font-medium md:font-light text-sm md:text-base'>Estado/Provincia:</h3>
            <p className='text-(--main-arci) text-sm md:text-base wrap-break-word'>{colabData?.state || "No Registra Información"}</p>
          </div>
          <div className='flex flex-col md:flex-row md:justify-between gap-1 md:gap-2'>
            <h3 className='font-medium md:font-light text-sm md:text-base'>Ciudad:</h3>
            <p className='text-(--main-arci) text-sm md:text-base wrap-break-word'>{colabData?.city || "No Registra Información"}</p>
          </div>
          <div className='flex flex-col md:flex-row md:justify-between gap-1 md:gap-2'>
            <h3 className='font-medium md:font-light text-sm md:text-base'>Estado:</h3>
            <p className='text-(--main-arci) text-sm md:text-base wrap-break-word'>{colabData?.status || "No Registra Información"}</p>
          </div>
          <div className='flex flex-col md:flex-row md:justify-between gap-1 md:gap-2'>
            <h3 className='font-medium md:font-light text-sm md:text-base'>Descripción:</h3>
            <p className='text-(--main-arci) text-sm md:text-base wrap-break-word'>{colabData?.description || "No Registra Información"}</p>
          </div>
          {colabData?.link && (
            <div className='flex flex-col md:flex-row md:justify-between gap-1 md:gap-2'>
              <h3 className='font-medium md:font-light text-sm md:text-base'>Link:</h3>
              <a href={colabData.link} target='_blank' rel='noopener noreferrer' className='text-(--main-arci) link text-sm md:text-base break-all'>
                Ver enlace
              </a>
            </div>
          )}
          {colabData?.file && (
            <div className='flex flex-col md:flex-row md:justify-between gap-1 md:gap-2'>
              <h3 className='font-medium md:font-light text-sm md:text-base'>Archivo:</h3>
              <a href={colabData.file} target='_blank' rel='noopener noreferrer' className='text-(--main-arci) link text-sm md:text-base break-all'>
                Ver archivo
              </a>
            </div>
          )}
        </div>

        <div className='controles justify-center flex flex-col md:flex-row gap-2 md:gap-3 mt-4'>
          <ModalForForm title={colabData?.name == null ? "Agregar Información" : "Modificar"}>
            <ColabProfileForm />
          </ModalForForm>
        
          <ModalForForm title='Cambiar Contraseña'>
            <div className='flex flex-col gap-4'>
              <Link href={`/resetPassword/${session?.user.id}`} className='btn bg-(--soft-arci) text-white hover:bg-(--main-arci) w-full md:w-auto'>
                Cambiar Contraseña
              </Link>
            </div>
          </ModalForForm>
        </div>
      </div>
    </div>
  );
}
