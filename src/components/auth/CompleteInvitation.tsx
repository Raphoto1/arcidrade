"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChkInvitation, useInvitation } from "@/hooks/useInvitation";
import { signIn } from "next-auth/react";

export default function CompleteInvitation(idIn: any) {
  const router = useRouter();
  const { id } = idIn;
  const { invitation, loading }: any = useChkInvitation(id);

  console.log("Dato id en el componente:", { id });

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
      alert("Registrado Satisfactoriamente");
      const result = signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result as any) {
        router.push("/platform");
      }
    } catch (error) {
      console.error("Error using invitation:", error);
      alert("Email Incorrecto para esta invitación");
    }
  };
  return (
    <div className='flex w-full justify-center items-center'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-sm md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>Bienvenido a Arcidrade</h2>
          <form onSubmit={handleInvitation} className='form justify-center align-middle pl-2 md:grid md:min-w-full'>
            <div className='block'>
              <label htmlFor='email' className='block'>
                Confirmar email
              </label>
              <input type='email' name='email' />
            </div>
            <div>
              <label htmlFor='password' className='block'>
                Contraseña
              </label>
              <input type='password' name='password' />
            </div>
            <div>
              <label htmlFor='confirmPassword' className='block'>
                Confirmar Contraseña
              </label>
              <input type='password' name='confirmPassword' />
            </div>
            <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
              <button className='btn bg-[var(--soft-arci)]' type='submit'>
                Confirmar Registro
              </button>
              <button className='btn btn-wide bg-[var(--orange-arci)]'>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
