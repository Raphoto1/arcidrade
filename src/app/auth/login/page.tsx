import React, { Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import Loading from '../loading'
import { generatePageMetadata } from "@/config/metadata";

// SEO optimizada para la página de login
export const metadata = generatePageMetadata(
  "Iniciar Sesión - Accede a tu Cuenta Profesional",
  "Accede a tu cuenta en Arcidrade para gestionar tu perfil profesional, buscar oportunidades laborales o encontrar talento sanitario para tu institución.",
  [
    "login arcidrade",
    "iniciar sesión",
    "acceso profesional",
    "cuenta sanitaria",
    "login instituciones",
    "acceso plataforma médica",
    "profesionales login",
    "acceso seguro salud"
  ],
  undefined,
  "/auth/login"
);

export default function login() {
  return (
    <div>
      <Suspense fallback={<Loading /> as unknown as React.ReactNode}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
