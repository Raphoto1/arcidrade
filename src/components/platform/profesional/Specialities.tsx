import React, { useEffect, useState } from "react";

import Speciality from "../pieces/Speciality";
import ModalForFormsPlusButton from "@/components/modals/ModalForFormsPlusButton";
import ProfesionalSpecialityForm from "@/components/forms/platform/profesional/ProfesionalSpecialityForm";
import { useProfesional, useProfesionalSpecialities } from "@/hooks/usePlatPro";
import Loader from "@/components/pieces/Loader";

export default function Specialities() {
  const { data, error, isLoading } = useProfesionalSpecialities();
  const { data: UserData } = useProfesional();
  const specialitiesList = data?.payload;
  
  // Estado para forzar re-render del modal cuando cambie sub_area
  const [modalKey, setModalKey] = useState(0);
  
  // Efecto para detectar cambios en sub_area y forzar re-render del modal
  useEffect(() => {
    if (UserData?.payload[1]?.sub_area) {
      setModalKey(prev => prev + 1);
    }
  }, [UserData?.payload[1]?.sub_area]);
  

  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-1 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-1'>
        <h1 className='text-2xl fontArci text-center'>Especialidades</h1>
      </div>
      {isLoading ? (
        <div className='flex justify-center items-center py-8'>
          <Loader size="md" text="Cargando especialidades..." />
        </div>
      ) : (
        <div className='max-h-110 overflow-y-auto overflow-x-clip'>
        {specialitiesList?.map((item: any, index: number) => (
          <Speciality
            key={item.id}
            id={item.id}
            title={item.title}
            title_category={item.title_category}
            institution={item.institution}
            end_date={item.end_date}
            link={item.link}
            file={item.file}
          />
        ))}
      </div>
      )}
      <div className='m-1 flex justify-center items-center gap-1'>
        <div className='flex justify-center'>
          {UserData?.payload[0].name ? (
            <ModalForFormsPlusButton 
              key={modalKey} // Key que cambia cuando sub_area cambia
              title='Agregar Especialidad'
            >
              <ProfesionalSpecialityForm subArea={UserData?.payload[1].sub_area} />
            </ModalForFormsPlusButton>
          ) : (
            <div className="text-center">Complete Información Personal antes de agregar Especialidades</div>
          )}
        </div>
      </div>
    </div>
  );
}
