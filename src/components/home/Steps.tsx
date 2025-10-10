'use client'
import React from "react";
import { CiCirclePlus } from "react-icons/ci";
import { PiBooksLight } from "react-icons/pi";
import { HiOutlineBriefcase } from "react-icons/hi2";

export default function Steps() {
  return (
    <div className="w-full p-5">
      <div className='flex w-full flex-col lg:flex-row'>
        <div className='card bg-[var(--soft-arci)] rounded-box grid h-20 md:h-24 grow place-items-center'>
          <CiCirclePlus size={30}/>
          <h3 className="text-xl">
          Registrese
          </h3>
        </div>
        <div className='divider lg:divider-horizontal'/>
        <div className='card bg-[var(--soft-arci)] rounded-box grid h-20 md:h-24 grow place-items-center'>
          <PiBooksLight size={30}/>
          <h3 className="text-xl">
          Ingrese Documentos
          </h3>
        </div>
        <div className='divider lg:divider-horizontal' />
        <div className='card bg-[var(--soft-arci)] rounded-box grid h-20 md:h-24 grow place-items-center'>
        <HiOutlineBriefcase size={30}/>
          <h3 className="text-xl">
          Aplique
          </h3>
        </div>
      </div>
    </div>
  );
}
