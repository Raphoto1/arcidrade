import React, { useEffect } from "react";
import { Country } from "country-state-city";
import { ICountry } from "country-state-city";

import ModalForForm from "../../modals/ModalForForms";
import InstitutionProfileForm from "@/components/forms/platform/institution/InstitutionProfileForm";
import { useInstitution } from "@/hooks/usePlatInst";
import { useSession } from "next-auth/react";
import { medicalOptions } from "@/static/data/staticData";
export default function InstitutionData() {
  const { data, isLoading, error, mutate } = useInstitution();
  const { data: session } = useSession();
  // console.log("data en InstitutionData", data);

  const countryName: ICountry | undefined = data?.payload && data.payload[0] ? Country.getCountryByCode(data.payload[0].country) : undefined;
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:h-auto'>
      <div className='pb-2'>
        {!data?.payload[0] ? (
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
            <p className='text-(--main-arci)'>{data?.payload[0]?.name || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='text-light'>Fecha de Fundación</h3>
            <p className='text-(--main-arci)'>{data?.payload[0]?.foundation_date || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Email</h3>
            <p className='text-(--main-arci)'>{session?.user?.email || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Numero de Contacto</h3>
            <p className='text-(--main-arci)'>{data?.payload[0]?.phone || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Web</h3>
            <p className='text-(--main-arci)'>{data?.payload[0]?.web || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Pais</h3>
            <p className='text-(--main-arci)'>{countryName?.name || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Ciudad</h3>
            <p className='text-(--main-arci)'>{data?.payload[0]?.city || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Especialización Principal</h3>
            <p className='text-(--main-arci)'>{data?.payload[0]?.main_specialization || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>NIF</h3>
            <p className='text-(--main-arci)'>{data?.payload[0]?.nif || "No Registra Información"}</p>
          </div>
        </div>
        <div className='controles justify-end flex gap-2 mt-4'>
          <button className='btn bg-[var(--soft-arci)] h-7'>Cambiar contraseña</button>
          <ModalForForm title={data?.payload[0]?.name == null ? "Agregar Información" : "Modificar"}>
            <InstitutionProfileForm />
          </ModalForForm>
        </div>
      </div>
    </div>
  );
}
