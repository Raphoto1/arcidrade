"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChkInvitation, useInvitation } from "@/hooks/useInvitation";
import { signIn } from "next-auth/react";

export default function CompleteInvitation(idIn: any) {
  const router = useRouter();
  const { id } = idIn;
  const { invitation, loading, error }: any = useChkInvitation(id);














  // Manejar estados de carga y error
  if (loading) {
    return (
      <div className='flex w-full justify-center items-center min-h-screen'>
        <div className='flex flex-col items-center gap-4'>
          <div className="loading loading-spinner loading-lg"></div>
          <p>Verificando invitación...</p>
        </div>
      </div>
    );
  }

  // Si hay un error específico, mostrarlo
  if (error) {
    return (
      <div className='flex w-full justify-center items-center min-h-screen'>
        <div className='alert alert-error max-w-md'>
          <p>Error al verificar la invitación:</p>
          <p>{error}</p>
          <p>ID: {id}</p>
          <button 
            className='btn btn-outline'
            onClick={() => router.push('/auth/login')}
          >
            Volver al login
          </button>
        </div>
      </div>
    );
  }

  // Validación actualizada - la API devuelve el objeto directamente, no en payload
  const isValidInvitation = invitation && (
    invitation.id ||           // Prisma object con id
    invitation.referCode ||    // Prisma object con referCode 
    invitation.email ||        // Prisma object con email
    invitation.payload         // Por si hay otras APIs que usen payload
  );

  if (!isValidInvitation) {
    return (
      <div className='flex w-full justify-center items-center min-h-screen'>
        <div className='alert alert-warning max-w-md'>
          <p>Invitación no válida o no encontrada:</p>
          <p>ID/ReferCode: {id}</p>
          <details className="mt-2">
            <summary className="cursor-pointer">Ver respuesta completa</summary>
            <pre className="text-xs mt-2 bg-gray-100 p-2 rounded max-h-40 overflow-auto">
              {JSON.stringify(invitation, null, 2)}
            </pre>
          </details>
          <div className="flex gap-2 mt-4">
            <button 
              className='btn btn-outline'
              onClick={() => router.push('/auth/login')}
            >
              Volver al login
            </button>
            <button 
              className='btn btn-primary'
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInvitation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Validación básica
    if (data.password !== data.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (!data.email || !data.password) {
      alert("Por favor complete todos los campos");
      return;
    }

    try {
      const response = await useInvitation(data, id);

      alert("Registrado Satisfactoriamente");
      
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      
      if (result?.ok) {
        router.push("/platform");
      } else {
        console.error("Error en signIn:", result?.error);
        alert("Error al iniciar sesión después del registro");
      }
    } catch (error) {
      console.error("Error using invitation:", error);
      alert("Error al completar el registro. Verifique que el email coincida con la invitación.");
    }
  };
  return (
    <div className='flex w-full justify-center items-center'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-sm md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>Bienvenido a Arcidrade</h2>
          <form onSubmit={handleInvitation} className='form justify-center align-middle pl-2 md:grid md:min-w-full'>
            <div className='block mb-4'>
              <label htmlFor='email' className='block text-sm font-medium mb-2'>
                Confirmar email
              </label>
              <input 
                type='email' 
                name='email' 
                id='email'
                className='input input-bordered w-full'
                required
                placeholder='Ingrese su email'
              />
            </div>
            <div className='mb-4'>
              <label htmlFor='password' className='block text-sm font-medium mb-2'>
                Contraseña
              </label>
              <input 
                type='password' 
                name='password' 
                id='password'
                className='input input-bordered w-full'
                required
                placeholder='Ingrese su contraseña'
                minLength={6}
              />
            </div>
            <div className='mb-4'>
              <label htmlFor='confirmPassword' className='block text-sm font-medium mb-2'>
                Confirmar Contraseña
              </label>
              <input 
                type='password' 
                name='confirmPassword' 
                id='confirmPassword'
                className='input input-bordered w-full'
                required
                placeholder='Confirme su contraseña'
                minLength={6}
              />
            </div>
            <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
              <button className='btn bg-[var(--soft-arci)] text-white hover:bg-[var(--main-arci)]' type='submit'>
                Confirmar Registro
              </button>
              <button 
                type='button'
                className='btn btn-wide bg-[var(--orange-arci)] text-white hover:bg-orange-600'
                onClick={() => router.push('/auth/login')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
