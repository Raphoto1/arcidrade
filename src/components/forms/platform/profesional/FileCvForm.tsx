import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { put } from "@vercel/blob";

export default function FileCvForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
    
  const onSubmit = handleSubmit(async (data) => {
    console.log(data);

    const file = data.file?.[0]; // FileList → File
    // if (!file) {
    //   console.error("No se seleccionó ningún archivo");
    //   return;
    // }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("link", data.link);
    const res = await fetch(`/api/platform/upload`, {
      method: "POST",

      body: formData,
    });

    const result = await res.json();
    console.log("Archivo subido:", result.url);
  });
  return (
    <div className='flex w-full justify-center items-center'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>Curriculum</h2>
          <form onSubmit={onSubmit} className='form justify-center align-middle pl-2 min-w-full md:grid md:min-w-full'>
            <div>
            </div>
            <div className='grid'>
              <label htmlFor='link'>Link a Curriculum</label>
              <input type='text' {...register("link")} />
            </div>
            <div className='grid'>
              <label htmlFor='file'>Archivo Pdf</label>
              <input type='file' {...register("file")}/>
            </div>
            <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
              <button className='btn bg-[var(--soft-arci)]' type='submit'>
                Agregar Curriculum
              </button>
              <button className='btn btn-wide bg-[var(--orange-arci)]'>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
