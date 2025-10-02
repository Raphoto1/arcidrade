import React from "react";
import Image from "next/image";

import ModalForPreview from "@/components/modals/ModalForPreview";
import InstitutionDetail from "./institutionDetail";
import InstitutionDetailFull from "./InstitutionDetailFull";
import { useInstitution } from "@/hooks/usePlatInst";
import ModalForFormsPlusButton from "@/components/modals/ModalForFormsPlusButton";
import ModalForPreviewTextLink from "@/components/modals/ModalForPreviewTextLink";
import ModalForFormsSoftBlue from "@/components/modals/ModalForFormsSoftBlue";
import AvatarInstitutionForm from "@/components/forms/platform/institution/AvatarInstitutionForm";
import UserDescription from "@/components/platform/pieces/UserDescription";
import InstitutionDescriptionForm from "@/components/forms/platform/institution/InstitutionDescriptionForm";

export default function HeroHeaderInstitution() {
  const { data, isLoading, error, mutate } = useInstitution();
  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error en Base de datos... intente recargar la pagina</div>;

  return (
    <div className='relative w-full md:h-[320px] overflow-hidden'>
      {/* Imagen de fondo con opacidad */}
      <div
        className='absolute inset-0 bg-cover bg-center opacity-10'
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/5049242/pexels-photo-5049242.jpeg')",
        }}
      />

      {/* Degradado inferior hacia transparente */}
      <div className='absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-t from-white via-transparent to-transparent' />

      {/* Contenido principal */}
      <div className='HeroArea w-full flex justify-center items-center align-middle p-2 relative z-10'>
        <div className='vacio none md:visible md:w-1/3 z-10'></div>
        <div className='avata grid justify-center align-middle items-center p-2 z-10 md:w-1/3'>
          <div className='flex justify-center align-middle items-center'>
            <div className='relative w-40 h-40'>
              {data?.payload.avatar ? (
                <Image src={data?.payload.avatar} className='w-full h-full rounded-full object-cover' width={500} height={500} alt='fillImage' />
              ) : (
                <Image src='/logos/Logo Arcidrade Cond.png' className='w-full h-full rounded-full object-cover' width={500} height={500} alt='fillImage' />
              )}
              {data?.payload.name != null ? (
                <div className='absolute bottom-2 right-2 z-10'>
                  <ModalForFormsPlusButton title='Actualizar Imagen'>
                    <AvatarInstitutionForm />
                  </ModalForFormsPlusButton>
                </div>
              ) : null}
            </div>
          </div>
          <h2 className='text-xl font-bold font-var(--font-oswald) text-center p-2'>{data?.payload.name}</h2>
        </div>
        <div className='description bg-gray-200 p-4 rounded-sm z-10 md:w-1/3 mr-2'>
          <h3 className='text-xl font-bold font-var(--font-oswald)'>Presentación</h3>
          <p className='text-sm max-height-10'>{data?.payload.description || "Agrega una descripción para que todos te conozcan"}</p>
          <div className='flex gap-2 justify-end mt-5'>
            {data?.payload.description != null ? (
              <ModalForPreviewTextLink title='Ver Más...'>
                <UserDescription description={data?.payload.description} />
              </ModalForPreviewTextLink>
            ) : null}
            {data?.payload.name != null ? (
              <ModalForFormsSoftBlue title='Actualizar'>
                <InstitutionDescriptionForm />
              </ModalForFormsSoftBlue>
            ) : null}
          </div>
        </div>
      </div>

      {/* Opciones */}
      <div className='options flex flex-col justify-center relative z-10'>
        <h3 className='text-xl text-center'>{data?.payload.main_speciality || "Especialización Principal"}</h3>
        <div className='flex justify-center gap-4 mt-2'>
          <ModalForPreview title={"Preview"}>
            <InstitutionDetail />
          </ModalForPreview>
          <ModalForPreview title={"Preview Full"}>
            <InstitutionDetailFull />
          </ModalForPreview>
        </div>
      </div>
    </div>
  );
}
