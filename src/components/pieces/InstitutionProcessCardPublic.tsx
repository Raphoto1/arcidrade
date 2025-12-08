'use client'
import React from "react";
import Image from "next/image";
import { useHandleStatusName } from "@/hooks/useUtils";

export default function InstitutionProcessCardPublic(props: any) {
  const processData = props.processData; // Datos del proceso completos desde el endpoint público
  const isFake = props.isFake || false;

  // Acceder directamente a los datos que ya vienen en el proceso
  const processPack = processData || {};
  const institutionData = processPack.auth?.institution_data || {};

  // Si no hay datos, no renderizar
  if (!processPack.id) {
    return null;
  }

  return (
    <div className='card w-96 bg-base-100 card-sm shadow-sm max-w-80'>
      <div className='topHat bg-[var(--orange-arci)] w-full h-20 flex align-middle items-center justify-between rounded-t-lg pr-2'>
        <div className="pl-2">
          {processPack.status === 'pending' && <h1 className="text-xl font-bold text-white">Proceso sin Confirmar</h1>}
          <h2 className='font-oswald text-xl text-white capitalize'>{processPack.position || "Cargo Oferta"}</h2>
          <h3 className="font-oswald text-sm text-white capitalize">{useHandleStatusName(processPack.profesional_status) || "Estado Oferta"}</h3>
        </div>
        <div className='relative w-15 h-15'>
          {institutionData.avatar ? (
            <Image 
              src={institutionData.avatar} 
              className='w-full h-full rounded-full object-cover' 
              width={500} 
              height={500} 
              alt='Institution Avatar' 
            />
          ) : (
            <Image 
              src='/logos/Logo Arcidrade Cond.png' 
              className='w-full h-full rounded-full object-cover' 
              width={500} 
              height={500} 
              alt='Default Logo' 
            />
          )}
        </div>
      </div>

      <div className='card-body'>
        <h2 className='card-title font-oswald text-xl text-(--main-arci)'>
          {isFake ? institutionData.fake_name : institutionData.name || "Arcidrade"}
        </h2>
        <p className='description h-10 font-roboto-condensed line-clamp-2'>
          {processPack.description || "Sin descripción"}
        </p>
        
        {processPack.description && (
          <div className='text-xs text-[var(--dark-gray)] italic'>
            Ver más información disponible tras registro
          </div>
        )}
        
        <div className='flex justify-between card-actions items-end mt-2'>
          <div className='extraInfo font-roboto-condensed text-red-700'>
            <p>Especialización solicitada</p>
            <p className='font-bold text-xl capitalize text-wrap max-w-30'>
              {processPack.main_speciality || "especialización de la oferta"}
            </p>
          </div>
          
          <div className='rightActions flex flex-col justify-end font-roboto-condensed'>
            <a 
              href='/auth/register' 
              className='btn btn-sm bg-[var(--main-arci)] hover:bg-[var(--main-arci)]/90 text-white'
            >
              Regístrese
            </a>
            <span className='text-xs text-center mt-1 text-[var(--dark-gray)]'>
              para aplicar
            </span>
          </div>
        </div>

        {processPack.extra_specialities && processPack.extra_specialities.length > 0 && (
          <div className='mt-2 border-t pt-2'>
            <p className='text-xs font-semibold text-[var(--dark-gray)]'>Especialidades adicionales:</p>
            <div className='flex flex-wrap gap-1 mt-1'>
              {processPack.extra_specialities.slice(0, 3).map((spec: any, index: number) => (
                <span 
                  key={index} 
                  className='badge badge-sm bg-[var(--soft-arci)] text-[var(--main-arci)] capitalize'
                >
                  {spec.speciality}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
