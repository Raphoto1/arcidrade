import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useModal } from "@/context/ModalContext";
import { useHandleSubmitText } from "@/hooks/useFetch";
import { optionsTitleStatus, medicalOptions } from "@/static/data/staticData";

export default function CreateProcessForm() {
  const { closeModal } = useModal();
  const [titleCategorySelected, setTitleCategorySelected] = useState<string[]>([""]);
  const [statusSelected, setStatusSelected] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  // Agregar campo de especialidad
  const handleAddSpecialty = () => {
    setTitleCategorySelected([...titleCategorySelected, ""]);
  };

  // Eliminar campo de especialidad
  const handleRemoveSpecialty = (index: number) => {
    const updated = [...titleCategorySelected];
    updated.splice(index, 1);
    setTitleCategorySelected(updated);
  };

  // Manejar cambio en cada select de especialidad
  const handleTitleCategorySelected = (index: number, value: string) => {
    const updated = [...titleCategorySelected];
    updated[index] = value;
    setTitleCategorySelected(updated);
  };

  const handleStatusSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusSelected(e.target.value);
  };

  const onSubmit = handleSubmit(async (formData) => {
    const payload = {
      ...formData,
    };

    const response = await useHandleSubmitText(payload, "/api/platform/process/");
    if (response.ok) {
      reset(); // Resetea los campos del formulario
      setTitleCategorySelected([""]); // Reinicia especialidades
      closeModal();
    }
  });
  return (
    <div className='flex w-full justify-center items-center'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl text-start font-[var(--font-oswald)]'>Crear Proceso</h2>
          <form onSubmit={onSubmit} className='form justify-center align-middle pl-2 min-w-full grid gap-4 mt-4'>
            <div className='mb-2'>
              <label htmlFor='start_date' className='block'>
                Fecha Inicio
              </label>
              <input
                type='date'
                className='input input-bordered w-full max-w-xs'
                {...register("start_date", {
                  required: true,
                  validate: value => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Ignorar hora
                    const selectedDate = new Date(value);
                    return selectedDate >= today || "La fecha de inicio no puede ser anterior a hoy";
                  }
                })}
              />
              {errors.start_date?.message && (
                <span className='text-red-500 text-xs'>{errors.start_date.message as string}</span>
              )}
            </div>
            <div>
              <label htmlFor='position' className='block font-semibold mb-1'>
                Cargo a Solicitar
              </label>
              <input type='text' {...register("position", { required: "Este campo es obligatorio" })} className='input input-bordered w-full' />
              {errors.position?.message && <span className='text-xs text-red-500'>{String(errors.position.message)}</span>}
            </div>
            <div>
              <label className='block font-semibold mb-1'>Categoría(s) más cercana(s) de la especialidad</label>
              {titleCategorySelected.map((selected, idx) => (
                <div key={idx} className='flex items-center gap-2 mb-2'>
                  <select
                    {...register(`title_category_${idx}`, { required: "Este campo es obligatorio" })}
                    value={selected}
                    onChange={(e) => handleTitleCategorySelected(idx, e.target.value)}
                    className='select select-bordered w-full'>
                    <option value=''>Seleccione una especialidad</option>
                    {medicalOptions.map((speciality: any, index: number) => (
                      <option key={index} value={speciality.name}>
                        {speciality.name}
                      </option>
                    ))}
                  </select>
                  {idx > 0 && (
                    <button type='button' className='btn btn-xs bg-red-400 text-white' onClick={() => handleRemoveSpecialty(idx)} title='Eliminar especialidad'>
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type='button'
                className='btn btn-sm bg-blue-500 text-white mt-2'
                onClick={handleAddSpecialty}
                disabled={titleCategorySelected.length >= 3}>
                + Agregar especialidad Secundaria
              </button>
              {/* Mostrar errores solo para el primer campo */}
              {errors.title_category_0?.message && <span className='text-xs text-red-500'>{String(errors.title_category_0.message)}</span>}
            </div>
            <div>
              <label htmlFor='titleStatus' className='block font-semibold mb-1'>
                Estado del título
              </label>
              <select {...register("titleStatus")} value={statusSelected} onChange={handleStatusSelected} className='select select-bordered w-full'>
                <option value=''>Seleccione un estado</option>
                {optionsTitleStatus.map((status, index) => (
                  <option key={index} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
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
                  <input type='radio' value='auto' {...register("processType", { required: true })} defaultChecked />
                  Propio
                </label>
                <label className='flex items-center gap-2'>
                  <input type='radio' value='arcidrade' {...register("processType", { required: true })} />
                  Arcidrade
                </label>
              </div>
              {errors.processType && <span className='text-xs text-red-500'>Este campo es obligatorio</span>}
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
