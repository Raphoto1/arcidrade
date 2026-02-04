'use client'
import React from "react";
import { useForm } from "react-hook-form";
import { useModal } from "@/context/ModalContext";
import { useColab } from "@/hooks/useColab";

export default function ColabAvatarForm() {
  const { mutate } = useColab();
  const { closeModal } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data: any) => {
    const file = data.file?.[0];
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`/api/platform/colab/upload/avatar`, {
      method: "POST",
      body: formData,
    });
    const result = await res.json();

    // Forzar actualización inmediata
    await mutate();
    closeModal();
  });

  return (
    <div className='flex w-full justify-center items-center p-4'>
      <div className='w-full max-w-md'>
        <div className='flex-col justify-start bg-gray-200 w-full rounded-lg p-4 md:p-6'>
          <h2 className='text-xl md:text-2xl font-bold font-var(--font-oswald) mb-4'>Actualizar Avatar</h2>
          <form onSubmit={onSubmit} className='w-full space-y-4'>
            <div className='flex flex-col gap-2'>
              <label htmlFor='file' className='text-sm md:text-base font-medium'>Su Avatar</label>
              <input 
                type='file' 
                {...register("file")} 
                accept="image/*"
                className='file-input file-input-bordered w-full'
              />
            </div>
            <div className='flex flex-col gap-2 mt-5'>
              <button className='btn bg-(--soft-arci) w-full' type='submit'>
                Agregar Imagen
              </button>
              <button className='btn bg-(--orange-arci) w-full' type='button' onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
