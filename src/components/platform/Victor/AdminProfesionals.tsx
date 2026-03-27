"use client";
import React from "react";

import ActiveProfesionals from "./pieces/adminProfesionals.tsx/ActiveProfesionals";
import PausedProfesionals from "./pieces/adminProfesionals.tsx/PausedProfesionals";
import { usePaginatedProfesionals } from "@/hooks/usePlatPro";
export default function AdminProfesional() {
  const { data: pausedData, error: pausedError, isLoading: pausedLoading } = usePaginatedProfesionals(
    1,
    1,
    undefined,
    undefined,
    undefined,
    "desactivated"
  );

  const pausedTotal =
    typeof pausedData?.total === "number"
      ? pausedData.total
      : Array.isArray(pausedData?.data)
      ? pausedData.data.length
      : 0;

  const shouldHidePausedSection = !pausedLoading && !pausedError && pausedTotal === 0;

  return (
    <div className='flex-col justify-start w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <h2 className='font-bold font-oswald text-xl text-center'>Administrar Profesionales</h2>
      {shouldHidePausedSection && (
        <div className='w-full px-4 pt-3'>
          <div className='alert bg-gray-100 border border-gray-300 text-gray-700'>No hay profesionales pausados</div>
        </div>
      )}
      <div className={`w-full grid grid-cols-1 ${shouldHidePausedSection ? "md:grid-cols-1" : "md:grid-cols-2"} gap-4 p-4 md:max-h-3/4 justify-center`}>
        <ActiveProfesionals />
        {!shouldHidePausedSection && <PausedProfesionals />}
      </div>
    </div>
  );
}
