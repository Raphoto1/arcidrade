import React from "react";

import Speciality from "../pieces/Speciality";
import ModalForFormsPlusButton from "@/components/modals/ModalForFormsPlusButton";
import { useInstitution } from "@/hooks/usePlatInst";

export default function SpecialitiesInstitution() {
  const { data: userData, error, isLoading, mutate } = useInstitution()
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Especialidades</h1>
      </div>
      <div>
        {/* <Speciality />
        <Speciality />
        <Speciality />
        <Speciality />
        <Speciality /> */}
      </div>
      <div className='flex justify-center'>
        {userData?.payload.name ? (
          <ModalForFormsPlusButton title='Agregar Especialidad'>
            <div></div>
          </ModalForFormsPlusButton>
        ) : (
          <div className="text-center">Complete Información Personal antes de agregar Especialidades</div>
        )}
      </div>
    </div>
  );
}
