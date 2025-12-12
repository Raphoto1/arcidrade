import ConfirmResendInvitationForm from '@/components/forms/platform/victor/ConfirmResendInvitationForm';
import ModalForFormsGreenBtn from '@/components/modals/ModalForFormsGreenBtn';
import ModalForFormsRedBtn from '@/components/modals/ModalForFormsRedBtn';
import ConfirmDeleteUserInvitationForm from '@/components/forms/platform/victor/ConfirmDeleteUserInvitationForm';
import { formatDateToString } from '@/hooks/useUtils'
import React from 'react'

interface InvitationData {
  id: string;
  email: string;
  area: string;
  creation_date: string;
  referCode: string;
  status?: string;
}

interface InvitationPillProps {
  invitationData: InvitationData;
  onMutate?: () => any;
}

export default function InvitationPill({ invitationData, onMutate }: InvitationPillProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/completeInvitation/${invitationData.referCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className='w-full h-auto bg-white rounded-md flex flex-col'>
      <div className='w-full h-auto flex'>
        <div className='flex flex-col align-middle justify-center w-2/3 p-1'>
          <h3 className='text-(--main-arci) text-bold text-nowrap font-bold'>{invitationData.email}</h3>
          <div className='flex'>
            <p className='text-sm text-gray-600 w-100'>Tipo de Invitación:</p>
            <p className='font-light text-[var(--main-arci)]'>{invitationData.area}</p>
          </div>
          <div className='flex'>
            <p className='text-sm text-gray-600 w-100'>Fecha de Envio:</p>
            <p className='font-light text-[var(--main-arci)]'>{formatDateToString(invitationData.creation_date)}</p>
          </div>
          <div className='flex'>
            <p className='text-sm text-gray-600 w-100'>Codigo Enviado:</p>
            <p className='font-light text-[var(--main-arci)]'>{invitationData.referCode}</p>
          </div>
          <div className='flex'>
            <p className='text-sm text-gray-600 w-100'>Estado:</p>
            <p className='font-light text-[var(--main-arci)]'>{invitationData.status || 'Pendiente'}</p>
          </div>
        </div>
        <div className='w-1/3 p-1 flex flex-col gap-2'>
          {/* <button className='btn bg-warning w-full text-white h-auto '>Pausar Invitación</button>
          <button className='btn bg-[var(--orange-arci)] w-full text-white h-auto '>Archivar</button> */}
          <button 
            className='btn bg-[var(--main-arci)] hover:bg-[var(--soft-arci)] w-full text-white h-auto text-xs'
            onClick={handleCopyUrl}
          >
            {copied ? '✓ Copiado!' : '📋 Copiar URL de completar suscripción'}
          </button>
          <ModalForFormsGreenBtn title='Reenviar Invitación'>
            <ConfirmResendInvitationForm id={invitationData.referCode} email={invitationData.email} />
          </ModalForFormsGreenBtn>
          <ModalForFormsRedBtn title='Eliminar Invitación'>
            <ConfirmDeleteUserInvitationForm userId={invitationData.referCode} userEmail={invitationData.email} onMutate={onMutate} />
          </ModalForFormsRedBtn>
        </div>
      </div>
    </div>
  )
}
