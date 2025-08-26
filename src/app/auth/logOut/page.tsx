'use client'
import React from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation';

function logOut() { 
  const router = useRouter()
  const handleLogOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };
  return (
    <div className='grid w-full justify-center items-center pt-2'>
      <div className='flex flex-col gap-4'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h1 className='text-2xl font-bold test-start font-var(--font-oswald) text-center'>Seguro que quieres Cerrar Sesión?</h1>
          <button className='btn btn-wide bg-[var(--orange-arci)]' onClick={handleLogOut}>Cerrar Sesión</button>
        </div>
      </div>
    </div>
  )
}

export default logOut
