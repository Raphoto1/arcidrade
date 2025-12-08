'use client'
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useModal } from "@/context/ModalContext";
import { useInstitution } from "@/hooks/usePlatInst";

export default function AvatarForm() {
  const { mutate } = useInstitution();
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
    const res = await fetch(`/api/platform/upload/avatar`, {
      method: "POST",
      body: formData,
    });
    const result = await res.json();

    mutate();
    closeModal();
  });

  return (
    <div className='flex w-full justify-center items-center'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>Curriculum</h2>
          <form onSubmit={onSubmit} className='form justify-center align-middle pl-2 min-w-full md:grid md:min-w-full'>
            <div className='grid'>
              <label htmlFor='file'>Su Avatar</label>
              <input type='file' {...register("file")} />
            </div>
            <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
              <button className='btn bg-[var(--soft-arci)]' type='submit'>
                Agregar Imagen
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
  );
}
