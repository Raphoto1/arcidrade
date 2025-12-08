import React, { useMemo, useState } from "react";
import { useSentInvitations } from "@/hooks/useInvitation";
import { useVictorCampaignLeads } from "@/hooks/useVictorCampaign";

export default function InvitationsReport() {
  const [showInvitations, setShowInvitations] = useState(true);
  const [showLeads, setShowLeads] = useState(false);
  const { data: invitationsData, isLoading: invitationsLoading, error: invitationsError } = useSentInvitations("invited");
  const { data: leadsData, isLoading: leadsLoading, error: leadsError } = useVictorCampaignLeads("recent", { limit: 5 });

  // Contar invitaciones por tipo
  const invitationStats = useMemo(() => {
    const invitations = invitationsData?.payload || [];
    const stats = {
      total: invitations.length,
      profesional: 0,
      institution: 0,
      manager: 0,
    };

    invitations.forEach((invitation: any) => {
      const area = invitation.area?.toLowerCase();
      if (area === "profesional") stats.profesional++;
      else if (area === "institution") stats.institution++;
      else if (area === "manager") stats.manager++;
    });

    return stats;
  }, [invitationsData]);

  // Procesar datos de leads
  const leadsStats = useMemo(() => {
    const leads = leadsData?.payload || [];
    
    // Clasificar por status
    const leadsByStatus = {
      sent_invitation: leads.filter((lead: any) => lead.status === 'sent_invitation'),
      sent_subscription: leads.filter((lead: any) => lead.status === 'sent_subscription'),
      others: leads.filter((lead: any) => lead.status && !['sent_invitation', 'sent_subscription'].includes(lead.status))
    };

    return {
      total: leadsData?.total || 0,
      byStatus: {
        sent_invitation: leadsByStatus.sent_invitation.length,
        sent_subscription: leadsByStatus.sent_subscription.length,
        others: leadsByStatus.others.length
      },
      recent: leads.slice(0, 5).map((lead: any) => ({
        id: lead.id,
        email: lead.email,
        status: lead.status,
        createdAt: lead.created_at,
        generatedBy: lead.generated_by || 'Sistema',
        generatedByName: lead.generated_by_name || 'Automático',
        generatedByEmail: lead.generated_by_email,
        generatedByArea: lead.generated_by_area
      })),
      classified: {
        sent_invitation: leadsByStatus.sent_invitation.slice(0, 3).map((lead: any) => ({
          id: lead.id,
          email: lead.email,
          status: lead.status,
          createdAt: lead.created_at,
          generatedByName: lead.generated_by_name || 'Automático',
          generatedByArea: lead.generated_by_area
        })),
        sent_subscription: leadsByStatus.sent_subscription.slice(0, 3).map((lead: any) => ({
          id: lead.id,
          email: lead.email,
          status: lead.status,
          createdAt: lead.created_at,
          generatedByName: lead.generated_by_name || 'Automático',
          generatedByArea: lead.generated_by_area
        }))
      }
    };
  }, [leadsData]);

  return (
    <div className='bg-gray-200 p-4 rounded-sm z-10 w-full h-[400px] flex flex-col'>
      <h1 className='text-lg md:text-xl font-bold font-var(--font-oswald) mb-4 text-center flex-shrink-0'>
        Gestión de Campañas
      </h1>

      {/* Container principal con scroll para todo el contenido de los dropdowns */}
      <div className='flex-1 overflow-y-auto space-y-4 pr-2 min-h-0' style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#9CA3AF #F3F4F6'
      }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            width: 8px;
          }
          div::-webkit-scrollbar-track {
            background: #F3F4F6;
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb {
            background: #9CA3AF;
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: #6B7280;
          }
        `}</style>

        {/* Sección de Invitaciones - Comprimida */}
        <div>
          <div 
            className='flex justify-between items-center p-3 bg-white rounded-md cursor-pointer hover:bg-gray-50 transition-colors'
            onClick={() => setShowInvitations(!showInvitations)}
          >
            <div className='flex items-center gap-2'>
              <h2 className='text-md font-bold text-[var(--main-arci)]'>Invitaciones</h2>
              <span className='badge badge-sm bg-[var(--main-arci)] text-white'>
                {invitationsLoading ? '...' : invitationStats.total}
              </span>
            </div>
            <div className='text-gray-500'>
              {showInvitations ? '↑' : '↓'}
            </div>
          </div>

          {showInvitations && (
            <div className='mt-2 space-y-1'>
              <div className='flex justify-between items-center p-2 bg-white rounded text-sm'>
                <span className='text-gray-600'>Profesionales</span>
                <span className='font-bold text-blue-600'>
                  {invitationsLoading ? '...' : invitationStats.profesional}
                </span>
              </div>
              <div className='flex justify-between items-center p-2 bg-white rounded text-sm'>
                <span className='text-gray-600'>Instituciones</span>
                <span className='font-bold text-green-600'>
                  {invitationsLoading ? '...' : invitationStats.institution}
                </span>
              </div>
              <div className='flex justify-between items-center p-2 bg-white rounded text-sm'>
                <span className='text-gray-600'>Selección</span>
                <span className='font-bold text-purple-600'>
                  {invitationsLoading ? '...' : invitationStats.manager}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Sección de Leads - Comprimida */}
        <div>
          <div 
            className='flex justify-between items-center p-3 bg-white rounded-md cursor-pointer hover:bg-gray-50 transition-colors'
            onClick={() => setShowLeads(!showLeads)}
          >
            <div className='flex items-center gap-2'>
              <h2 className='text-md font-bold text-[var(--main-arci)]'>Leads</h2>
              <span className='badge badge-sm bg-orange-500 text-white'>
                {leadsLoading ? '...' : leadsStats.total}
              </span>
            </div>
            <div className='text-gray-500'>
              {showLeads ? '↑' : '↓'}
            </div>
          </div>

          {showLeads && (
            <div className='mt-2 space-y-3'>
              {/* Estadísticas por Status */}
              <div className='space-y-1'>
                <div className='flex justify-between items-center p-2 bg-white rounded text-sm'>
                  <span className='text-gray-600'>Invitaciones Enviadas</span>
                  <span className='font-bold text-blue-600'>
                    {leadsLoading ? '...' : leadsStats.byStatus.sent_invitation}
                  </span>
                </div>
                <div className='flex justify-between items-center p-2 bg-white rounded text-sm'>
                  <span className='text-gray-600'>Suscripciones Enviadas</span>
                  <span className='font-bold text-green-600'>
                    {leadsLoading ? '...' : leadsStats.byStatus.sent_subscription}
                  </span>
                </div>
                {leadsStats.byStatus.others > 0 && (
                  <div className='flex justify-between items-center p-2 bg-white rounded text-sm'>
                    <span className='text-gray-600'>Otros Estados</span>
                    <span className='font-bold text-gray-600'>
                      {leadsStats.byStatus.others}
                    </span>
                  </div>
                )}
              </div>

              {/* Lista de Invitaciones Enviadas */}
              {leadsStats.classified.sent_invitation.length > 0 && (
                <div>
                  <h4 className='text-sm font-medium text-gray-700 mb-1'>Invitaciones Recientes:</h4>
                  <div className='space-y-1'>
                    {leadsStats.classified.sent_invitation.map((lead: any) => (
                      <div key={lead.id} className='bg-white p-2 rounded border-l-4 border-blue-400'>
                        <div className='flex justify-between items-start'>
                          <div className='flex-1 min-w-0'>
                            <p className='font-medium text-xs truncate'>{lead.email}</p>
                            <div className='flex items-center gap-1 text-xs text-gray-500 mt-1'>
                              <span className='badge badge-xs badge-info'>invitación</span>
                              <span>•</span>
                              <span>{new Date(lead.createdAt).toLocaleDateString('es-ES', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className='text-xs text-gray-400 truncate'>
                              Por: {lead.generatedByName}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lista de Suscripciones Enviadas */}
              {leadsStats.classified.sent_subscription.length > 0 && (
                <div>
                  <h4 className='text-sm font-medium text-gray-700 mb-1'>Suscripciones Recientes:</h4>
                  <div className='space-y-1'>
                    {leadsStats.classified.sent_subscription.map((lead: any) => (
                      <div key={lead.id} className='bg-white p-2 rounded border-l-4 border-green-400'>
                        <div className='flex justify-between items-start'>
                          <div className='flex-1 min-w-0'>
                            <p className='font-medium text-xs truncate'>{lead.email}</p>
                            <div className='flex items-center gap-1 text-xs text-gray-500 mt-1'>
                              <span className='badge badge-xs badge-success'>suscripción</span>
                              <span>•</span>
                              <span>{new Date(lead.createdAt).toLocaleDateString('es-ES', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className='text-xs text-gray-400 truncate'>
                              Por: {lead.generatedByName}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mensaje cuando no hay leads */}
              {leadsLoading ? (
                <div className='flex justify-center p-4'>
                  <span className='loading loading-spinner loading-sm'></span>
                </div>
              ) : leadsError ? (
                <div className='text-error text-center p-4 text-sm'>Error cargando leads</div>
              ) : leadsStats.total === 0 ? (
                <div className='text-gray-500 text-center p-4 text-sm'>No hay leads disponibles</div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}