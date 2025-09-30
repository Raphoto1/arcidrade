import React from "react";

export default function UserDescription(props: any) {
  return (
    <div className='Total grid gap-2 md:flex pt-2 overflow-auto'>
      <div className='flex w-full bg-gray-200 rounded-sm z-10'>
        <div className=' p-2 rounded-sm z-10 md:w-full'>
          <h1 className='text-2xl fontArci'>Presentación</h1>
          <div className='bg-white rounded-md p-1 justify-center mt-2'>
            <p className='font-roboto-condensed text-sm text-[var(--dark-gray)]'>{props.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
