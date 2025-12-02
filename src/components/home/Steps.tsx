"use client";
import React, { useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { PiBooksLight } from "react-icons/pi";
import { HiOutlineBriefcase } from "react-icons/hi2";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Steps() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Si el usuario está autenticado, redirigir a la plataforma
    if (status === "authenticated" && session) {
      router.push("/platform");
    }
  }, [status, session, router]);

  // Mostrar loading mientras se verifica la sesión
  if (status === "loading") {
    return (
      <div className='w-full p-5'>
        <div className='flex w-full flex-col lg:flex-row'>
          <div className='card bg-[var(--soft-arci)] rounded-box grid h-20 md:h-24 grow place-items-center'>
            <span className="loading loading-spinner loading-md"></span>
          </div>
        </div>
      </div>
    );
  }

  // Solo mostrar los pasos si NO está autenticado
  if (status === "unauthenticated") {
    return (
      <div className='w-full p-5'>

        <div className='flex w-full flex-col lg:flex-row'>
          <Link href='/auth/register' className='card bg-[var(--soft-arci)] rounded-box grid h-20 md:h-24 grow place-items-center hover:bg-[var(--main-arci)] hover:text-white transition-all'>
            <CiCirclePlus size={30} />
            <h3 className='text-xl'>Registrese</h3>
          </Link>
          
          <div className='divider lg:divider-horizontal' />
          
          <Link href='/auth/register' className='card bg-[var(--soft-arci)] rounded-box grid h-20 md:h-24 grow place-items-center hover:bg-[var(--main-arci)] hover:text-white transition-all'>
            <PiBooksLight size={30} />
            <h3 className='text-xl'>Ingrese Documentos</h3>
          </Link>
          
          <div className='divider lg:divider-horizontal' />
          
          <Link href='/offers' className='card bg-[var(--soft-arci)] rounded-box grid h-20 md:h-24 grow place-items-center hover:bg-[var(--main-arci)] hover:text-white transition-all'>
            <HiOutlineBriefcase size={30} />
            <h3 className='text-xl'>Aplique</h3>
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
