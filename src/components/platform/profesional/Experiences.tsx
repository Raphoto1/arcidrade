import Experience from "../pieces/Experience";
import ModalForFormsPlusButton from "@/components/modals/ModalForFormsPlusButton";
import ProfesionalExperienceForm from "@/components/forms/platform/profesional/ProfesionalExperienceForm";
import { useProfesionalExperiences, useProfesional } from "@/hooks/usePlatPro";
export default function Experiences() {
  const { data, error, isLoading } = useProfesionalExperiences();
      const { data: UserData } = useProfesional();
  const experienceList = data?.payload;

  return (
    <div className='flex-col justify-start md:h-auto bg-gray-200 w-full align-middle items-center rounded-sm p-1 md:justify-center md:gap-4 md:overflow-auto'>
      <div className='pb-1'>
        <h1 className='text-2xl fontArci text-center'>Experiencia</h1>
      </div>
      <div className='max-h-110 overflow-auto'>
        {experienceList?.map((item: any, index: number) => (
          <Experience
            key={item.id}
            id={item.id}
            title={item.title}
            institution={item.institution}
            city={item.city}
            start_date={item.start_date}
            end_date={item.end_date}
            description={item.description}
            link={item.link}
            file={item.fiile}
          />
        ))}
      </div>
      <div className='m-1 flex justify-center items-center gap-1'>
        <div className='flex justify-center'>
          {UserData?.payload[0].name?<ModalForFormsPlusButton title='Agregar Experiencia'>
            <ProfesionalExperienceForm />
          </ModalForFormsPlusButton>:<div className="text-center">Complete Información Personal antes de agregar Experiencia</div>}
        </div>
      </div>
    </div>
  );
}
