//imports de app
import React from "react";
import Image from "next/image";
// imports propios
import ModalForPreview from "@/components/modals/ModalForPreview";
import ProfesionalDetail from "./ProfesionalDetail";
import ProfesionalDetailFull from "./ProfesionalDetailFull";
import { useProfesional } from "@/hooks/usePlatPro";
import ModalForFormsSoftBlue from "@/components/modals/ModalForFormsSoftBlue";
import UserDescriptionForm from "@/components/forms/platform/profesional/UserDescriptionForm";
import ModalForFormsPlusButton from "@/components/modals/ModalForFormsPlusButton";
import AvatarForm from "@/components/forms/platform/profesional/AvatarForm";
import ModalForPreviewTextLink from "@/components/modals/ModalForPreviewTextLink";
import UserDescription from "./UserDescription";

export default function HeroHeader() {
  const { data, error, isLoading } = useProfesional();
  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error en Base de datos... intente recargar la pagina</div>;
  console.log("data de hero", data);
  //full name
  let fullName = "";
  if (data?.payload[0].name == null) {
    fullName = "No se ha completado el registro de datos personales";
  } else {
    fullName = `${data?.payload[0].name} ${data?.payload[0].last_name}`;
  }
  //AJUSTAR IMAGEN DE FONDO Y ALINEADO EN MD
  return (
    <div className='relative w-full md:h-[340px] overflow-hidden'>
      {/* Imagen de fondo con opacidad */}
      <div
        className='absolute inset-0 bg-cover bg-center opacity-10'
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/7579823/pexels-photo-7579823.jpeg')",
        }}
      />
      {/* Degradado inferior hacia transparente */}
      <div className='absolute bottom-0 left-0 right-0 h-[160px] bg-gradient-to-t from-white via-transparent to-transparent' />
      {/* Contenido principal */}
      <div className='HeroArea w-full flex justify-center items-center align-middle p-2 md:pr-5 relative z-10'>
        <div className='vacio none md:visible md:w-1/3 z-10'></div>
        <div className='avatar flex flex-col justify-center align-middle items-center p-2 z-10 md:w-1/3'>
          <div className='relative w-40 h-40'>
            {data?.payload[0].avatar ? (
              <Image src={data?.payload[0].avatar} className='w-full h-full rounded-full object-cover' width={500} height={500} alt='fillImage' />
            ) : (
              <Image src='/logos/Logo Arcidrade Cond.png' className='w-full h-full rounded-full object-cover' width={500} height={500} alt='fillImage' />
            )}
            {data?.payload[0].name != null ? (
              <div className='absolute bottom-2 right-2 z-10'>
                <ModalForFormsPlusButton title='Actualizar Imagen'>
                  <AvatarForm />
                </ModalForFormsPlusButton>
              </div>
            ) : null}
          </div>
          <h2 className='text-xl font-bold font-var(--font-oswald) text-center p-2 capitalize'>{fullName}</h2>
        </div>
        <div className='description bg-gray-200 p-4 rounded-sm z-10 md:w-1/3'>
          <h3 className='text-xl font-bold font-var(--font-oswald)'>Presentación</h3>
          <div className='max-h-fit'>
            <p className='text-sm max-height-10 line-clamp-5'>{data?.payload[0].description || "Agrega una descripción para que todos te conozcan"}</p>
          </div>
          <div className='flex gap-2 justify-end mt-5'>
            {data?.payload[0].name != null ? (
              <ModalForPreviewTextLink title='Ver Más...'>
                <UserDescription description={data?.payload[0].description} />
              </ModalForPreviewTextLink>
            ) : null}
            {data?.payload[0].name != null ? (
              <ModalForFormsSoftBlue title='Actualizar'>
                <UserDescriptionForm />
              </ModalForFormsSoftBlue>
            ) : null}
          </div>
        </div>
      </div>
      {/* Opciones */}
      <div className='options grid justify-center relative z-10 md:pr-5'>
        <h3 className='text-xl text-center capitalize'>{data?.payload[1].title || "Título Principal"}</h3>
        <div className='flex justify-center'>
          {/* <button className='btn bg-[var(--main-arci)] text-white'>Buscando Ofertas</button>
          <button className='btn bg-[var(--main-arci)] text-white'>Disponible Para trabajar</button> */}
          <div className='flex justify-center'>
            <ModalForPreview title={"Preview"}>
              <ProfesionalDetail />
            </ModalForPreview>
            <ModalForPreview title={"Preview Full"}>
              <ProfesionalDetailFull />
            </ModalForPreview>
          </div>
        </div>
      </div>
    </div>
  );
}
