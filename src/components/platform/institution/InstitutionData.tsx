import React, { useEffect } from "react";
import { Country } from "country-state-city";
import { ICountry } from "country-state-city";
import Link from "next/link";

import ModalForForm from "../../modals/ModalForForms";
import InstitutionProfileForm from "@/components/forms/platform/institution/InstitutionProfileForm";
import { useInstitution } from "@/hooks/usePlatInst";
import { useSession } from "next-auth/react";
import { medicalOptions } from "@/static/data/staticData";
export default function InstitutionData() {
  const { data, isLoading, error, mutate } = useInstitution();
  const { data: session } = useSession();

  if (isLoading) return <div>Cargando...</div>;

  const countryName: ICountry | undefined = data?.payload && data.payload.country ? Country.getCountryByCode(data.payload.country) : undefined;
  const fecha = new Date(data?.payload.established);
  const fechaFormateada = fecha.toLocaleString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit" });
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:h-auto'>
      <div className='pb-2'>
        {!data?.payload.name ? (
          <div>
            <h1 className='text-2xl font-extrabold capitalize fontArci text-center text-(--main-arci)'>
              Inicie AQUÍ Completando sus Datos Para que pueda ser encontrado en la plataforma
            </h1>
          </div>
        ) : null}
        <h1 className='text-2xl fontArci text-center'>Información General</h1>
      </div>
      <div className='dataSpace bg-gray-50 w-full rounded-sm p-2 grid mt-2 shadow-xl'>
        <h2 className='text-bold text-xl text-nowrap dataSpaceTitle pl-4'>Datos Empresariales</h2>
        <div className='w-full'>
          <div className='flex justify-between'>
            <h3 className='font-light'>Nombre</h3>
            <p className='text-(--main-arci)'>{data?.payload.name || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='text-light'>Fecha de Fundación</h3>
            <p className='text-(--main-arci)'>{fechaFormateada || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Email</h3>
            <p className='text-(--main-arci)'>{session?.user.email || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Numero de Contacto</h3>
            <p className='text-(--main-arci)'>{data?.payload.phone || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Web</h3>
            <p className='text-(--main-arci)'>{data?.payload.website || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Pais</h3>
            <p className='text-(--main-arci)'>{countryName?.name || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Ciudad</h3>
            <p className='text-(--main-arci)'>{data?.payload.city || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Especialización Principal</h3>
            <p className='text-(--main-arci) text-end'>{data?.payload.main_speciality || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>NIF</h3>
            <p className='text-(--main-arci)'>{data?.payload.company_id || "No Registra Información"}</p>
          </div>
        </div>
        <div className='controles justify-end flex gap-2 mt-4'>
          <ModalForForm title='Cambiar Contraseña'>
            <div className='flex flex-col gap-4'>
              <Link href={`/resetPassword/${session?.user.id}`} className='btn bg-[var(--main-arci)] text-white hover:bg-[var(--soft-arci)]'>
                Cambiar Contraseña
              </Link>
            </div>
          </ModalForForm>
          <ModalForForm title={data?.payload.name == null ? "Agregar Información" : "Modificar"}>
            <InstitutionProfileForm />
          </ModalForForm>
        </div>
      </div>
    </div>
  );
}
