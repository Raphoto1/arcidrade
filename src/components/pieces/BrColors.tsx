import React from "react";

export default function BrColors(props:{ title:string }) {
  return (
    <div className='flex max-w-screen max-h-full py-2 pr-4 min-h-4 items-center justify-between'>
      <div className='colors grid min-w-6/12 w-dvw md:min-w-8/12 md:w-dvw pr-2 min-h-6 content-between'>
        <div className='color1 bg-[var(--soft-arci)] h-3 min-w-auto'></div>
        <div className='color2 bg-[var(--orange-arci)] h-2 min-w-auto'></div>
      </div>
      <div className='title font-oswald text-4xl md:min-w-fit font-bold'>{props.title}</div>
    </div>
  );
}
