import React from "react";

export default function Grid({children}: any) {
  return (
    <div className='flex justify-center'>
      <div className='grid grid-cols-1 gap-4 p-4 bg-gray-200 rounded-md md:grid-cols-3 md:justify-center md:align-middle md:items-center'>
        {children}
      </div>
    </div>
  );
}
