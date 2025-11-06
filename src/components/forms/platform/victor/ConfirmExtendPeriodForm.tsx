import React, { useState } from 'react'

import { useModal } from '@/context/ModalContext'
import { useAllPendingProcesses } from '@/hooks/useProcess'

export default function ConfirmExtendPeriodForm(props: any) {
  const { closeModal } = useModal();
  const { mutate } = useAllPendingProcesses();
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const periodOptions = [
    { value: 30, label: '30 días', description: 'Extensión corta' },
    { value: 60, label: '60 días', description: 'Extensión media' },
    { value: 90, label: '90 días', description: 'Extensión larga' }
  ];

  const handleExtendPeriod = async () => {
    if (!selectedPeriod) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/platform/process/manage/period/", {
        method: "PUT",
        body: JSON.stringify({ 
          id: props.id,
          extensionDays: selectedPeriod 
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Error en la petición o la información proporcionada");
      }
      
      const result = await response.json();
      closeModal();
      mutate();
    } catch (error) {
      console.error("Error al extender período:", error);
      // Aquí podrías agregar un toast o notificación de error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col justify-center align-middle items-center max-w-md mx-auto p-4'>
      <h1 className='text-2xl fontArci text-center pb-5 text-[var(--main-arci)]'>
        Extender Período del Proceso
      </h1>
      
      <div className='w-full mb-6'>
        <label className='block text-sm font-medium text-gray-700 mb-3'>
          Selecciona el período de extensión:
        </label>
        
        <div className='space-y-3'>
          {periodOptions.map((option) => (
            <label 
              key={option.value}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                selectedPeriod === option.value 
                  ? 'border-[var(--main-arci)] bg-blue-50 ring-2 ring-[var(--main-arci)] ring-opacity-20' 
                  : 'border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="period"
                value={option.value}
                checked={selectedPeriod === option.value}
                onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                className="mr-3 text-[var(--main-arci)] focus:ring-[var(--main-arci)]"
              />
              <div className='flex-1'>
                <div className='font-medium text-gray-900'>{option.label}</div>
                <div className='text-sm text-gray-500'>{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className='flex gap-3 w-full'>
        <button 
          className='btn btn-outline flex-1'
          onClick={closeModal}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        
        <button 
          className='btn bg-[var(--main-arci)] hover:bg-[var(--main-arci)]/90 text-white flex-1 disabled:opacity-50'
          onClick={handleExtendPeriod}
          disabled={isSubmitting || !selectedPeriod}
        >
          {isSubmitting ? (
            <div className='flex items-center gap-2'>
              <div className='loading loading-spinner loading-sm'></div>
              Procesando...
            </div>
          ) : (
            `Extender ${selectedPeriod} días`
          )}
        </button>
      </div>
      
      {props.processTitle && (
        <div className='mt-4 text-center text-sm text-gray-600'>
          Proceso: <span className='font-medium'>{props.processTitle}</span>
        </div>
      )}
    </div>
  )
}
