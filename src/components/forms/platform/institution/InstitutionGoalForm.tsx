"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useHandleSubmitText } from "@/hooks/useFetch";
import { useModal } from "@/context/ModalContext";
import { useInstitutionCertifications, useInstitutionGoals } from "@/hooks/usePlatInst";

export default function InstitutionGoalForm() {
  const { closeModal } = useModal();
  const { mutate } = useInstitutionGoals();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (formData) => {
    const payload = {
      ...formData,
    };

    const response = await useHandleSubmitText(payload, "/api/platform/institution/goal/");
    if (response.ok) {
      mutate();
      closeModal();
    }
  });

  return (
    <div className='flex w-full justify-center items-center'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl text-start font-[var(--font-oswald)]'>Logro</h2>

          <form onSubmit={onSubmit} className='form justify-center align-middle pl-2 min-w-full grid gap-4 mt-4'>
            <div>
              <label htmlFor='title' className='block font-semibold mb-1'>
                Título del Logro
              </label>
              <input type='text' {...register("title", { required: "Este campo es obligatorio" })} className='input input-bordered w-full' />
              {errors.title?.message && <span className='text-xs text-red-500'>{String(errors.title.message)}</span>}
            </div>

            <div className='mb-2'>
              <label htmlFor='year' className='block'>
                Fecha de Logro
              </label>
              <input type='date' className='input input-bordered w-full max-w-xs' {...register("year", { required: true })} />
              {errors.year?.message  && <span className='text-red-500 text-xs'>Este campo es obligatorio</span>}
            </div>

            <div>
              <label htmlFor='description' className='block font-semibold mb-1'>
                Descripción
              </label>
              <textarea {...register("description")} className='textarea textarea-bordered w-full' />
            </div>

            <div className='flex justify-center gap-4 mt-6'>
              <button type='submit' className='btn bg-[var(--soft-arci)]'>
                Confirmar Logro
              </button>
              <button type='button' className='btn bg-[var(--orange-arci)]' onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
