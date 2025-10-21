import { useInstitutionById } from "@/hooks/usePlatInst";
import { formatDateToString } from "@/hooks/useUtils";
import React from "react";

export default function ProcessPill(props: any) {
  const process = props.process;
  const { data: institutionPack } = useInstitutionById(process?.user_id);
  const institutionData = institutionPack?.payload;

  
  return (
    <div className='w-full h-auto bg-white rounded-md flex flex-col'>
      <div className='w-full h-auto flex'>
        <div className='flex flex-col align-middle justify-center w-1/2 p-1'>
          <h3 className='text-(--main-arci) text-bold text-wrap font-bold'>{institutionData?.name || "Institución"}</h3>
          <p className='text-sm text-gray-600 w-100 capitalize'>{process?.position || "Cargo"}</p>
          <p className='font-light'>{formatDateToString(process?.start_date) || "No date"}</p>
        </div>
        <div className='w-1/2 p-1'>
          <button className='btn bg-[var(--main-arci)] w-full text-white h-auto '>Detalle</button>
          <button className='btn bg-[var(--orange-arci)] w-full text-white h-auto '>Eliminar</button>
          <button className='btn bg-success w-full text-white h-auto '>Aceptar</button>
          <button className='btn bg-warning w-full text-white h-auto '>Solicitar Contacto</button>
        </div>
      </div>
        <div className="w-full flex justify-center">
        <span className="fontArci text-[var(--orange-arci)]">{ process?.type ==='arcidrade' ? 'Proceso Arcidrade' : null }</span>
        </div>
    </div>
  );
}
