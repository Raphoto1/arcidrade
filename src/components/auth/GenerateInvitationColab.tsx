"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useHandleSubmitText } from "@/hooks/useFetch";
import Loading from "@/app/auth/loading";
import { useModal } from "@/context/ModalContext";

export default function GenerateInvitationColab() {
  const { data: session } = useSession();
  const { closeModal } = useModal();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const options = [
    { value: "institution", label: "Institución" },
    { value: "profesional", label: "Profesional" },
    { value: "colab", label: "Colaborador" },
    { value: "campaign", label: "Campaña" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    data.invitation_sender = session?.user.area || "";
    data.invitation_sender_id = session?.user.referCode || "";
    data.invitation_sender_role = session?.user.area || "";
    
    try {
      setIsLoading(true);
      const response = await useHandleSubmitText(data, "/api/auth/register");
      setIsLoading(false);
      alert("Invitación generada satisfactoriamente, por favor revise su correo y siga las Instrucciones");
      form.reset();
      closeModal();
      router.refresh();
    } catch (error) {
      console.error("Creación de Invitacion Fallida, intente con otro Email", error);
      alert("Creación de Invitacion Fallida, intente con otro Email");
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <div className='flex justify-center items-center align-middle h-full p-2 w-full max-w-md'>
      {isLoading && <Loading />}
      <div className='flex-col justify-center h-full bg-gray-200 w-full align-middle items-center rounded-lg p-4'>
        {session?.user.email ? (
          <div className='mb-3'>
            <h1 className='text-sm md:text-base font-semibold'>Correo Autorizado para Enviar Invitación</h1>
            <span className='text-sm'>{session.user.email}</span>
          </div>
        ) : null}
        <h2 className='text-xl md:text-2xl font-bold font-var(--font-oswald) mb-4'>Generar Invitación</h2>
        <form onSubmit={handleSubmit} className='form justify-center align-middle w-full space-y-4'>
          <div className='w-full'>
            <label htmlFor='email' className='block text-sm md:text-base font-medium mb-2'>
              Email
            </label>
            <input type='email' id='email' name='email' required className='input input-bordered w-full' />
          </div>
          <div className='w-full'>
            <label className='block text-sm md:text-base font-medium mb-2'>Área</label>
            <div className='flex flex-col md:flex-row md:flex-wrap gap-2'>
              {options.map((option) => (
                <div key={option.value} className='flex items-center gap-2'>
                  <input type='radio' id={option.value} name='area' value={option.value} className='radio radio-sm md:radio-md' required />
                  <label htmlFor={option.value} className='text-sm md:text-base cursor-pointer'>
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <button className='btn bg-(--soft-arci) w-full text-white'>Generar Invitación</button>
        </form>
      </div>
    </div>
  );
}
