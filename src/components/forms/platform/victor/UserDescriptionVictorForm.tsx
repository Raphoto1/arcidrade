import React from "react";
import { useForm } from "react-hook-form";
import { useHandleSubmitText } from "@/hooks/useFetch";
import { useProfesional } from "@/hooks/usePlatPro";
import { useModal } from "@/context/ModalContext";
import { useProfesionalById } from "../../../../hooks/usePlatPro";
import { useInstitutionFullById } from "@/hooks/usePlatInst";

interface UserDescriptionFormProps {
  userId: string;
  area: string;
}

export default function UserDescriptionForm({ userId, area }: UserDescriptionFormProps) {
  const { closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Usar el hook apropiado según el área
  const professionalData = useProfesionalById(area === 'profesional' ? userId : '');
  const institutionData = useInstitutionFullById(area === 'institution' ? userId : '');
  
  const data = area === 'profesional' ? professionalData.data : institutionData.data;
  const error = area === 'profesional' ? professionalData.error : institutionData.error;
  const isLoading = area === 'profesional' ? professionalData.isLoading : institutionData.isLoading;
  const mutate = area === 'profesional' ? professionalData.mutate : institutionData.mutate;
  
  const description = area === 'profesional' 
    ? data?.payload?.profesional_data?.description 
    : data?.payload?.institution_data?.description;
  
  console.log('data en desc', description);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      description: '',
    },
  });

  // Actualizar el formulario cuando los datos se carguen
  React.useEffect(() => {
    if (description) {
      reset({
        description: description,
      });
    }
  }, [description, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    setIsSubmitting(true);
    try {
      const bodyData = {
        ...formData,
        userId,
        area
      };
      
      const response = await useHandleSubmitText(bodyData, "/api/platform/victor/adminUser/description");

      if (response.ok) {
        mutate();
        closeModal();
      }
    } catch (error) {
      console.error('Error al actualizar descripción:', error);
    } finally {
      setIsSubmitting(false);
    }
  });

  if (isLoading) {
    return (
      <div className='flex w-full justify-center items-center min-h-[300px]'>
        <div className='flex flex-col items-center gap-3'>
          <div className='loading loading-spinner loading-lg text-[var(--main-arci)]'></div>
          <p className='text-gray-600'>Cargando descripción...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex w-full justify-center items-center min-h-[300px]'>
        <div className='flex flex-col items-center gap-3'>
          <p className='text-red-600'>Error al cargar los datos</p>
          <button className='btn btn-outline' onClick={closeModal}>Cerrar</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='flex w-full justify-center items-center'>
        <div className='flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl'>
          <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center md:w-fit'>
            <form onSubmit={onSubmit} className='form justify-center align-middle pl-2 min-w-full md:grid md:min-w-full'>
              <div className='block'>
                <label htmlFor='description' className='block'>
                  Presentación
                </label>
                <textarea className='w-xs md:w-md textarea' {...register("description", { required: true })} />
              </div>

              <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
                <button 
                  className='btn bg-[var(--main-arci)] text-white' 
                  type='submit'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className='flex items-center gap-2'>
                      <div className='loading loading-spinner loading-sm'></div>
                      Guardando...
                    </div>
                  ) : (
                    'Confirmar descripción'
                  )}
                </button>
              </div>
            </form>
            <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
              <button className='btn btn-wide bg-[var(--orange-arci)]' onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
