import React, { useMemo } from "react";
import Image from "next/image";
import { useProcessStats } from "@/hooks/useProcessStats";
import { useSentInvitations } from "@/hooks/useInvitation";
import ProcessStatsExample from "@/components/examples/ProcessStatsExample";

export default function VictorHeroHeader() {
  const { processStats, isLoading, error } = useProcessStats();
  const { data: invitationsData, isLoading: invitationsLoading, error: invitationsError } = useSentInvitations('invited');

  // Contar invitaciones por tipo
  const invitationStats = useMemo(() => {
    const invitations = invitationsData?.payload || [];
    const stats = {
      total: invitations.length,
      profesional: 0,
      institution: 0,
      manager: 0
    };
    
    invitations.forEach((invitation: any) => {
      const area = invitation.area?.toLowerCase();
      if (area === 'profesional') stats.profesional++;
      else if (area === 'institution') stats.institution++;
      else if (area === 'manager') stats.manager++;
    });
    
    return stats;
  }, [invitationsData]);

  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    console.error("Error loading processes:", error);
  }

  return (
    <div className='relative w-full md:h-[340px] overflow-hidden'>
      {/* Imagen de fondo con opacidad */}
      <div
        className='absolute inset-0 bg-cover bg-center opacity-10'
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/7579823/pexels-photo-7579823.jpeg')",
        }}
      />
      {/* Degradado inferior hacia transparente */}
      <div className='absolute bottom-0 left-0 right-0 h-[160px] bg-gradient-to-t from-white via-transparent to-transparent' />
      {/* Contenido principal */}
      <div className='HeroArea w-full flex justify-center items-center align-middle p-2 md:pr-5 relative z-10'>
        <div className='invitations bg-gray-200 p-4 rounded-sm z-10 md:w-1/3 hidden md:block'>
          <h1 className='text-xl font-bold font-var(--font-oswald) mb-4'>Invitaciones Pendientes</h1>
          
          <div className='flex justify-between align-middle items-center p-2 w-full bg-white rounded-md m-2'>
            <h3 className='text-[var(--main-arci)] font-medium'>Profesionales</h3>
            <p className="font-bold text-blue-600">
              {invitationsLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : invitationsError ? (
                <span className="text-error">-</span>
              ) : (
                invitationStats.profesional
              )}
            </p>
          </div>
          
          <div className='flex justify-between align-middle items-center p-2 w-full bg-white rounded-md m-2'>
            <h3 className='text-[var(--main-arci)] font-medium'>Instituciones</h3>
            <p className="font-bold text-green-600">
              {invitationsLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : invitationsError ? (
                <span className="text-error">-</span>
              ) : (
                invitationStats.institution
              )}
            </p>
          </div>
          
          <div className='flex justify-between align-middle items-center p-2 w-full bg-white rounded-md m-2'>
            <h3 className='text-[var(--main-arci)] font-medium'>Selección</h3>
            <p className="font-bold text-purple-600">
              {invitationsLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : invitationsError ? (
                <span className="text-error">-</span>
              ) : (
                invitationStats.manager
              )}
            </p>
          </div>
          
          <div className='flex justify-between align-middle items-center p-2 w-full bg-[var(--main-arci)] bg-opacity-10 rounded-md m-2 border border-[var(--main-arci)] border-opacity-20'>
            <h3 className='text-[var(--soft-arci)] font-bold'>Total Invitaciones</h3>
            <p className="font-bold text-[var(--soft-arci)] text-lg">
              {invitationsLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : invitationsError ? (
                <span className="text-error">-</span>
              ) : (
                invitationStats.total
              )}
            </p>
          </div>
        </div>
        <div className='avatar flex flex-col justify-center align-middle items-center p-2 z-10 md:w-1/3'>
          <div className='relative w-40 h-40'>
            <Image
              src='https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp'
              className='w-full h-full rounded-full object-cover'
              width={500}
              height={500}
              alt='Victor Profile Image'
            />
          </div>
          <h2 className='text-xl font-bold font-var(--font-oswald) text-center p-2 capitalize'>Victor</h2>
        </div>
        <div className='description bg-gray-200 p-4 rounded-sm z-10 md:w-1/3'>
          <h1 className='text-xl font-bold font-var(--font-oswald) mb-4'>Informe General</h1>
          
          <div className='flex justify-between align-middle items-center p-2 w-full bg-white rounded-md m-2'>
            <h3 className='text-[var(--main-arci)] font-medium'>Procesos Activos</h3>
            <p className="font-bold text-green-600">{processStats.active}</p>
          </div>
          
          <div className='flex justify-between align-middle items-center p-2 w-full bg-white rounded-md m-2'>
            <h3 className='text-[var(--main-arci)] font-medium'>Procesos Pendientes</h3>
            <p className="font-bold text-yellow-600">{processStats.pending}</p>
          </div>
          <div className='flex justify-between align-middle items-center p-2 w-full bg-white rounded-md m-2'>
            <h3 className='text-[var(--main-arci)] font-medium'>Procesos Finalizados</h3>
            <p className="font-bold text-gray-600">{processStats.completed}</p>
          </div>
          <div className='flex justify-between align-middle items-center p-2 w-full bg-white rounded-md m-2'>
            <h3 className='text-[var(--main-arci)] font-medium'>Procesos Archivados</h3>
            <p className="font-bold text-gray-500">{processStats.archived}</p>
          </div>
          <div className='flex justify-between align-middle items-center p-2 w-full bg-[var(--main-arci)] bg-opacity-10 rounded-md m-2 border border-[var(--main-arci)] border-opacity-20'>
            <h3 className='text-[var(--soft-arci)] font-bold'>Total de Procesos</h3>
            <p className="font-bold text-[var(--soft-arci)] text-lg">{processStats.total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
