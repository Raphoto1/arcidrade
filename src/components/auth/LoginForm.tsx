"use client";
import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useForgotPassword } from "@/hooks/useInvitation";

import Loading from "@/app/auth/loading";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    setLoading(true);
    const response = await signIn("credentials", { ...data, redirect: false });

    if (response?.error) {
      setLoading(false);
      alert("Credenciales inválidas");
    } else {
      setLoading(false);
      redirect("/platform");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail.trim()) {
      alert("Por favor ingrese su email");
      return;
    }

    setForgotPasswordLoading(true);
    try {
      await useForgotPassword(forgotPasswordEmail);
      alert("Se ha enviado un enlace de recuperación a su email");
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    } catch (error: any) {
      console.error("Error sending forgot password:", error);
      alert(error.message || "Error al enviar email de recuperación");
    } finally {
      setForgotPasswordLoading(false);
    }
  };
  return (
    <div className='flex w-full justify-center items-center min-h-[calc(100vh-200px)] py-8'>
      {loading && <Loading />}
      <div className='flex justify-center items-center h-1/2 p-2 min-w-sm md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>Entrar a Arcidrade</h2>
          <form onSubmit={handleSubmit} className='form justify-center align-middle pl-2 md:grid md:min-w-full'>
            <div className='block mb-2'>
              <label htmlFor='email' className='block text-sm font-medium mb-2'>
                Email
              </label>
              <input 
                type='email' 
                name='email' 
                id='email'
                className='input input-bordered w-full'
                required
              />
            </div>
            <div className='mb-2'>
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
            
            {/* Enlace para forgot password */}
            <div className='text-center mb-1'>
              <button
                type='button'
                onClick={() => setShowForgotPassword(true)}
                className='text-sm text-[var(--soft-arci)] hover:text-[var(--main-arci)] hover:underline'
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <div className='grid grid-cols-2 justify-center gap-2 items-center align-middle'>
              <button 
                className='btn btn-wide bg-[var(--main-arci)] text-white hover:bg-[var(--soft-arci)] font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105' 
                type='submit'
              >
                🔐 Entrar
              </button>
              <button 
                type='button'
                className='btn btn-wide bg-[var(--orange-arci)] text-white hover:bg-orange-600'
                onClick={() => window.location.href = '/'}
              >
                Cancelar
              </button>
            </div>
          </form>

          {/* Modal para Forgot Password */}
          {showForgotPassword && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4 text-center">Recuperar Contraseña</h3>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                </p>
                
                <form onSubmit={handleForgotPassword}>
                  <div className="mb-4">
                    <label htmlFor="forgot-email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="forgot-email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="input input-bordered w-full"
                      placeholder="tu@email.com"
                      required
                      disabled={forgotPasswordLoading}
                    />
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotPasswordEmail("");
                      }}
                      className="btn btn-outline"
                      disabled={forgotPasswordLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn bg-[var(--main-arci)] text-white hover:bg-[var(--soft-arci)] font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      disabled={forgotPasswordLoading}
                    >
                      {forgotPasswordLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        "📧 Enviar Enlace"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
