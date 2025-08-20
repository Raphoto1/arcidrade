'use client'
import React from 'react'
import { useRef } from 'react'
import { useHandleSubmitText } from '@/hooks/useFetch'

export default function genInvitation() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const response = await useHandleSubmitText(data, '/api/auth/register');
      console.log(response);
      alert('Invitation generated successfully');
    } catch (error) {
      console.error('Error generating invitation:', error);
      alert('Failed to generate invitation');
    }
  }
  return (
      <div>
          <span>userName autorizado para enviar Invitaciones</span>
          generate Invitation
          <form onSubmit={handleSubmit}>
              <div>
                  <label htmlFor="email">email</label>
                  <input type="email" id="email" name="email"/>
        </div>
        <div>
                  <label htmlFor="area">Area</label>
                  <input type="text" id="area" name="area"/>
              </div>
              <button>Generar Invitación</button>
          </form>
    </div>
  )
}
