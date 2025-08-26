"use client";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import Router from "next/router";
import { useChkInvitation, useInvitation } from "@/hooks/useInvitation";
import { signIn } from "next-auth/react";

export default function LoginForm() {

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    const response = await signIn("credentials", { ...data, redirect: false });
    console.log("respuesta del login:", response);
    if (response?.error) {
      alert("Credenciales inválidas");
    } else {
      redirect("/platform");
    }
  };
  return (
    <div className='flex w-full justify-center items-center'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-sm md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>Entrar a Arcidrade</h2>
          <form onSubmit={handleSubmit} className='form justify-center align-middle pl-2 md:grid md:min-w-full'>
            <div className='block'>
              <label htmlFor='email' className='block'>
                Email
              </label>
              <input type='email' name='email' />
            </div>
            <div>
              <label htmlFor='password' className='block'>
                Contraseña
              </label>
              <input type='password' name='password' />
            </div>
            <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
              <button className='btn bg-[var(--soft-arci)]' type='submit'>
                Entrar
              </button>
              <button className='btn btn-wide bg-[var(--orange-arci)]'>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
