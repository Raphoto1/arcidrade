"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChkInvitation, useResetPassword } from "@/hooks/useInvitation";
import { signIn } from "next-auth/react";

export default function ResetPassword(idIn: any) {
  const router = useRouter();
  const { id } = idIn;
  const { invitation, loading, error }: any = useChkInvitation(id);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Manejar estados de carga y error
  if (loading) {
    return (
      <div className='flex w-full justify-center items-center min-h-[calc(100vh-200px)] py-8'>
        <div className='flex flex-col items-center gap-4'>
          <div className="loading loading-spinner loading-lg"></div>
          <p>Verificando cuenta...</p>
        </div>
      </div>
    );
  }

  // Si hay un error específico, mostrarlo
  if (error) {
    return (
      <div className='flex w-full justify-center items-center min-h-[calc(100vh-200px)] py-8'>
        <div className='alert alert-error max-w-md'>
          <p>Error al verificar la cuenta:</p>
          <p>{error}</p>
          <p>ID: {id}</p>
          <div className="flex justify-center mt-4">
            <button 
              className='btn bg-[var(--orange-arci)] text-white hover:bg-orange-600 px-6'
              onClick={() => router.push('/auth/login')}
            >
              Volver
            </button>
          </div>
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
      <div className='flex w-full justify-center items-center min-h-[calc(100vh-200px)] py-8'>
        <div className='alert alert-warning max-w-md'>
          <p>Cuenta no válida o no encontrada:</p>
          <p>ID/ReferCode: {id}</p>
          <details className="mt-2">
            <summary className="cursor-pointer">Ver respuesta completa</summary>
            <pre className="text-xs mt-2 bg-gray-100 p-2 rounded max-h-40 overflow-auto">
              {JSON.stringify(invitation, null, 2)}
            </pre>
          </details>
          <div className="flex gap-2 mt-4 justify-center">
            <button 
              className='btn bg-[var(--orange-arci)] text-white hover:bg-orange-600 px-6'
              onClick={() => router.push('/auth/login')}
            >
              Volver
            </button>
            <button 
              className='btn bg-[var(--soft-arci)] text-white hover:bg-[var(--main-arci)] px-6'
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

    // Validación del email con la invitación
    const invitationEmail = invitation?.email;
    console.log("Reset Password - Invitation object:", invitation);
    console.log("Reset Password - Invitation email:", invitationEmail);
    console.log("Reset Password - Form email:", data.email);
    console.log("Reset Password - ID:", id);
    
    if (invitationEmail && data.email.toLowerCase() !== invitationEmail.toLowerCase()) {
      alert("El email ingresado no coincide con el email de la cuenta.");
      return;
    }

    try {
      const response = await useResetPassword(data, id);
      alert("Contraseña cambiada exitosamente. Iniciando sesión...");     
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      
      if (result?.ok) {
        router.push("/platform");
      } else {
        console.error("Error en signIn:", result?.error);
        alert("Error al iniciar sesión después de cambiar Contraseña");
      }
    } catch (error: any) {
      console.error("Error resetting password:", error);
      const errorMessage = error.message || "Error al cambiar la contraseña. Verifique que el email coincida con la cuenta.";
      alert(errorMessage);
    }
  };
  return (
    <div className='flex w-full justify-center items-center min-h-[calc(100vh-200px)] py-8'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-sm md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>Cambiar Contraseña</h2>
          <form onSubmit={handleInvitation} className='form justify-center align-middle pl-2 md:grid md:min-w-full'>
            <div className='block mb-4'>
              <label htmlFor='email' className='block text-sm font-medium mb-2'>
                Confirmar email
                {invitation?.email && (
                  <span className='block text-xs text-gray-600 mt-1'>
                    Email de la cuenta: {invitation.email}
                  </span>
                )}
              </label>
              <input 
                type='email' 
                name='email' 
                id='email'
                className='input input-bordered w-full'
                required
                placeholder={invitation?.email || 'Ingrese su email'}
                defaultValue={invitation?.email || ''}
              />
            </div>
            <div className='mb-4'>
              <label htmlFor='password' className='block text-sm font-medium mb-2'>
                Contraseña
              </label>
              <div className='relative'>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  name='password' 
                  id='password'
                  className='input input-bordered w-full pr-12'
                  required
                  placeholder='Ingrese su contraseña'
                  minLength={6}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700'
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L12 12m-2.122-2.122L7.758 7.758M12 12l2.122-2.122m-2.122 2.122L7.758 16.242" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className='mb-4'>
              <label htmlFor='confirmPassword' className='block text-sm font-medium mb-2'>
                Confirmar Contraseña
              </label>
              <div className='relative'>
                <input 
                  type={showConfirmPassword ? 'text' : 'password'}
                  name='confirmPassword' 
                  id='confirmPassword'
                  className='input input-bordered w-full pr-12'
                  required
                  placeholder='Confirme su contraseña'
                  minLength={6}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700'
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L12 12m-2.122-2.122L7.758 7.758M12 12l2.122-2.122m-2.122 2.122L7.758 16.242" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
              <button 
                className='btn btn-wide bg-green-600 text-white hover:bg-green-700 border-green-600 hover:border-green-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105' 
                type='submit'
              >
                🔒 Actualizar Contraseña
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
