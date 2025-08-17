import React from 'react'

export default function register() {
  return (
    <div>
          register form
          <form action="">
              <div>
                  <label htmlFor="invitationCote">Codigo de Invitación</label>
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
