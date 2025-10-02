//imports de app
import ModalForFormsPlusButton from "@/components/modals/ModalForFormsPlusButton";
import { useInstitution, useInstitutionSpecializations } from "@/hooks/usePlatInst";
import InstitutionSpecialityForm from "@/components/forms/platform/institution/InstitutionSpecialityForm";
import SpecialityInstitution from "../pieces/SpecialityInstitution";

export default function SpecialitiesInstitution() {
  const { data: userData, mutate: institutionMutate } = useInstitution();
  const { data, error, isLoading, mutate } = useInstitutionSpecializations();
  console.log("institution specialities data:", data);
  
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Especialidades</h1>
      </div>
      <div>
        {data?.payload.map((speciality: any) => (
          <SpecialityInstitution key={speciality.id} {...speciality} />
        ))} 
      </div>
      <div className='flex justify-center pt-2'>
        {userData?.payload.name ? (
          <ModalForFormsPlusButton title='Agregar Especialidad'>
            <InstitutionSpecialityForm />
          </ModalForFormsPlusButton>
        ) : (
          <div className="text-center">Complete Información Personal antes de agregar Especialidades</div>
        )}
      </div>
    </div>
  );
}
