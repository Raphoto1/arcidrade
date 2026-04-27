import React from "react";

export default function BrColors(props:{ title:string }) {
  return (
    <div className='flex w-full min-h-4 items-center justify-between gap-4 py-2 pr-4'>
      <div className='colors grid min-h-6 min-w-0 flex-1 pr-2 content-between'>
        <div className='color1 bg-(--soft-arci) h-3 min-w-auto'></div>
        <div className='color2 bg-(--orange-arci) h-2 min-w-auto'></div>
      </div>
      <h2 className='title max-w-[70%] md:max-w-none text-right font-oswald text-3xl font-bold md:text-4xl'>{props.title}</h2>
    </div>
  );
}
