"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { medicalOptions } from "@/static/data/staticData";
import { useHandleSubmitText } from "@/hooks/useFetch";
import { useModal } from "@/context/ModalContext";
import { useInstitutionSpecializations } from "@/hooks/usePlatInst";

export default function InstitutionSpecialityForm() {
  const { closeModal } = useModal();
  const { mutate } = useInstitutionSpecializations();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const [titleCategorySelected, setTitleCategorySelected] = useState("");

  const handleTitleCategorySelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTitleCategorySelected(e.target.value);
  };

  const onSubmit = handleSubmit(async (formData) => {
    const payload = {
      ...formData,
    };

    const response = await useHandleSubmitText(payload, "/api/platform/institution/speciality/");
    if (response.ok) {
      mutate();
      closeModal();
    }
  });

  return (
    <div className='flex w-full justify-center items-center'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl text-start font-[var(--font-oswald)]'>Especialidad</h2>

          <form onSubmit={onSubmit} className='form justify-center align-middle pl-2 min-w-full grid gap-4 mt-4'>
            <div>
              <label htmlFor='title' className='block font-semibold mb-1'>
                Título Especialidad
              </label>
              <input type='text' {...register("title")} className='input input-bordered w-full' />
              {errors.title?.message && <span className='text-xs text-red-500'>{String(errors.title.message)}</span>}
            </div>

            <div>
              <label htmlFor='title_category' className='block font-semibold mb-1'>
                Categoría más cercana
              </label>
              <select
                {...register("title_category", { required: "Este campo es obligatorio" })}
                value={titleCategorySelected}
                onChange={handleTitleCategorySelected}
                className='select select-bordered w-full'>
                <option value=''>Seleccione una especialidad</option>
                {medicalOptions.map((speciality: any, index: number) => (
                  <option key={index} value={speciality.name}>
                    {speciality.name}
                  </option>
                ))}
              </select>
              {errors.title_category?.message && <span className='text-xs text-red-500'>{String(errors.title_category.message)}</span>}
            </div>

            <div className='flex justify-center gap-4 mt-6'>
              <button type='submit' className='btn bg-[var(--soft-arci)]'>
                Confirmar Especialidad
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
