"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";


import {  medicalOptions } from "@/static/data/staticData";
import { useHandleSubmitText } from "@/hooks/useFetch";
import { useModal } from "@/context/ModalContext";
import { useInstitutionSpeciality, useInstitutionSpecializations } from "@/hooks/usePlatInst";

export default function InstitutionSpecialityUpdateForm(props: any) {
  const { closeModal } = useModal();
  const { data, error, isLoading, mutate } = useInstitutionSpeciality(props.id);
  const { mutate: mutate2 } = useInstitutionSpecializations();


  const [titleCategorySelected, setTitleCategorySelected] = useState("");


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (data?.payload) {
      reset({
        title: data.payload.title,
        title_category: data.payload.title_category,
      });

      setTitleCategorySelected(data.payload.title_category);
    }
  }, [data, reset]);


  const handleTitleCategorySelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTitleCategorySelected(e.target.value);
  };

  const path = `/api/platform/institution/speciality/${props.id}`;

  const onSubmit = handleSubmit(async (formData) => {
    const response = await useHandleSubmitText(formData, path);
    if (response.ok) {
      mutate2();
      closeModal();
    }
  });

  if (isLoading) return <p>Cargando datos...</p>;
  if (error) return <p>Error al cargar la especialidad.</p>;

  return (
    <div className='flex w-full justify-center items-center'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-xl'>
        <div className='flex flex-col justify-start h-full bg-gray-200 w-2/3 items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl text-start font-[var(--font-oswald)]'>Especialidad</h2>

          <form onSubmit={onSubmit} className='w-full grid gap-4 mt-4'>
            <div>
              <label htmlFor='title' className='block font-semibold mb-1'>
                Título Especialidad
              </label>
              <input id='title' type='text' {...register("title", { required: "Este campo es obligatorio" })} className='input input-bordered w-full' />
            </div>

            <div>
              <label htmlFor='title_category' className='block font-semibold mb-1'>
                Categoría más cercana
              </label>
              <select
                id='title_category'
                {...register("title_category", { required: true })}
                value={titleCategorySelected}
                onChange={handleTitleCategorySelected}
                className='select select-bordered w-full'>
                <option value=''>Seleccione una especialidad</option>
                {medicalOptions.map((speciality: { name: string }, index: number) => (
                  <option key={index} value={speciality.name}>
                    {speciality.name}
                  </option>
                ))}
              </select>
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
