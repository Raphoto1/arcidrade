'use client'
import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useHandleSubmitText } from "@/hooks/useFetch";
import Loading from "@/app/auth/loading";
export default function GenerateInvitation() {
    const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showResendForm, setShowResendForm] = React.useState(false);
  const [resendEmail, setResendEmail] = React.useState('');
  const [isResending, setIsResending] = React.useState(false);
  const [alert, setAlert] = React.useState<{ type: 'success' | 'error' | 'warning' | null; message: string }>({ type: null, message: '' });
  const options = [
    { value: "institution", label: "Institución" },
    { value: "profesional", label: "Profesional" },
    // { value: "manager", label: "Reclutador" },
  ];

  const showAlert = (type: 'success' | 'error' | 'warning', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: null, message: '' }), 5000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    data.invitation_sender = session?.user.area || '';
    data.invitation_sender_id = session?.user.referCode || '';
    data.invitation_sender_role = session?.user.area || '';
    try {
      setIsLoading(true);
      const response = await useHandleSubmitText(data, "/api/auth/register");
      setIsLoading(false);
      const successMessage = session?.user.area === 'campaign' 
        ? "Invitación generada satisfactoriamente, por favor revise su correo y siga las Instrucciones, si no lo encuentra revise en su carpeta de spam"
        : "Email de verificación enviado satisfactoriamente, por favor revise su correo y siga las Instrucciones, si no lo encuentra revise en su carpeta de spam";
      showAlert('success', successMessage);
      form.reset();
      router.refresh()
    } catch (error: any) {
      console.error("Creación de Invitacion Fallida:", error);
      const errorMessage = error?.message || "Creación de Invitacion Fallida, intente con otro Email";
      showAlert('error', errorMessage);
      setIsLoading(false);
    }

  };

  const handleResendInvitation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resendEmail.trim()) {
      showAlert('warning', 'Por favor ingrese un email');
      return;
    }

    try {
      setIsResending(true);
      const response = await fetch('/api/auth/resend-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resendEmail }),
      });

      if (response.ok) {
        const resendMessage = session?.user.area === 'campaign' 
          ? 'Invitación reenviada exitosamente, revisa también en tu carpeta de spam'
          : 'Email de verificación reenviado exitosamente, revisa también en tu carpeta de spam';
        showAlert('success', resendMessage);
        setResendEmail('');
        setShowResendForm(false);
      } else {
        const error = await response.json();
        showAlert('error', error.message || 'Error al reenviar invitación');
      }
    } catch (error) {
      console.error('Error al reenviar invitación:', error);
      showAlert('error', 'Error al reenviar invitación');
    } finally {
      setIsResending(false);
    }
  };
  return (
    <div className='flex w-full justify-center items-center min-h-[calc(100vh-200px)] py-8'>
      <div className='flex flex-col justify-center items-center p-2 max-w-sm md:max-w-xl w-full gap-4'>
        {/* Alert DaisyUI */}
        {alert.type && (
          <div className={`alert ${
            alert.type === 'success' ? 'alert-success' : 
            alert.type === 'error' ? 'alert-error' : 
            'alert-warning'
          } shadow-lg w-full`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              {alert.type === 'success' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
              {alert.type === 'error' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />}
              {alert.type === 'warning' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />}
            </svg>
            <span>{alert.message}</span>
          </div>
        )}

        {isLoading && <Loading />}
        <div className='flex-col justify-center h-full bg-gray-200 w-full align-middle items-center rounded-sm p-4'>
        { session?.user.email ?<div><h1>Correo Autorizado para Enviar Invitación</h1><span>{session.user.email}</span></div> : null }
        <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>{session?.user.area === 'campaign' ? 'Generar Invitación' : 'Verificar Email'}</h2>
        
        {/* Mensaje explicativo solo para usuarios no-campaign */}
        {session?.user.area !== 'campaign' && (
          <div className='mb-4 p-3 bg-blue-50 border-l-4 border-[var(--main-arci)] rounded'>
            <p className='text-sm text-gray-700'>
              <strong>📧 Verificación requerida:</strong> Para completar tu suscripción necesitamos verificar tu email, 
              ya que será nuestro principal canal de comunicación para enviarte notificaciones importantes, 
              actualizaciones de procesos y oportunidades.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='form justify-center align-middle'>
          <div className="md:grid md:w-full md:h-full grid">
            <label htmlFor='email' className="font-">Email</label>
            <input type='email' id='email' name='email' required/>
          </div>
          <div className='md:grid md:items-center md:gap-1 md:pb-4'>
            <label htmlFor='area'>Area</label>
            <div className="md:flex md:gap-1">
              {options.map((option) => (
                <div key={option.value} className="gap-2">
                  <input type='radio' id={option.value} name='area' value={option.value} className="mr-1" required/>
                  <label htmlFor={option.value} className="color-var(--soft-arci)">{option.label}</label>
                </div>
              ))}
            </div>
          </div>
          <button 
            className='btn btn-wide bg-[var(--main-arci)] text-white hover:bg-[var(--soft-arci)] font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105'
            type='submit'
          >
            {session?.user.area === 'campaign' ? '📧 Generar Invitación' : '📧 Verificar Email'}
          </button>
        </form>

        {/* Botón para mostrar formulario de reenvío */}
        <div className='mt-6 pt-6 border-t border-gray-300'>
          <button
            className='btn btn-outline btn-wide text-[var(--main-arci)] border-[var(--main-arci)] hover:bg-[var(--main-arci)] hover:text-white'
            onClick={() => setShowResendForm(!showResendForm)}
          >
            🔄 {showResendForm ? 'Cancelar Reenvío' : (session?.user.area === 'campaign' ? 'Reenviar Invitación' : 'Reenviar Email de Verificación')}
          </button>
        </div>

        {/* Formulario de reenvío */}
        {showResendForm && (
          <div className='mt-4 p-4 bg-blue-50 rounded-lg'>
            <h3 className='text-lg font-semibold mb-3 text-[var(--main-arci)]'>{session?.user.area === 'campaign' ? 'Reenviar Invitación' : 'Reenviar Email de Verificación'}</h3>
            <form onSubmit={handleResendInvitation} className='flex flex-col gap-3'>
              <div>
                <label htmlFor='resendEmail' className='block mb-1 font-medium'>
                  Email del invitado
                </label>
                <input
                  type='email'
                  id='resendEmail'
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder='ejemplo@email.com'
                  className='input input-bordered w-full'
                  required
                />
                <p className='text-xs text-gray-600 mt-1'>
                  Ingrese el email al que se envió la invitación original
                </p>
              </div>
              <button
                type='submit'
                className='btn bg-[var(--soft-arci)] text-white hover:bg-[var(--main-arci)] disabled:opacity-50'
                disabled={isResending}
              >
                {isResending ? (
                  <div className='flex items-center gap-2'>
                    <div className='loading loading-spinner loading-sm'></div>
                    Reenviando...
                  </div>
                ) : (
                  '📨 Reenviar Email'
                )}
              </button>
            </form>
          </div>
        )}

        </div>
      </div>
    </div>
  );
}
