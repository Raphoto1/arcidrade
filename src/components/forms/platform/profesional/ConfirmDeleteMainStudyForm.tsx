import React from "react";
import { useModal } from "@/context/ModalContext";
import { useProfesional } from "@/hooks/usePlatPro";

export default function ConfirmDeleteMainStudyForm() {
  const { mutate } = useProfesional();
  const { closeModal } = useModal();
  const handleDelete = async () => {
    // Lógica para eliminar el CV
    const response = await fetch("/api/platform/upload/mainstudy", {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error en la peticion o la informacion proporcionada");
    }
    const result = await response.json();
    console.log(response);
    mutate();
    closeModal();
  };
  return (
    <div className='flex flex-col justify-center align-middle items-center'>
      <h1 className='text-2xl fontArci text-center pb-5'>Se Eliminara el soporte de Título de Manera Permanente</h1>
      <button className='btn bg-[var(--orange-arci)] h-7 w-20 text-white text-center justify-center pt' onClick={handleDelete}>
        Eliminar
      </button>
    </div>
  );
}
