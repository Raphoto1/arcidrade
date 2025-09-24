import React from "react";
import { useModal } from "@/context/ModalContext";
import { useProfesional } from "@/hooks/usePlatPro";

export default function ConfirmDeleteSpecialityForm(id: any) {
  const { mutate } = useProfesional();
  const { closeModal } = useModal();

  const path = `/api/platform/profesional/speciality/${id.id}`;
  const handleDelete = async () => {
    // Lógica para eliminar el CV
    const response = await fetch(path, {
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
      <h1 className='text-2xl fontArci text-center pb-5'>Se Eliminara la Especialidad de Manera Permanente</h1>
      <button className='btn bg-[var(--orange-arci)] h-7 w-20 text-white text-center justify-center pt' onClick={handleDelete}>
        Borrar
      </button>
    </div>
  );
}
