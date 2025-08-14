import React from 'react'

export default function LoginForm() {
  return (
   <div className='flex justify-center items-center h-1/2 p-5 max-w-sm'>
     <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4'>
       <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>Ingreso</h2>
       <form action="submit" method="post" className='form justify-center align-middle'>
         <div className='grid'>
           <label htmlFor="username">Email</label>
           <input type="text" name="email" placeholder="ejemplo@ejemplo.com" />
         </div>
         <div className='grid'>
           <label htmlFor="password">Password</label>
           <input type="password" name="password" placeholder="6 a 8 dígitos" />
         </div>
         <div className='grid justify-center gap-2 mt-5'>
          <button className='btn bg-[var(--soft-arci)]' type='submit'>Ingresar</button>
            <button className='btn btn-wide bg-[var(--orange-arci)] w-36'>Cancelar</button>
         </div>
       </form>
     </div>
   </div>
  )
}
