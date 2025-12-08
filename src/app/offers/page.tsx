import React from "react";
import OffersPublic from "@/components/home/OffersPublic";
import Link from "next/link";
export default function page() {
  return (
      <div>
          <div className="flex justify-center pt-5">
              
      <p className='text-sm md:text-base text-gray-600'>
        ¿Ya te registraste?{" "}
        <Link href='/auth/login' className='text-[var(--main-arci)] font-semibold hover:underline'>
          Ingresa aquí
        </Link>
      </p>
          </div>
      <OffersPublic />
    </div>
  );
}
