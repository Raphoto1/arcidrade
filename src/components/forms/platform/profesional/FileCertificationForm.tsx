'use client'
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useModal } from "@/context/ModalContext";
import { useProfesional, useProfesionalCertifications, useProfesionalSpecialities } from "@/hooks/usePlatPro";

export default function FileCertificationForm(id: any) {
  const { mutate } = useProfesionalCertifications();
  const { closeModal } = useModal();
  const path = `/api/platform/upload/certification/${id.id}`
  const [type, setType] = useState("archivo"); // Inicializa el tipo como archivo
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data: any) => {
    let formData = new FormData();
    if (type === "enlace") {
      formData = new FormData();
      formData.append("link", data.link);
    } else if (type === "archivo") {
      const file = data.file?.[0];
      formData = new FormData();
      formData.append("file", file);
    }
    const res = await fetch(path, {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    console.log("spe Registrado:", result.url);
    mutate();
    closeModal();
  });

  return (
    <div className='flex w-full justify-center items-center'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>Respaldo Certificación</h2>
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
                <label htmlFor='link'>Link a Respaldo</label>
                <input type='text' {...register("link")} />
              </div>
            )}
            <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
              <button className='btn bg-[var(--soft-arci)]' type='submit'>
                Agregar Respaldo
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
