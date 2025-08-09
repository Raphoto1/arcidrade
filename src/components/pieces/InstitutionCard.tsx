import React from "react";
import { CiMedal } from "react-icons/ci";

export default function InstitutionCard() {
  return (
    <div className='card w-96 bg-base-100 card-sm shadow-sm max-w-80'>
      <div className='topHat bg-amber-600 w-full h-20 flex align-middle items-center justify-between rounded-t-lg'>
        <div className='buttons w-15 h-15 ml-2 grid flex-col content-between'>
          <button className='btn btn-xs'>Responsive</button>
          <button className='btn btn-xs'>Responsive</button>
        </div>
        <div className='Badge w-15 h-15 ml-2 flex justify-center align-middle items-center'>
          <div className='badge badge-success badge-xs'>
            <CiMedal />
            Seleccionado
          </div>
        </div>
        <div className='photo w-15 h-15 rounded-full bg-amber-50 mr-2'></div>
      </div>

      <div className='card-body'>
        <h2 className='card-title font-oswald text-xl'>Name/intitution</h2>

        <p className='description font-roboto-condensed'>A card component has a figure, a body part, and inside body there are title and actions parts</p>
        <div className='flex justify-between card-actions items-end'>
          <div className='extraInfo font-roboto-condensed text-red-700'>
            <p>cargo/especialidad</p>
          </div>
          <div className='rightActions flex flex-col justify-end font-roboto-condensed'>
            <p>state</p>
            <button className='link link-info'>Ver mas</button>
          </div>
        </div>
      </div>
    </div>
  );
}
