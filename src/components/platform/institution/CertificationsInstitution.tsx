import Certificate from "../pieces/Certificate";
import ModalForFormsPlusButton from "@/components/modals/ModalForFormsPlusButton";
import { useInstitution, useInstitutionCertifications } from "@/hooks/usePlatInst";
import CertificateInstitution from "../pieces/CertificateInstitution";
import InstitutionCertificationForm from "@/components/forms/platform/institution/InstitutionCertificationForm";

export default function CertificationsInstitution() {
  const { data: userData } = useInstitution();
  const { data, error, isLoading, mutate } = useInstitutionCertifications();

  
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 overflow-auto md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Certificaciones</h1>
      </div>
      {isLoading && <div>Cargando...</div>}
      {data?.payload.map((cert:any, index:number) =>(
        <CertificateInstitution key={index} {...cert} />
      ))}

      <div className='flex justify-center'>
        {userData?.payload.name ? (
          <ModalForFormsPlusButton title='Agregar Especialidad'>
            <InstitutionCertificationForm />
          </ModalForFormsPlusButton>
        ) : (
          <div className='text-center'>Complete Información Personal antes de agregar Especialidades</div>
        )}
      </div>
    </div>
  );
}
