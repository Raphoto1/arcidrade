import React from "react";
import { useForm } from "react-hook-form";
import { useHandleSubmitText } from "@/hooks/useFetch";
import { useProfesional } from "@/hooks/usePlatPro";
import { useModal } from "@/context/ModalContext";
export default function UserDescriptionForm() {
  const { closeModal } = useModal();
  const { data, error, isLoading, mutate } = useProfesional();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: data?.payload[0].description,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const response = await useHandleSubmitText(data, "/api/platform/profesional/description");
    console.log("response form", response);
    if (response.ok) {
      mutate();
      closeModal();
    }
  });
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
                <button className='btn bg-[var(--soft-arci)]' type='submit'>
                  Confirmar descripción
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
