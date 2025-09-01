import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useHandleSubmitText } from "@/hooks/useFetch";
import Loading from "@/app/auth/loading";
export default function GenerateInvitation() {
    const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const options = [
    { value: "institution", label: "Institución" },
    { value: "profesional", label: "Profesional" },
    { value: "manager", label: "Reclutador" },
  ];
console.log(session);

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

    try {
      setIsLoading(true);
      const response = await useHandleSubmitText(data, "/api/auth/register");
      console.log(response);
      setIsLoading(false);
      alert("Invitación generada satisfactoriamente");
      router.refresh()
    } catch (error) {
      console.error("Creación de Invitacion Fallida, intente con otro Email", error);
      alert("Creación de Invitacion Fallida, intente con otro Email");
      setIsLoading(false);
      router.refresh();
    }

  };
  return (

    <div className='flex justify-center items-center align-middle h-full p-2 max-w-sm md:max-w-xl'>
      {isLoading && <Loading />}
      <div className='flex-col justify-center h-full bg-gray-200 w-full align-middle items-center rounded-sm p-4'>
        { session?.user.email ?<div><h1>Correo Autorizado para Enviar Invitación</h1><span>{session.user.email}</span></div> : null }
        <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>Generate Invitation</h2>
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
          <button className='btn bg-[var(--soft-arci)]'>Generar Invitación</button>
        </form>
      </div>
    </div>
  );
}
