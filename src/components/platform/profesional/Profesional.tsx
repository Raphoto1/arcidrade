import React from "react";

import HeroHeader from "../pieces/HeroHeader";
import ManageGrid from "./ManageGrid";
import MyAplications from "./MyAplications";
import Offers from "./Offers";
import { useProfesional } from "@/hooks/usePlatPro";
import ProfesionalGridSearch from "@/components/platform/institution/ProfesionalGridSearch";
import ListedProcess from "./ListedProcess";
export default function Profesional() {
  const {data, error, isLoading} = useProfesional();
  
  // Manejo seguro de la estructura de datos
  const profesionalData = Array.isArray(data?.payload) ? data.payload[0] : data?.payload;
  const isDeactivated = profesionalData?.auth?.status === 'desactivated';
  
  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }
  
  if (error || !profesionalData) {
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
      <ManageGrid />
      {!isDeactivated && (
        <>
          <MyAplications />
          <ListedProcess />
          <Offers />
          <div className='grid grid-cols-1 gap-4 p-4 md:max-h-3/4 md:max-w-full md:justify-center md:align-middle md:items-center'>
            <h2 className='text-2xl fontArci text-center'>Instituciones Disponibles</h2>
            <ProfesionalGridSearch isFake={true} />
          </div>
        </>
      )}
    </div>
  );
}
