"use client";
import { useState } from "react";

import { useChkInvitation, useInvitation } from "@/hooks/useInvitation";

export default async function register({ params }: any) {
  const { id } = params;
  const [formData, setFormData] = useState({
    invitationCode: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  //confirmar invitacion
  const invitation = await useChkInvitation(id);
  /* if (!invitation) {
        return <div>Error: No invitation found.{ id }</div>
    } */

  //hacer registro
  console.log("Invitation data:", invitation);
  const handleInvitation = await useInvitation(formData);
  if (handleInvitation) {
    //lanzar toast de success
  } else {
    //lanzar toast de error con el error
  }
  return (
    <div className='flex justify-center items-center h-1/2 p-5 max-w-sm'>
      <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4'>
        <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>Bienvenido a Arcidrade</h2>
        <form action='' className='form justify-center align-middle'>
          <div className='grid'>
            <label htmlFor='invitationCode'>Codigo de Invitación</label>
            <input type='text' />
          </div>
          <div>
            <label htmlFor='email'>email</label>
            <input type='email' />
          </div>
          <div>
            <label htmlFor='password'>Contraseña</label>
            <input type='password' />
          </div>
          <div>
            <label htmlFor='confirmPassword'>Confirmar Contraseña</label>
            <input type='password' />
          </div>
          <div className='grid justify-center gap-2 mt-5 items-center'>
            <button className='btn bg-[var(--soft-arci)]' type='submit'>
              Confirmar Registro
            </button>
            <button className='btn btn-wide bg-[var(--orange-arci)] w-36'>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
