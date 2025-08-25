'use client'
import React from 'react'
import { signOut } from 'next-auth/react'

function logOut() {
  return (  
    <div>
          <h1>Cerrando sesión...</h1>
          <button className='btn' onClick={() => signOut()}>Cerrar Sesión</button>
    </div>
  )
}

export default logOut
