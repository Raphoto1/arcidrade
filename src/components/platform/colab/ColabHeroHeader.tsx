"use client";
import React, { useRef } from "react";
import Image from "next/image";
import GeneralReport from "./pieces/GeneralReport";
import InvitationsReport from "./pieces/InvitationsReport";
import { useColab } from "@/hooks/useColab";
import ModalForFormsPlusButton from "@/components/modals/ModalForFormsPlusButton";
import ColabAvatarForm from "@/components/forms/platform/colab/ColabAvatarForm";
import { InlineLoader } from "@/components/pieces/Loader";
import ColabProfileForm from "@/components/forms/platform/colab/ColabProfileForm";
import { FaUser } from "react-icons/fa";
import { ModalContext } from "@context/ModalContext";

export default function ColabHeroHeader() {
  const { data, error, isLoading } = useColab();
  const profileModalRef = useRef<HTMLDialogElement>(null);

  const openProfileModal = () => profileModalRef.current?.showModal();
  const closeProfileModal = () => profileModalRef.current?.close();
  
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
  const hasPersonalName = Boolean(colabData?.name && colabData?.last_name);

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
        <div className="flex w-full md:w-1/3 justify-center items-center p-2 z-10">
          <div className='flex flex-col items-center justify-center gap-1 md:gap-2'>
            <div className="relative w-32 md:w-40 h-32 md:h-40">
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
            <div className='flex items-center justify-center gap-2'>
              <h2 className='text-lg md:text-xl font-bold font-var(--font-oswald) text-center capitalize leading-tight'>{fullName}</h2>
              {hasPersonalName && (
                <button
                  type='button'
                  onClick={openProfileModal}
                  className='relative h-10 w-10 rounded-full bg-(--main-arci) text-white hover:bg-(--soft-arci) transition-colors shadow-md flex items-center justify-center'
                  aria-label='Editar mi informacion personal'
                >
                  <FaUser size={16} />
                  <span className='absolute -top-1 -right-1 h-4 w-4 rounded-full bg-white text-(--main-arci) text-xs leading-4 font-bold shadow flex items-center justify-center'>
                    +
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Informe General */}
        <div className="w-full md:w-1/3 flex items-start justify-center">
          <GeneralReport />
        </div>
      </div>

      <dialog
        ref={profileModalRef}
        className='modal modal-bottom sm:modal-middle'
        aria-labelledby='profile-modal-title'
        onClick={(event) => event.target === event.currentTarget && closeProfileModal()}
      >
        <ModalContext.Provider value={{ closeModal: closeProfileModal }}>
          <div className='modal-box max-h-90vh mb-10'>
            <form method='dialog'>
              <button
                type='button'
                className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
                onClick={closeProfileModal}
              >
                ✕
              </button>
            </form>
            <h2 id='profile-modal-title' className='text-lg font-bold mb-2'>
              Mi información personal
            </h2>
            <ColabProfileForm />
          </div>
        </ModalContext.Provider>
      </dialog>
    </div>
  );
}
