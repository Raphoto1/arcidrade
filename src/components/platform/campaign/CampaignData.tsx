'use client'
import React from "react";
import { useSession } from "next-auth/react";

import ModalForForm from "../../modals/ModalForForms";
import CampaignDataForm from "@/components/forms/platform/campaign/CampaignDataForm";
import { useCampaignData } from "@/hooks/useCampaign";

export default function CampaignData() {
  const { data: session } = useSession();
  const { data, error, isLoading } = useCampaignData();
  
  // Obtener los datos del payload
  const campaignData = data?.payload;

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:h-auto'>
        <div className='pb-2'>
          <h1 className='text-2xl fontArci text-center'>Información General</h1>
        </div>
        <div className='dataSpace bg-red-50 w-full rounded-sm p-4 mt-2 shadow-xl text-center'>
          <p className='text-red-600'>Error al cargar los datos</p>
          <ModalForForm title='Crear Datos'>
            <CampaignDataForm />
          </ModalForForm>
        </div>
      </div>
    );
  }

  // Si no hay datos, mostrar formulario para crear
  if (!campaignData) {
    return (
      <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:h-auto'>
        <div className='pb-2'>
          <h1 className='text-2xl fontArci text-center'>Información General</h1>
        </div>
        <div className='dataSpace bg-gray-50 w-full rounded-sm p-4 mt-2 shadow-xl text-center'>
          <h2 className='text-bold text-xl mb-4'>No hay datos registrados</h2>
          <p className='text-gray-600 mb-4'>Completa tu información básica para comenzar</p>
          <ModalForForm title='Completar Datos'>
            <CampaignDataForm />
          </ModalForForm>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Información General</h1>
      </div>
      <div className='dataSpace bg-gray-50 w-full rounded-sm p-2 grid mt-2 shadow-xl'>
        <h2 className='text-bold text-xl text-nowrap dataSpaceTitle pl-4'>Datos Personales</h2>
        <div className='w-full'>
          <div className='flex justify-between'>
            <h3 className='font-light'>Nombre</h3>
            <p className='text-(--main-arci)'>{campaignData.name || 'No especificado'}</p>
          </div>
          
          {campaignData.last_name && (
            <div className='flex justify-between'>
              <h3 className='font-light'>Apellido</h3>
              <p className='text-(--main-arci)'>{campaignData.last_name}</p>
            </div>
          )}
          
          <div className='flex justify-between'>
            <h3 className='font-light'>Email</h3>
            <p className='text-(--main-arci)'>{session?.user?.email || 'No especificado'}</p>
          </div>
          
          {campaignData.company && (
            <div className='flex justify-between'>
              <h3 className='font-light'>Empresa</h3>
              <p className='text-(--main-arci)'>{campaignData.company}</p>
            </div>
          )}
          
          {campaignData.role && (
            <div className='flex justify-between'>
              <h3 className='font-light'>Cargo</h3>
              <p className='text-(--main-arci)'>{campaignData.role}</p>
            </div>
          )}
          
          {campaignData.country && (
            <div className='flex justify-between'>
              <h3 className='font-light'>País</h3>
              <p className='text-(--main-arci)'>{campaignData.country}</p>
            </div>
          )}
          
          {campaignData.state && (
            <div className='flex justify-between'>
              <h3 className='font-light'>Estado/Provincia</h3>
              <p className='text-(--main-arci)'>{campaignData.state}</p>
            </div>
          )}
          
          {campaignData.city && (
            <div className='flex justify-between'>
              <h3 className='font-light'>Ciudad</h3>
              <p className='text-(--main-arci)'>{campaignData.city}</p>
            </div>
          )}
          
          <div className='flex justify-between'>
            <h3 className='font-light'>Estado</h3>
            <p className={`${campaignData.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
              {campaignData.status === 'active' ? 'Activo' : campaignData.status || 'Sin especificar'}
            </p>
          </div>
          
          {campaignData.created_at && (
            <div className='flex justify-between'>
              <h3 className='font-light'>Fecha de registro</h3>
              <p className='text-(--main-arci)'>
                {new Date(campaignData.created_at).toLocaleDateString('es-ES')}
              </p>
            </div>
          )}
        </div>
        
        <div className='controles justify-end flex gap-2 mt-4'>
          <ModalForForm title='Modificar Datos'>
            <CampaignDataForm />
          </ModalForForm>
        </div>
      </div>
    </div>
  );
}
