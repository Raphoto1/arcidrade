'use client'
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useModal } from "@/context/ModalContext";
import { useHandleSubmitText } from "@/hooks/useFetch";
import { optionsTitleStatus, medicalOptions, nurseOptions, pharmacistOptions } from "@/static/data/staticData";
import DescriptionRichText from "@/components/forms/DescriptionRichTextWrapper";
import { useToast } from "@/context/ToastContext";
import { revalidateAllProcesses } from "@/hooks/useProcess";

export default function CreateProcessForm() {
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const [titleCategorySelected, setTitleCategorySelected] = useState<string[]>([""]);
  const [statusSelected, setStatusSelected] = useState("");
  const [subAreaSelected, setSubAreaSelected] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Opciones de categorías de profesional
  const subAreaOptions = [
    { value: "doctor", label: "Médico" },
    { value: "nurse", label: "Enfermería" },
    { value: "pharmacist", label: "Farmacia" }
  ];

  // Función para obtener las especialidades según la categoría seleccionada
  const getSpecialityOptions = () => {
    switch (subAreaSelected) {
      case "doctor":
        return medicalOptions;
      case "nurse":
        return nurseOptions;
      case "pharmacist":
        return pharmacistOptions;
      default:
        return [];
    }
  };

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    control,
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

  const handleSubAreaSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubAreaSelected(e.target.value);
    // Reiniciar especialidades cuando cambie la categoría del profesional
    setTitleCategorySelected([""]);
  };

  const onSubmit = handleSubmit(async (formData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        subArea: subAreaSelected,
      };

      await useHandleSubmitText(payload, "/api/platform/process/");
      
      reset(); // Resetea los campos del formulario
      setTitleCategorySelected([""]); // Reinicia especialidades
      setSubAreaSelected(""); // Reinicia categoría del profesional
      
      // Revalidar la lista de procesos pendientes
      revalidateAllProcesses().catch(err => console.error('Error revalidating processes:', err));
      
      // Mostrar éxito (no bloqueante) y cerrar modal
      showToast('Proceso creado correctamente', 'success');
      closeModal();
      
    } catch (error: any) {
      const errorMessage = error.message || 'Error desconocido';
      showToast(`Error al crear el proceso: ${errorMessage}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  });
  return (
    <div className='flex w-full justify-center items-center'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl text-start font-(--font-oswald)'>Crear Proceso</h2>
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
              <label htmlFor='subArea' className='block font-semibold mb-1'>
                Categoría del Profesional
              </label>
              <select 
                {...register("subArea", { required: "Este campo es obligatorio" })}
                value={subAreaSelected} 
                onChange={handleSubAreaSelected} 
                className='select select-bordered w-full'
              >
                <option value=''>Seleccione una categoría</option>
                {subAreaOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.subArea?.message && <span className='text-xs text-red-500'>{String(errors.subArea.message)}</span>}
            </div>
            <div>
              <label className='block font-semibold mb-1'>Categoría(s) más cercana(s) de la especialidad</label>
              {!subAreaSelected && (
                <p className='text-sm text-gray-500 mb-2'>
                  Primero seleccione la categoría del profesional para ver las especialidades disponibles
                </p>
              )}
              {titleCategorySelected.map((selected, idx) => (
                <div key={idx} className='flex items-center gap-2 mb-2'>
                  <select
                    {...register(`title_category_${idx}`, { 
                      required: subAreaSelected ? "Este campo es obligatorio" : false 
                    })}
                    value={selected}
                    onChange={(e) => handleTitleCategorySelected(idx, e.target.value)}
                    className='select select-bordered w-full'
                    disabled={!subAreaSelected}
                  >
                    <option value=''>
                      {subAreaSelected ? 'Seleccione una especialidad' : 'Seleccione primero la categoría del profesional'}
                    </option>
                    {getSpecialityOptions().map((speciality: any, index: number) => (
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
                disabled={titleCategorySelected.length >= 3 || !subAreaSelected}>
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
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <DescriptionRichText
                    value={field.value || ''}
                    onChange={field.onChange}
                    label="Descripción del Cargo"
                    placeholder="Describe el cargo, funciones, requisitos..."
                    minHeight="300px"
                  />
                )}
              />
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
              <button type='submit' className='btn bg-(--soft-arci)' disabled={isSubmitting}>
                {isSubmitting ? 'Creando...' : 'Confirmar Crear Proceso'}
              </button>
              <button type='button' className='btn bg-(--orange-arci)' onClick={closeModal} disabled={isSubmitting}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
