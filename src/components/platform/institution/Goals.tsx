import Experience from "../pieces/Experience";
import ModalForFormsPlusButton from "@/components/modals/ModalForFormsPlusButton";
import ProfesionalExperienceForm from "@/components/forms/platform/profesional/ProfesionalExperienceForm";
import { useProfesionalExperiences, useProfesional } from "@/hooks/usePlatPro";
import Goal from "../pieces/Goal";
import { useInstitution, useInstitutionGoals } from "@/hooks/usePlatInst";
import InstitutionGoalForm from "@/components/forms/platform/institution/InstitutionGoalForm";
export default function Goals() {
  const { data, error, isLoading } = useInstitutionGoals();
  const { data: UserData } = useInstitution();
  const experienceList = data?.payload;

  return (
    <div className='flex-col justify-start md:h-auto bg-gray-200 w-full align-middle items-center rounded-sm p-1 md:justify-center md:gap-4 md:overflow-auto'>
      <div className='pb-1'>
        <h1 className='text-2xl fontArci text-center'>Logros</h1>
      </div>
      {isLoading && <div>Cargando...</div>}
      <div className='max-h-110 overflow-auto'>
        {experienceList?.map((item: any, index: number) => (
          <Goal key={item.id} id={item.id} title={item.title} year={item.year} description={item.description} link={item.link} file={item.file} />
        ))}
      </div>
      <div className='m-1 flex justify-center items-center gap-1'>
        <div className='flex justify-center'>
          {UserData?.payload.name ? (
            <ModalForFormsPlusButton title='Agregar Logro'>
              <InstitutionGoalForm />
            </ModalForFormsPlusButton>
          ) : (
            <div className='text-center'>Complete Información Personal antes de agregar Logro</div>
          )}
        </div>
      </div>
    </div>
  );
}
