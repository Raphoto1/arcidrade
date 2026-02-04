import React from 'react';

interface HeroHeaderSkeletonProps {
  text?: string;
}

export default function HeroHeaderSkeleton({ text = "Cargando sesión..." }: HeroHeaderSkeletonProps) {
  return (
    <div className='hero-header w-full bg-gray-200 rounded-lg p-4 md:p-6 animate-pulse'>
      <div className='flex flex-col md:flex-row gap-4 md:gap-6 items-center'>
        {/* Avatar Skeleton */}
        <div className='shrink-0'>
          <div className='w-24 h-24 md:w-32 md:h-32 bg-gray-300 rounded-full'></div>
        </div>

        {/* Content Skeleton */}
        <div className='flex-1 w-full space-y-3'>
          {/* Title */}
          <div className='h-8 bg-gray-300 rounded w-3/4 max-w-md'></div>
          
          {/* Subtitle */}
          <div className='h-6 bg-gray-300 rounded w-1/2 max-w-xs'></div>
          
          {/* Info lines */}
          <div className='space-y-2 pt-2'>
            <div className='h-4 bg-gray-300 rounded w-full max-w-lg'></div>
            <div className='h-4 bg-gray-300 rounded w-5/6 max-w-md'></div>
            <div className='h-4 bg-gray-300 rounded w-4/6 max-w-sm'></div>
          </div>
        </div>

        {/* Action Button Skeleton */}
        <div className='shrink-0'>
          <div className='h-10 w-32 bg-gray-300 rounded-lg'></div>
        </div>
      </div>

      {/* Loading Text */}
      <div className='mt-6 text-center'>
        <p className='text-gray-600 font-medium animate-pulse'>{text}</p>
      </div>
    </div>
  );
}

// Variant for compact skeleton
export function HeroHeaderSkeletonCompact({ text = "Cargando..." }: HeroHeaderSkeletonProps) {
  return (
    <div className='w-full bg-gray-200 rounded-lg p-4 animate-pulse'>
      <div className='flex items-center gap-4'>
        <div className='w-16 h-16 bg-gray-300 rounded-full shrink-0'></div>
        <div className='flex-1 space-y-2'>
          <div className='h-6 bg-gray-300 rounded w-2/3'></div>
          <div className='h-4 bg-gray-300 rounded w-1/2'></div>
        </div>
      </div>
      <div className='mt-3 text-center'>
        <p className='text-sm text-gray-600'>{text}</p>
      </div>
    </div>
  );
}

// Full page skeleton with hero header
export function PageSkeleton({ text = "Cargando sesión..." }: HeroHeaderSkeletonProps) {
  return (
    <div className='w-full min-h-screen bg-gray-50 p-4 md:p-6'>
      <HeroHeaderSkeleton text={text} />
      
      {/* Content Grid Skeleton */}
      <div className='mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='bg-gray-200 rounded-lg p-4 animate-pulse'>
            <div className='h-6 bg-gray-300 rounded w-3/4 mb-3'></div>
            <div className='space-y-2'>
              <div className='h-4 bg-gray-300 rounded w-full'></div>
              <div className='h-4 bg-gray-300 rounded w-5/6'></div>
              <div className='h-4 bg-gray-300 rounded w-4/6'></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
