import React from "react";
import Image from "next/image";
import GeneralReport from "./pieces/GeneralReport";
import InvitationsReport from "./pieces/InvitationsReport";
import { useColab } from "@/hooks/useColab";
import ModalForFormsPlusButton from "@/components/modals/ModalForFormsPlusButton";
import ColabAvatarForm from "@/components/forms/platform/colab/ColabAvatarForm";
import { InlineLoader } from "@/components/pieces/Loader";

export default function ColabHeroHeader() {
  const { data, error, isLoading } = useColab();
  
  if (isLoading) return <div className='p-4 text-center'><InlineLoader size="md" /> <span className="ml-2 text-gray-600">Cargando perfil...</span></div>;
  if (error) {
    return <div className='p-4 text-center text-error'>Error al cargar datos. Por favor, recarga la página.</div>;
  }
  
  // Manejo seguro de la estructura de datos
  const colabData = Array.isArray(data?.payload) ? data?.payload[0] : data?.payload;
  
  if (!colabData) {
    return <div className='p-4 text-center text-warning'>No hay datos de perfil disponibles</div>;
  }
  
  // Full name
  let fullName = "";
  if (colabData?.name == null) {
    fullName = "Colaborador";
  } else {
    fullName = `${colabData?.name} ${colabData?.last_name || ''}`.trim();
  }
  return (
    <div className="relative w-full min-h-85 overflow-visible">
      {/* Imagen de fondo con opacidad */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 min-h-85"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/7579823/pexels-photo-7579823.jpeg')",
        }}
      />
      {/* Degradado inferior hacia transparente */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-white via-transparent to-transparent" />

      {/* Contenido principal - Stack en móvil, horizontal en desktop */}
      <div className="HeroArea w-full flex flex-col md:flex-row justify-between items-stretch p-2 md:pr-5 relative z-10 gap-4 md:gap-4 min-h-85">
        {/* Sección de Invitaciones */}
        <div className="w-full md:w-1/3 flex items-start justify-center">
          <InvitationsReport />
        </div>

        {/* Avatar de Colab */}
        <div className="avatar flex flex-col justify-center items-center p-2 z-10 w-full md:w-1/3">
          <div className="relative w-32 md:w-40 h-32 md:h-40 mb-2">
            {colabData?.avatar ? (
              <Image
                src={colabData?.avatar}
                className="w-full h-full rounded-full object-cover"
                width={500}
                height={500}
                alt="Colab Profile Image"
              />
            ) : (
              <Image
                src="/logos/Logo Arcidrade Cond.png"
                className="w-full h-full rounded-full object-cover"
                width={500}
                height={500}
                alt="Default Colab Image"
              />
            )}
            {colabData?.name != null && (
              <div className='absolute bottom-2 right-2 z-10'>
                <ModalForFormsPlusButton title='Actualizar Imagen'>
                  <ColabAvatarForm />
                </ModalForFormsPlusButton>
              </div>
            )}
          </div>
          <h2 className='text-lg md:text-xl font-bold font-var(--font-oswald) text-center p-2 capitalize'>{fullName}</h2>
        </div>

        {/* Informe General */}
        <div className="w-full md:w-1/3 flex items-start justify-center">
          <GeneralReport />
        </div>
      </div>
    </div>
  );
}
