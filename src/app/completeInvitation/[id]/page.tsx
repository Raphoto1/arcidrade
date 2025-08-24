"use client"
import { useState, useEffect } from "react";
import { useChkInvitation, useInvitation } from "@/hooks/useInvitation";

export default function Register({ params }: any) {
  const { id } = params;
  const { invitation, loading }: any = useChkInvitation(id);
  console.log('invitation desde componente completar', invitation);
  console.log('loading desde componente completar', loading);

  //pendiente verificacion
/*   if (!invitation) return <div>Error: No invitation found. {id}</div>;
  if (loading) return <div>Cargando invitación...</div>; */

  const handleInvitation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
try {
      const response = await useInvitation(data, id);
      console.log(response);
      alert('Invitation used successfully');
    } catch (error) {
      console.error('Error using invitation:', error);
      alert('Failed to use invitation');
    }
  };


  return (
    <div className='flex justify-center items-center h-1/2 p-5 max-w-sm'>
      <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4'>
        <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>Bienvenido a Arcidrade</h2>
        <form onSubmit={handleInvitation} className='form justify-center align-middle'>
          <div>
            <label htmlFor='email'>confirm email</label>
            <input type='email' name='email'/>
          </div>
          <div>
            <label htmlFor='password'>Contraseña</label>
            <input type='password' name="password"/>
          </div>
          <div>
            <label htmlFor='confirmPassword'>Confirmar Contraseña</label>
            <input type='password' name="confirmPassword"/>
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
