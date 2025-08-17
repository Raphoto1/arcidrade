import React from 'react'

export default function genInvitation() {
  return (
      <div>
          <span>userName autorizado para enviar Invitaciones</span>
          generate Invitation
          <form action="submit">
              <div>
                  <label htmlFor="email">email</label>
                  <input type="text" id="email"/>
              </div>
              <button>Generar Invitación</button>
          </form>
    </div>
  )
}
