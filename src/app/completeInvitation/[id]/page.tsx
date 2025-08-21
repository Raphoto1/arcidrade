'use client'
import { useState } from 'react'

import { useInvitation } from '@/hooks/useInvitation'

export default async function register({ params }: any) {
    const { id } = params
    const [formData, setFormData] = useState({
        invitationCode: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const invitation = await useInvitation(id);
    if (!invitation) {
        return <div>Error: No invitation found.{ id }</div>
    }
    console.log('Invitation data:', invitation)
  return (
    <div>
          register form
{id}
          <form action="">
              <div className='flex'>
                  <label htmlFor="invitationCode">Codigo de Invitación</label>
                  <input type="text" />
              </div>
              <div>
                  <label htmlFor="email">email</label>
                  <input type="email" />
              </div>
              <div>
                  <label htmlFor="password">Contraseña</label>
                  <input type="password" />
              </div>
              <div>
                  <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                  <input type="password"/>
              </div>
              <div>
                  <button>Confirmar Registro</button>
              </div>
          </form>
    </div>
  )
}
