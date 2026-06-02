"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function BackToNewsButton() {
  const router = useRouter();

  const handleGoBack = () => {
    try {
      router.push("/news");
      router.refresh();
    } catch (error) {
      console.error("No se pudo navegar con router, usando fallback:", error);
      window.location.assign("/news");
    }
  };

  return (
    <button type='button' className='btn btn-sm btn-ghost text-(--main-arci)' onClick={handleGoBack}>
      Volver a novedades
    </button>
  );
}
