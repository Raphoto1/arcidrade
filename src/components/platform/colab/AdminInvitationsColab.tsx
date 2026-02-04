'use client';
import React from 'react';
import { useSentInvitations } from '@/hooks/useInvitation';

export default function AdminInvitationsColab() {
  const { data: pendingData } = useSentInvitations('pending');
  const { data: acceptedData } = useSentInvitations('accepted');
  const { data: expiredData } = useSentInvitations('expired');

  const pending = pendingData?.payload?.length || 0;
  const accepted = acceptedData?.payload?.length || 0;
  const expired = expiredData?.payload?.length || 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-6">📊 Administrar Invitaciones</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Pendientes</div>
              <div className="stat-value text-warning">{pending}</div>
            </div>
          </div>
          
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Aceptadas</div>
              <div className="stat-value text-success">{accepted}</div>
            </div>
          </div>
          
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Expiradas</div>
              <div className="stat-value text-error">{expired}</div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Invitaciones Pendientes</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Área</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {pendingData?.payload?.slice(0, 10).map((inv: any) => (
                  <tr key={inv.id}>
                    <td className="text-sm">{inv.email}</td>
                    <td className="text-sm">{inv.area}</td>
                    <td className="text-sm">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
