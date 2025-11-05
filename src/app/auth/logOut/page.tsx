'use client'
import React, { useState } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation';

function logOut() { 
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogOut = async () => {
    setIsLoading(true)
    try {
      await signOut({ redirect: false });
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className='h-[70vh] w-full flex flex-col'>
      <div className='flex-1 flex justify-center items-center px-4'>
        <div className='grid w-full max-w-md justify-center items-center'>
          <div className='flex flex-col gap-4'>
            <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-6 md:justify-center'>
              <h1 className='text-2xl font-bold text-center font-var(--font-oswald) mb-4'>¿Seguro que quieres Cerrar Sesión?</h1>
              <div className='flex justify-center'>
                <button 
                  className="btn btn-wide bg-[var(--orange-arci)]"
                  onClick={handleLogOut}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    'Cerrar Sesión'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default logOut
