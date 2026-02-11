import React from "react";

import SentInvitations from "@/components/platform/Victor/pieces/adminInvitations/SentInvitations";
import ArchivedInvitations from "@/components/platform/Victor/pieces/adminInvitations/ArchivedInvitations";

export default function AdminInvitationsColab() {
  return (
    <div>
      <h2 className='font-bold font-oswald text-xl text-center'>Administrar Invitaciones</h2>
      <div className='grid grid-cols-1  md:grid-cols-2 gap-4 p-4 md:max-h-3/4 max-w-full justify-center'>
        <SentInvitations />
        <ArchivedInvitations />
      </div>
    </div>
  );
}
