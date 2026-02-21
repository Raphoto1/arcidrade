import ModalForFormsPlusButton from "@/components/modals/ModalForFormsPlusButton";
import Certificate from "../pieces/Certificate";
import ProfesionalCertificationForm from "@/components/forms/platform/profesional/ProfesionalCertificationForm";
import { useProfesionalCertifications, useProfesional } from "@/hooks/usePlatPro";
import Loader from "@/components/pieces/Loader";

export default function Certifications() {
  const { data, error, isLoading, mutate } = useProfesionalCertifications();
    const { data: UserData } = useProfesional();
   const certificationsList = data?.payload;
  
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-1 md:justify-center md:gap-4 overflow-auto md:h-auto'>
      <div className='pb-1'>
        <h1 className='text-2xl fontArci text-center'>Certificaciones</h1>
      </div>
      {isLoading ? (
        <div className='flex justify-center items-center py-8'>
          <Loader size="md" text="Cargando certificaciones..." />
        </div>
      ) : (
        <div className='max-h-110 overflow-auto'>
                {certificationsList?.map((item: any, index: number) => (
                  <Certificate
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
          {UserData?.payload[0].name?<ModalForFormsPlusButton title='Agregar Certificacion'>
            <ProfesionalCertificationForm />
          </ModalForFormsPlusButton>:<div className="text-center">Complete Información Personal antes de agregar Certificaciones</div>}
        </div>
      </div>
    </div>
  );
}
