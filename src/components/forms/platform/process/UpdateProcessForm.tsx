'use client'
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useModal } from "@/context/ModalContext";
import { useHandleSubmitText } from "@/hooks/useFetch";
import { optionsTitleStatus, medicalOptions } from "@/static/data/staticData";
import { useProcess } from "@/hooks/useProcess";

function validateStartDate(value: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(value);
  return selectedDate >= today || "La fecha de inicio no puede ser anterior a hoy";
}

function SpecialitySelector({
  selected,
  idx,
  onChange,
  onRemove,
  register,
  error,
}: {
  selected: string;
  idx: number;
  onChange: (value: string) => void;
  onRemove: () => void;
  register: any;
  error?: any;
}) {
  return (
    <div className='flex items-center gap-2 mb-2'>
      <select
        {...register(`title_category_${idx}`, { required: "Este campo es obligatorio" })}
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className='select select-bordered w-full'>
        <option value=''>Seleccione una especialidad</option>
        {medicalOptions.map((speciality: any, index: any) => (
          <option key={index} value={speciality.name}>
            {speciality.name}
          </option>
        ))}
      </select>
      {idx > 0 && (
        <button type='button' className='btn btn-xs bg-red-400 text-white' onClick={onRemove}>
          ✕
        </button>
      )}
      {error && <span className='text-xs text-red-500'>{error}</span>}
    </div>
  );
}

export default function UpdateProcessForm({ id }: { id: number }) {
  const { closeModal } = useModal();
  const { data, error, isLoading, mutate } = useProcess(id);
  const process = data?.payload;

  const [titleCategorySelected, setTitleCategorySelected] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (process) {
      const extras = Array.isArray(process.extra_specialities) ? process.extra_specialities.map((e: any) => e.speciality) : [];
      const allSpecialities = [process.main_speciality, ...extras].filter(Boolean);

      reset({
        start_date: process?.start_date ? process?.start_date.slice(0, 10) : "",
        position: process?.position || "",
        titleStatus: process.profesional_status || "",
        description: process.description || "",
        processType: process.type || "auto",
      });
      setTitleCategorySelected(allSpecialities.length ? allSpecialities : [""]);
    }
  }, [process, reset]);

  const handleAddSpecialty = () => {
    setTitleCategorySelected([...titleCategorySelected, ""]);
  };

  const handleRemoveSpecialty = (index: number) => {
    const updated = [...titleCategorySelected];
    updated.splice(index, 1);
    setTitleCategorySelected(updated);
  };

  const handleTitleCategorySelected = (index: number, value: string) => {
    const updated = [...titleCategorySelected];
    updated[index] = value;
    setTitleCategorySelected(updated);
    setValue(`title_category_${index}`, value);
  };

  const onSubmit = handleSubmit(async (formData) => {
    setIsSubmitting(true);
    const payload = {
      ...formData,
      id: process.id,
      main_speciality: titleCategorySelected[0],
      extra_specialities: titleCategorySelected.slice(1).map((value, index) => ({
        field: `title_category_${index + 1}`,
        speciality: value,
      })),
    };

    const response = await useHandleSubmitText(payload, `/api/platform/process/${process.id}`);
    if (response.ok) {
      reset();
      mutate();
      closeModal();
    }
    setIsSubmitting(false);
  });

  if (isLoading) return <div className='p-8 text-center'>Cargando datos del proceso...</div>;
  if (error) return <div className='p-8 text-center text-red-500'>Error al cargar el proceso.</div>;
  if (!process) return null;

  return (
    <div className='flex w-full justify-center items-center'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl text-start font-[var(--font-oswald)]'>Actualizar Proceso</h2>
          <form onSubmit={onSubmit} className='form justify-center align-middle pl-2 min-w-full grid gap-4 mt-4'>
            <div className='mb-2'>
              <label htmlFor='start_date' className='block'>
                Fecha Inicio
              </label>
              <input
                type='date'
                className='input input-bordered w-full max-w-xs'
                {...register("start_date", { required: true, validate: validateStartDate })}
              />
              {errors.start_date?.message && <span className='text-red-500 text-xs'>{errors.start_date.message as string}</span>}
            </div>

            <div>
              <label htmlFor='position' className='block font-semibold mb-1'>
                Cargo a Solicitar
              </label>
              <input type='text' {...register("position", { required: "Este campo es obligatorio" })} className='input input-bordered w-full' />
              {errors.position?.message && <span className='text-xs text-red-500'>{String(errors.position.message)}</span>}
            </div>

            <div>
              <label className='block font-semibold mb-1'>Especialidad principal</label>
              {titleCategorySelected.map((selected, idx) => (
                <SpecialitySelector
                  key={idx}
                  selected={selected}
                  idx={idx}
                  onChange={(value) => handleTitleCategorySelected(idx, value)}
                  onRemove={() => handleRemoveSpecialty(idx)}
                  register={register}
                  error={errors[`title_category_${idx}`]?.message}
                />
              ))}
              <button
                type='button'
                className='btn btn-sm bg-blue-500 text-white mt-2'
                onClick={handleAddSpecialty}
                disabled={titleCategorySelected.length >= 3}>
                + Agregar especialidad Secundaria
              </button>
            </div>

            <div>
              <label htmlFor='titleStatus' className='block font-semibold mb-1'>
                Estado del título
              </label>
              <select
                {...register("titleStatus", { required: "Este campo es obligatorio" })}
                className='select select-bordered w-full'
                defaultValue={process.profesional_status || ""}>
                <option value=''>Seleccione un estado</option>
                {optionsTitleStatus.map((status, index) => (
                  <option key={index} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              {errors.titleStatus?.message && <span className='text-xs text-red-500'>{String(errors.titleStatus.message)}</span>}
            </div>

            <div>
              <label htmlFor='description' className='block font-semibold mb-1'>
                Descripción del Cargo
              </label>
              <textarea {...register("description")} className='textarea textarea-bordered w-full' />
            </div>

            <div>
              <label className='block font-semibold mb-1'>Tipo de proceso</label>
              <div className='flex gap-4'>
                <label className='flex items-center gap-2'>
                  <input type='radio' value='auto' {...register("processType", { required: true })} defaultChecked={process.type === "auto"} />
                  Propio
                </label>
                <label className='flex items-center gap-2'>
                  <input type='radio' value='arcidrade' {...register("processType", { required: true })} defaultChecked={process.type === "arcidrade"} />
                  Arcidrade
                </label>
              </div>
              {errors.processType && <span className='text-xs text-red-500'>Este campo es obligatorio</span>}
            </div>

            <div className='flex justify-center gap-4 mt-6'>
              <button type='submit' className='btn bg-[var(--soft-arci)]' disabled={isSubmitting}>
                {isSubmitting ? "Actualizando..." : "Actualizar Proceso"}
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
