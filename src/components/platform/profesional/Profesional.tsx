import React, { useEffect } from "react";

import HeroHeader from "../pieces/HeroHeader";
import ManageGrid from "./ManageGrid";
import MyAplications from "./MyAplications";
import Offers from "./Offers";
import { useProfesional } from "@/hooks/usePlatPro";
import ProfesionalGridSearch from "@/components/platform/institution/ProfesionalGridSearch";
import ListedProcess from "./ListedProcess";
import Loader from "@/components/pieces/Loader";
import { useSession } from "next-auth/react";
export default function Profesional() {
  const { status } = useSession();
  const { data, error, isLoading, mutate } = useProfesional(status === "authenticated");

  useEffect(() => {
    if (status === "authenticated") {
      mutate();
    }
  }, [status, mutate]);
  
  // Manejo seguro de la estructura de datos
  const profesionalData = Array.isArray(data?.payload) ? data.payload[0] : data?.payload;
  const mainStudyData = Array.isArray(data?.payload) ? data.payload[1] : data?.payload?.main_study || {};
  const professionalSubArea = Array.isArray(data?.payload)
    ? data.payload[1]?.sub_area
    : data?.payload?.main_study?.sub_area || data?.payload?.sub_area;
  const isDeactivated = profesionalData?.auth?.status === 'desactivated';
  const hasCompletedMainProfile = Boolean(
    profesionalData?.name &&
      profesionalData?.last_name &&
      profesionalData?.birth_date &&
      profesionalData?.phone &&
      profesionalData?.country &&
      profesionalData?.city &&
      mainStudyData?.sub_area &&
      mainStudyData?.title &&
      mainStudyData?.institution &&
      mainStudyData?.status
  );
  
  if (status === "loading" || isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader size="lg" text="Cargando perfil profesional..." />
      </div>
    );
  }
  
  if (status === "authenticated" && (error || !profesionalData)) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-center'>
          <p className='text-error text-lg'>Error al cargar datos del profesional</p>
          <p className='text-gray-500 text-sm mt-2'>Por favor, intenta nuevamente</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className=''>
      <HeroHeader />
      {hasCompletedMainProfile ? (
        <div className='px-4 pt-4'>
          <div className='collapse bg-base-200 shadow-sm'>
            <input type='checkbox' />
            <div className='collapse-title min-h-0 py-4 pr-20 text-base leading-6 font-semibold text-(--main-arci) md:text-lg'>
              Actualizar mi información
            </div>
            <div className='collapse-content'>
              <p className='pb-3 text-sm text-gray-600'>Aquí puedes editar tu información personal, título principal, especialidades, certificaciones y experiencia.</p>
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
          <Offers lockedSubArea={professionalSubArea} />
          <div className='grid grid-cols-1 gap-4 p-4 md:max-h-3/4 md:max-w-full md:justify-center md:align-middle md:items-center'>
            <h2 className='text-2xl fontArci text-center'>Instituciones Disponibles</h2>
            <ProfesionalGridSearch isFake={true} />
          </div>
        </>
      )}
    </div>
  );
}
