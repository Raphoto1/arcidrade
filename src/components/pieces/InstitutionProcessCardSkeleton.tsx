import React from "react";

export default function InstitutionProcessCardSkeleton() {
  return (
    <div className='card w-96 bg-base-100 card-sm shadow-sm max-w-80 animate-pulse'>
      {/* Top Hat skeleton */}
      <div className='bg-gray-300 w-full h-20 flex align-middle items-center justify-between rounded-t-lg pr-2'>
        <div className="pl-2 flex flex-col gap-2 flex-1">
          <div className="h-5 bg-gray-400 rounded w-3/4"></div>
          <div className="h-4 bg-gray-400 rounded w-1/2"></div>
        </div>
        <div className='w-15 h-15 bg-gray-400 rounded-full'></div>
      </div>

      <div className='card-body'>
        {/* Institution name skeleton */}
        <div className='h-6 bg-gray-300 rounded w-2/3 mb-2'></div>
        
        {/* Description skeleton */}
        <div className='space-y-2 mb-2'>
          <div className='h-4 bg-gray-300 rounded w-full'></div>
          <div className='h-4 bg-gray-300 rounded w-5/6'></div>
        </div>
        
        {/* Info text skeleton */}
        <div className='h-3 bg-gray-300 rounded w-3/4 mb-4'></div>
        
        {/* Bottom section skeleton */}
        <div className='flex justify-between items-end mt-2'>
          <div className='flex flex-col gap-2'>
            <div className='h-3 bg-gray-300 rounded w-32'></div>
            <div className='h-5 bg-gray-300 rounded w-24'></div>
          </div>
          
          <div className='flex flex-col gap-1 items-end'>
            <div className='h-8 bg-gray-300 rounded w-24'></div>
            <div className='h-3 bg-gray-300 rounded w-16'></div>
          </div>
        </div>

        {/* Extra specialities skeleton */}
        <div className='mt-2 border-t pt-2'>
          <div className='h-3 bg-gray-300 rounded w-40 mb-2'></div>
          <div className='flex gap-1'>
            <div className='h-5 bg-gray-300 rounded w-20'></div>
            <div className='h-5 bg-gray-300 rounded w-24'></div>
            <div className='h-5 bg-gray-300 rounded w-20'></div>
          </div>
        </div>
      </div>
    </div>
  );
}
