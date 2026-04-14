"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import HeroHeaderGeneral from "../pieces/HeroHeaderGeneral";
import ManageGrid from "./ManageGrid";
import Loader from "@/components/pieces/Loader";
import { useProfesionalGeneral } from "@/hooks/usePlatPro";
import MyAplications from "../profesional/MyAplications";
import ListedProcess from "../profesional/ListedProcess";
import Offers from "../profesional/Offers";
import ProfesionalGridSearch from "@/components/platform/institution/ProfesionalGridSearch";

export default function ProfesionalGeneral() {
  const { status } = useSession();
  const { data, error, isLoading, mutate } = useProfesionalGeneral(status === "authenticated");

  useEffect(() => {
    if (status === "authenticated") {
      mutate();
    }
  }, [status, mutate]);

  const profesionalData = Array.isArray(data?.payload) ? data.payload[0] : null;
  const mainStudyData = Array.isArray(data?.payload) ? data.payload[1] : null;

  const isDeactivated = profesionalData?.auth?.status === 'desactivated';

  const hasCompletedMainProfile = Boolean(
    profesionalData?.name &&
      profesionalData?.last_name &&
      profesionalData?.birth_date &&
      profesionalData?.phone &&
      profesionalData?.country &&
      profesionalData?.city &&
      mainStudyData?.title
  );

  if (status === "loading" || isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader size="lg" text="Cargando perfil..." />
      </div>
    );
  }

  if (status === "authenticated" && (error || !profesionalData)) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-center'>
          <p className='text-error text-lg'>Error al cargar datos del perfil</p>
          <p className='text-gray-500 text-sm mt-2'>Por favor, intenta nuevamente</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeroHeaderGeneral />
      {hasCompletedMainProfile ? (
        <div className='px-4 pt-4'>
          <div className='collapse bg-base-200 shadow-sm'>
            <input type='checkbox' />
            <div className='collapse-title min-h-0 py-4 pr-20 text-base leading-6 font-semibold text-(--main-arci) md:text-lg'>
              Actualizar mi información
            </div>
            <div className='collapse-content'>
              <p className='pb-3 text-sm text-gray-600'>
                Aquí puedes editar tu información personal, certificaciones y experiencia.
              </p>
              <ManageGrid />
            </div>
          </div>
        </div>
      ) : (
        <ManageGrid />
      )}
      {!isDeactivated && (
        <>
          <MyAplications />
          <ListedProcess />
          <Offers lockedSubArea="general" />
          <div className='grid grid-cols-1 gap-4 p-4 md:max-h-3/4 md:max-w-full md:justify-center md:align-middle md:items-center'>
            <h2 className='text-2xl fontArci text-center'>Instituciones Disponibles</h2>
            <ProfesionalGridSearch isFake={true} />
          </div>
        </>
      )}
    </div>
  );
}
