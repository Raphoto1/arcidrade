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
    <div>
      <h1>Cerrando sesión...</h1>
      <button className='btn' onClick={handleLogOut}>Cerrar Sesión</button>
    </div>
  )
}

export default logOut
