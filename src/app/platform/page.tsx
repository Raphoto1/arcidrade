'use client'
import React from 'react'
import { useSession } from "next-auth/react";

import Institution from '@/components/platform/Institution'
import Profesional from '@/components/platform/Profesional'
import Manager from '@/components/platform/Manager';
import Campaign from '@/components/platform/Campaign';
import Victor from '@/components/platform/Victor';

export default function page() {
  const { data: session } = useSession();
  return (
    <div>
      { 
      session?.user.area === 'institution' ? (
        <Institution />
      ) : session?.user.area === 'profesional' ? (
        <Profesional />
      ) : session.user.area === 'manager' ? (
        <Manager />
      ) : session?.user.area === 'campaign' ? (
        <Campaign />
      ) : session?.user.area === 'victor' ? (
        <Victor />
      ) : (
        <div>No component found for this user area</div>
      ) }
    </div>
  )
}
