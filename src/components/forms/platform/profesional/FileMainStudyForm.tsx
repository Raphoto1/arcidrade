'use client'
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useModal } from "@/context/ModalContext";
import { useToast } from "@/context/ToastContext";
import { useProfesional } from "@/hooks/usePlatPro";

interface FileMainStudyFormValues {
  file?: FileList;
  link?: string;
  isHomologated: boolean;
}

export default function FileMainStudyForm() {
  const { data: profesionalData, mutate } = useProfesional();
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const [type, setType] = useState("archivo"); // Inicializa el tipo como archivo
  const currentIsHomologated = Boolean(profesionalData?.payload?.[1]?.isHomologated);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FileMainStudyFormValues>({
    defaultValues: {
      isHomologated: false,
    },
  });

  useEffect(() => {
    setValue("isHomologated", currentIsHomologated);
  }, [currentIsHomologated, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    let formData = new FormData();
    formData.append("isHomologated", String(Boolean(data.isHomologated)));

    if (type === "enlace" && data.link) {
      formData.append("link", data.link);
    } else if (type === "archivo") {
      const file = data.file?.[0];
      if (file) {
        formData.append("file", file);
      }
    }
    try {
      const res = await fetch(`/api/platform/upload/mainstudy`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (!res.ok) {
        const message = result?.error || "No se pudo actualizar el título principal";
        showToast(message, "error");
        return;
      }

      showToast("Título principal actualizado correctamente", "success");
      mutate();
      closeModal();
    } catch (error) {
      showToast("Error de conexión al actualizar el título principal", "error");
    }
  });

  return (
    <div className='flex w-full justify-center items-center'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>Título De Profesión</h2>
          <form onSubmit={onSubmit} className='form justify-center align-middle pl-2 min-w-full md:grid md:min-w-full'>
            <div className='grid gap-2 mt-5 items-center align-middle'>
              <label>¿Qué desea subir?</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className='select select-bordered w-full max-w-xs mb-2 input'>
                <option value='archivo'>Archivo</option>
                <option value='enlace'>Enlace</option>
              </select>
            </div>
            {type === "archivo" && (
              <div className='grid'>
                <label htmlFor='file'>Archivo Pdf</label>
                <input type='file' {...register("file")} />
              </div>
            )}
            {type === "enlace" && (
              <div className='grid'>
                <label htmlFor='link'>Link a Curriculum</label>
                <input type='text' {...register("link")} />
              </div>
            )}
            <label className='flex items-center justify-between mt-2 max-w-xs rounded-md border border-gray-300 px-3 py-2'>
              <span className='text-sm font-medium'>Homologado</span>
              <div className='flex items-center gap-2'>
                <span className='text-xs text-gray-500'>No</span>
                <input type='checkbox' className='toggle toggle-success toggle-lg' {...register("isHomologated")} />
                <span className='text-xs text-green-700 font-semibold'>Sí</span>
              </div>
            </label>
            <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
              <button className='btn bg-(--soft-arci)' type='submit'>
                Agregar Título
              </button>
            </div>
          </form>
          <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
            <button className='btn btn-wide bg-(--orange-arci)' onClick={closeModal}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
