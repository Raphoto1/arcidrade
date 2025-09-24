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

  //AJUSTAR IMAGEN DE FONDO Y ALINEADO EN MD
  return (
    <div className='relative w-full md:h-[320px] overflow-hidden'>
      {/* Imagen de fondo con opacidad */}
      <div
        className='absolute inset-0 bg-cover bg-center opacity-10'
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/7579823/pexels-photo-7579823.jpeg')",
        }}
      />
      {/* Degradado inferior hacia transparente */}
      <div className='absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-t from-white via-transparent to-transparent' />
      {/* Contenido principal */}
      <div className='HeroArea w-full flex justify-center items-center align-middle p-2 md:pr-20 relative z-10'>
        <div className='vacio none md:visible md:w-1/3 z-10'></div>
        <div className='avatar grid justify-center align-middle items-center p-2 z-10 md:w-1/3'>
          <div className='relative w-40 h-40'>
            <Image
              src={data?.payload[0].avatar}
              className='w-full h-full rounded-full object-cover'
              width={500}
              height={500}
              alt='fillImage'
            />
            <div className='absolute bottom-2 right-2 z-10'>
              <ModalForFormsPlusButton title='Actualizar Imagen'>
                <AvatarForm />
              </ModalForFormsPlusButton>
            </div>
          </div>
          <h2 className='text-xl font-bold font-var(--font-oswald) text-center p-2 capitalize'>{`${data?.payload[0].name} ${data?.payload[0].last_name}`}</h2>
        </div>
        <div className='description bg-gray-200 p-4 rounded-sm z-10 md:w-1/3'>
          <h3 className='text-xl font-bold font-var(--font-oswald)'>Presentación</h3>
          <div className="max-h-fit">
            <p className='text-sm max-height-10 line-clamp-5'>{data?.payload[0].description || "Agrega una descripción para que todos te conozcan"}</p>
          </div>
          <div className='flex gap-2 justify-end mt-5'>
            <ModalForPreviewTextLink title="Ver Más...">
              <UserDescription description={data?.payload[0].description } />
            </ModalForPreviewTextLink>
            <ModalForFormsSoftBlue title='Actualizar'>
              <UserDescriptionForm />
            </ModalForFormsSoftBlue>
          </div>
        </div>
      </div>
      {/* Opciones */}
      <div className='options grid justify-center relative z-10'>
        <h3 className='text-xl text-center capitalize'>{data?.payload[1].title || "Título Principal"}</h3>
        <div className='flex'>
          <button className='btn bg-[var(--main-arci)] text-white'>Buscando Ofertas</button>
          <button className='btn bg-[var(--main-arci)] text-white'>Disponible Para trabajar</button>
          <ModalForPreview title={"Preview"}>
            <ProfesionalDetail />
          </ModalForPreview>
          <ModalForPreview title={"Preview Full"}>
            <ProfesionalDetailFull />
          </ModalForPreview>
        </div>
      </div>
    </div>
  );
}
