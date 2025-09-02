'use client'
import React from 'react'
import { useSession } from "next-auth/react";

import Institution from '@/components/platform/Institution'
import Profesional from '@/components/platform/Profesional'
import Manager from '@/components/platform/Manager';
import Campaign from '@/components/platform/Campaign';
import Victor from '@/components/platform/Victor';

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
      return <Institution />;
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