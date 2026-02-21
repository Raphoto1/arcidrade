import React from "react";
import RichTextDisplay from "@/components/ui/RichTextDisplay";

export default function UserDescription(props: any) {
  return (
    <div className='Total grid gap-2 md:flex pt-2 overflow-auto'>
      <div className='flex w-full bg-gray-200 rounded-sm z-10'>
        <div className=' p-2 rounded-sm z-10 md:w-full'>
          <h1 className='text-2xl fontArci'>Presentación</h1>
          <div className='bg-white rounded-md p-4 justify-center mt-2'>
            <RichTextDisplay content={props.description} className='text-sm text-(--dark-gray)' />
          </div>
        </div>
      </div>
    </div>
  );
}
