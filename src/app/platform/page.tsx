'use client'
import React from 'react'
import { useSession } from "next-auth/react";

import InstitutionMain from '@/components/platform/institution/InstitutionMain'
import Profesional from '@/components/platform/profesional/Profesional'
import Manager from '@/components/platform/Manager';
import Campaign from '@/components/platform/campaign/Campaign';
import Victor from '@/components/platform/Victor/Victor';

export default function Page() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Cargando sesión...</div>;
  }

  if (!session?.user?.area) {
    return <div>Sesión no válida o usuario sin área definida</div>;
  }

  switch (session.user.area) {
    case 'institution':
      return <InstitutionMain />;
    case 'profesional':
      return <Profesional />;
    case 'manager':
      return <Manager />;
    case 'campaign':
      return <Campaign />;
    case 'victor':
      return <Victor />;
    default:
      return <div>No component found for this user area</div>;
  }
}
