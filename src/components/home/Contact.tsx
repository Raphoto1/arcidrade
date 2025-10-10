"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { companyInfo } from "@/static/data/staticData";
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el mensaje");
      }

      const result = await response.json();
      console.log("Mensaje enviado exitosamente:", result);
        
      setSubmitStatus("success");
      reset();
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      setSubmitStatus("error");
    } finally {
        setIsLoading(false);
        
    }
  };

  return (
    <div className='flex justify-center items-center p-2'>
      <div className='w-full max-w-2xl bg-gray-100 rounded-md p-6'>
        <div className='mb-6'>
          <h2 className='text-2xl fontArci text-[var(--main-arci)] text-center mb-2'>Contáctanos</h2>
          <p className='text-center text-gray-600 fontRoboto'>Estamos aquí para ayudarte. Envíanos tu consulta y te responderemos pronto.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid md:grid-cols-2 gap-4'>
            {/* Nombre */}
            <div>
              <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                Nombre completo *
              </label>
              <input
                type='text'
                id='name'
                {...register("name", {
                  required: "El nombre es requerido",
                  minLength: { value: 2, message: "El nombre debe tener al menos 2 caracteres" },
                })}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--main-arci)] focus:border-transparent'
                placeholder='Tu nombre completo'
              />
              {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                Correo electrónico *
              </label>
              <input
                type='email'
                id='email'
                {...register("email", {
                  required: "El email es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido",
                  },
                })}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--main-arci)] focus:border-transparent'
                placeholder='tu@email.com'
              />
              {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
            </div>
          </div>

          <div className='grid md:grid-cols-2 gap-4'>
            {/* Teléfono */}
            <div>
              <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-1'>
                Teléfono (opcional)
              </label>
              <input
                type='tel'
                id='phone'
                {...register("phone")}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--main-arci)] focus:border-transparent'
                placeholder='+1 234 567 8900'
              />
            </div>

            {/* Asunto */}
            <div>
              <label htmlFor='subject' className='block text-sm font-medium text-gray-700 mb-1'>
                Asunto *
              </label>
              <select
                id='subject'
                {...register("subject", { required: "El asunto es requerido" })}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--main-arci)] focus:border-transparent'>
                <option value=''>Selecciona un asunto</option>
                <option value='informacion-general'>Información general</option>
                <option value='soporte-tecnico'>Soporte técnico</option>
                <option value='registro-profesional'>Registro como profesional</option>
                <option value='registro-institucion'>Registro como institución</option>
                <option value='colaboracion'>Oportunidades de colaboración</option>
                <option value='otro'>Otro</option>
              </select>
              {errors.subject && <p className='text-red-500 text-sm mt-1'>{errors.subject.message}</p>}
            </div>
          </div>

          {/* Mensaje */}
          <div>
            <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-1'>
              Mensaje *
            </label>
            <textarea
              id='message'
              rows={5}
              {...register("message", {
                required: "El mensaje es requerido",
                minLength: { value: 10, message: "El mensaje debe tener al menos 10 caracteres" },
              })}
              className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--main-arci)] focus:border-transparent resize-vertical text-black'
              placeholder='Escribe tu mensaje aquí...'
            />
            {errors.message && <p className='text-red-500 text-sm mt-1'>{errors.message.message}</p>}
          </div>

          {/* Mensajes de estado */}
          {submitStatus === "success" && (
            <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'>¡Mensaje enviado exitosamente! Te responderemos pronto.</div>
          )}

          {submitStatus === "error" && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
              Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.
            </div>
          )}

          {/* Botones */}
          <div className='flex gap-3 justify-center pt-4'>
            <button
              type='submit'
              disabled={isLoading}
              className={`btn h-10 px-6 text-white text-center flex items-center ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[var(--main-arci)] hover:bg-[var(--soft-arci)]"
              }`}>
              {isLoading ? (
                <>
                  <svg className='animate-spin -ml-1 mr-3 h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                "Enviar mensaje"
              )}
            </button>

            <button type='button' onClick={() => reset()} className='btn bg-gray-500 hover:bg-gray-600 text-white h-10 px-6'>
              Limpiar
            </button>
          </div>
        </form>

        {/* Información adicional */}
        <div className='mt-8 pt-6 border-t border-gray-300 flex flex-col'>
          <div className='grid md:grid-cols-2 gap-4 text-center'>
            <div>
              <h3 className='font-semibold text-[var(--main-arci)] mb-2'>Email</h3>
              <p className='text-gray-600 text-sm'>contacto@arcidrade.com</p>
            </div>

            <div>
              <h3 className='font-semibold text-[var(--main-arci)] mb-2'>Horario</h3>
              <p className='text-gray-600 text-sm'>Lun-Vie: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h3 className='font-semibold text-[var(--main-arci)] mb-2'>Teléfono</h3>
            <div className='flex flex-col items-center text-gray-600 '>
              <p>{companyInfo.address}</p>
              <p>{companyInfo.phone1}</p>
              <p>{companyInfo.phone2}</p>
              <p>
                Representante:
                {companyInfo.representative}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
