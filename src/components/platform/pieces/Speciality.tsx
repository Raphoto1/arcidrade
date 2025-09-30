import React from "react";
import { FaStar } from "react-icons/fa";

// imports propios
import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ConfirmDeleteSpecialityForm from "@/components/forms/platform/profesional/ConfirmDeleteSpecialityForm";
import ModalForFormsSoftBlue from "@/components/modals/ModalForFormsSoftBlue";
import FileSpecialityForm from "@/components/forms/platform/profesional/FileSpecialityForm";
import ProfesionalSpecialityUpdateForm from "@/components/forms/platform/profesional/ProfesionalSpecialityUpdateForm";
import { useProfesionalSpecialities } from "@/hooks/usePlatPro";

export default function Speciality(props: any) {
  const {mutate} = useProfesionalSpecialities()
  const date = new Date(props.end_date);
  const endDate = props.end_date ? date.getFullYear() : null;

  //DESARROLLO FUTURO
// const handleMakeMain = async () => {
//     try {
//       const response = await fetch(`/api/platform/profesional/speciality/${props.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ is_main: true }),
//       });

//       if (response.ok) {
//         console.log("Especialidad marcada como principal");
//         mutate(); // refresca los datos localmente
//       } else {
//         const errorData = await response.json();
//         console.error("Error al marcar como principal:", errorData.message || "Error desconocido");
//       }
//     } catch (error) {
//       console.error("Error en la solicitud:", error);
//     }
//   };


  return (
    <div>
      <div className='bg-gray-50 w-full rounded-sm p-4 grid grid-cols-2 gap-4 shadow-xl mt-2 items-center'>
        {/* Información */}
        <div className='w-full'>
          {/* <div className='flex items-center gap-2 mb-2'>
            <FaStar className={props.is_main ? "text-yellow-500" : "text-gray-400"} />
            {props.is_main && <span className='text-xs text-yellow-600 font-semibold'>Principal</span>}
          </div> */}
          <h2 className='text-[var(--main-arci)] font-bold text-lg'>{props.title || "Especialidad"}</h2>
          <p className='text-sm text-gray-800'>{props.title_category || "Categoría Universidad"}</p>
          <span className='text-sm text-gray-600 block'>{props.institution || "Universidad Grande"}</span>
          <p className='font-light'>{endDate || "No Finalizado"}</p>
          {props.link?<div className="m-0 p-0">
            <h4 className='mt-2 font-semibold'>Link</h4>
            <a href={props.link} target="_blank" className='text-sm text-gray-700'>preview</a>
          </div> : null}
          {props.file?<div>
            <h4 className='mt-2 font-semibold'>Archivo</h4>
            <a href={props.file} target="_blank" className='text-sm text-gray-700 link'>preview</a>
          </div>:null}
        </div>

        {/* Controles */}
        <div className='grid justify-center gap-0'>
          <ModalForFormsRedBtn title='Eliminar Especialidad'>
            <ConfirmDeleteSpecialityForm id={props.id} />
          </ModalForFormsRedBtn>

          {/* <button
            className={`btn text-white text-sm h-auto ${props.is_main ? "bg-gray-400 cursor-not-allowed" : "bg-[var(--main-arci)]"}`}
            disabled={props.is_main}
            onClick={handleMakeMain}>
            {props.is_main ? "Ya es Principal" : "Establecer como Principal"}
          </button> */}

          <ModalForFormsSoftBlue title='Agregar Respaldo'>
            <FileSpecialityForm id={props.id} />
          </ModalForFormsSoftBlue>

          <ModalForFormsSoftBlue title='Actualizar'>
            <ProfesionalSpecialityUpdateForm id={props.id} />
          </ModalForFormsSoftBlue>
        </div>
      </div>
    </div>
  );
}
