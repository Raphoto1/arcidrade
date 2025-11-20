import React, { useState, useMemo } from "react";
import { useCampaignLeads } from "@/hooks/useCampaign";
import ModalForFormsGreenBtn from "@/components/modals/ModalForFormsGreenBtn";
import ConfirmResendLeadInvitation from "@/components/forms/platform/campaign/ConfirmResendLeadInvitation";
import GenerateSingleInvitation from "@/components/forms/platform/victor/GenerateSingleInvitation";

interface Lead {
  id: number | string;
  email: string;
  nombre?: string;
  apellido?: string;
  status: string;
  campaign_id: string;
  created_at: string;
  updated_at: string;
}

export default function CampaignListLeads() {
  const { data, error, isLoading, mutate } = useCampaignLeads();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Procesar los leads por status
  const leadsByStatus = useMemo(() => {
    if (!data?.payload || !Array.isArray(data.payload)) return {};

    const leads: Lead[] = data.payload;
    const grouped = leads.reduce((acc: { [key: string]: Lead[] }, lead: Lead) => {
      // Validar que el lead tenga las propiedades necesarias
      if (!lead || typeof lead !== "object") return acc;

      const status = lead.status || "unknown";
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(lead);
      return acc;
    }, {});

    return grouped;
  }, [data]);

  // Obtener estadísticas
  const stats = useMemo(() => {
    const leads: Lead[] = data?.payload || [];
    return {
      total: leads.length,
      sent_invitation: leadsByStatus["sent_invitation"]?.length || 0,
      sent_subscription: leadsByStatus["sent_subscription"]?.length || 0,
      sent: leadsByStatus["sent"]?.length || 0,
      unknown: leadsByStatus["unknown"]?.length || 0,
    };
  }, [leadsByStatus, data]);

  // Obtener las tabs disponibles
  const availableTabs = useMemo(() => {
    const tabs = ["all"];
    Object.keys(leadsByStatus).forEach((status) => {
      if (leadsByStatus[status].length > 0) {
        tabs.push(status);
      }
    });
    return tabs;
  }, [leadsByStatus]);

  // Obtener leads para la tab activa y aplicar filtro de búsqueda
  const currentLeads = useMemo(() => {
    let leads: Lead[] = [];
    
    if (activeTab === "all") {
      leads = data?.payload || [];
    } else {
      leads = leadsByStatus[activeTab] || [];
    }

    // Filtrar por búsqueda si hay query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      leads = leads.filter((lead) => 
        lead.email.toLowerCase().includes(query) ||
        lead.nombre?.toLowerCase().includes(query) ||
        lead.apellido?.toLowerCase().includes(query)
      );
    }

    return leads;
  }, [activeTab, leadsByStatus, data, searchQuery]);

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.warn("Error formatting date:", dateString, error);
      return "Fecha inválida";
    }
  };

  // Función para obtener el color del status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent_invitation":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "sent_subscription":
        return "bg-green-100 text-green-700 border border-green-200";
      case "sent":
        return "bg-slate-100 text-slate-700 border border-slate-200";
      default:
        return "bg-amber-100 text-amber-700 border border-amber-200";
    }
  };

  // Función para obtener el label del status
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "sent_invitation":
        return "Invitación al Sitio";
      case "sent_subscription":
        return "Suscripción Completa";
      case "sent":
        return "Enviado";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
        <div className='pb-2'>
          <h1 className='text-2xl fontArci text-center'>📊 Leads Generados</h1>
        </div>
        <div className='bg-white w-full h-auto p-6 rounded-lg'>
          <div className='flex flex-col justify-center items-center py-16'>
            <div className='relative'>
              <div className='loading loading-spinner loading-lg text-[var(--main-arci)]'></div>
            </div>
            <span className='mt-4 text-lg font-medium text-[var(--dark-gray)] fontRoboto'>Cargando tus leads...</span>
            <span className='mt-1 text-sm text-[var(--dark-gray)]'>Esto puede tomar unos segundos</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
        <div className='pb-2'>
          <h1 className='text-2xl fontArci text-center'>📊 Leads Generados</h1>
        </div>
        <div className='bg-white w-full h-auto p-6 rounded-lg'>
          <div className='bg-red-50 border border-red-200 rounded-xl p-6 text-center'>
            <div className='text-[var(--orange-arci)] mb-4'>
              <svg className='mx-auto h-12 w-12' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-[var(--orange-arci)] mb-2 fontArci'>Error al cargar leads</h3>
            <p className='text-[var(--dark-gray)] mb-4 fontRoboto'>No se pudieron cargar los leads. Por favor, verifica tu conexión e intenta de nuevo.</p>
            <button onClick={() => mutate()} className='btn bg-[var(--orange-arci)] hover:bg-[var(--orange-arci)]/90 text-white transition-all duration-200'>
              <svg className='w-4 h-4 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                />
              </svg>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>📊 Leads Generados</h1>
      </div>

      <div className='bg-white w-full h-auto rounded-sm p-4 shadow-xl'>
        {/* Estadísticas Compactas */}
        <div className='bg-[var(--main-arci)] p-3 text-white rounded-sm mb-4'>
          <h2 className='text-lg font-semibold mb-2 fontArci text-center'>📊 Resumen</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
            <div className='bg-white/20 backdrop-blur-sm p-2 rounded text-center hover:bg-white/30 transition-all duration-200'>
              <div className='text-lg font-bold text-white fontArci'>{stats.total}</div>
              <div className='text-xs text-white/90 fontRoboto'>📈 Total</div>
            </div>
            <div className='bg-white/20 backdrop-blur-sm p-2 rounded text-center hover:bg-white/30 transition-all duration-200'>
              <div className='text-lg font-bold text-white fontArci'>{stats.sent_invitation}</div>
              <div className='text-xs text-white/90 fontRoboto'>🌐 Sitio</div>
            </div>
            <div className='bg-white/20 backdrop-blur-sm p-2 rounded text-center hover:bg-white/30 transition-all duration-200'>
              <div className='text-lg font-bold text-white fontArci'>{stats.sent_subscription}</div>
              <div className='text-xs text-white/90 fontRoboto'>✅ Registro</div>
            </div>
            <div className='bg-white/20 backdrop-blur-sm p-2 rounded text-center hover:bg-white/30 transition-all duration-200'>
              <div className='text-lg font-bold text-white fontArci'>{stats.sent}</div>
              <div className='text-xs text-white/90 fontRoboto'>📋 Otros</div>
            </div>
          </div>
        </div>

        {/* Buscador y Filtros */}
        <div className='bg-[var(--soft-arci)] p-3 rounded-sm mb-4'>
          {/* Campo de búsqueda */}
          <div className='mb-3'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Buscar por email, nombre o apellido...'
                className='input input-bordered w-full bg-white text-[var(--main-arci)] border-[var(--main-arci)]/20 focus:border-[var(--main-arci)] fontRoboto pr-10'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--main-arci)]/40 hover:text-[var(--main-arci)] transition-colors'
                  title='Limpiar búsqueda'>
                  <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              ) : (
                <svg
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--main-arci)]/40'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
              )}
            </div>
          </div>

          {/* Dropdown de filtro por status */}
          <div className='flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between'>
            <label htmlFor='status-filter' className='text-sm font-medium text-[var(--main-arci)] fontArci'>
              Filtrar por Status:
            </label>
            <select
              id='status-filter'
              className='select select-bordered w-full sm:w-auto min-w-48 bg-white text-[var(--main-arci)] border-[var(--main-arci)]/20 focus:border-[var(--main-arci)] fontRoboto'
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}>
              {availableTabs.map((tab) => (
                <option key={tab} value={tab} className='fontRoboto'>
                  {tab === "all" && "📊 Todos"}
                  {tab === "sent_invitation" && "🌐 Invitaciones al Sitio"}
                  {tab === "sent_subscription" && "✅ Suscripciones Completas"}
                  {tab === "sent" && "📋 Otros Envíos"}
                  {tab === "unknown" && "❓ Estado Desconocido"} ({tab === "all" ? stats.total : leadsByStatus[tab]?.length || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Resumen rápido del filtro actual */}
          <div className='mt-2 text-xs text-[var(--dark-gray)] fontRoboto'>
            {searchQuery ? (
              <>
                Mostrando {currentLeads.length} {currentLeads.length === 1 ? "resultado" : "resultados"} para "{searchQuery}"
                {activeTab !== "all" && ` en ${getStatusLabel(activeTab)}`}
              </>
            ) : activeTab === "all" ? (
              `Mostrando todos los ${stats.total} leads generados`
            ) : (
              `Mostrando ${currentLeads.length} leads con status "${getStatusLabel(activeTab)}"`
            )}
          </div>
        </div>

        {/* Lista de Leads en formato Pills */}
        <div className=''>
          {currentLeads.length === 0 ? (
            <div className='text-center py-16'>
              <div className='text-[var(--dark-gray)] mb-4'>
                <svg className='mx-auto h-20 w-20' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1}
                    d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-6m-10 0h6'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-[var(--main-arci)] mb-2 fontArci'>No hay leads disponibles</h3>
              <p className='text-[var(--dark-gray)] max-w-md mx-auto fontRoboto'>
                {searchQuery
                  ? `No se encontraron resultados para "${searchQuery}"`
                  : activeTab === "all"
                  ? "Aún no has generado ningún lead. Comienza enviando invitaciones para ver tus contactos aquí."
                  : `No se encontraron leads con el status "${getStatusLabel(activeTab)}".`}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className='btn btn-sm bg-[var(--main-arci)] hover:bg-[var(--main-arci)]/90 text-white mt-4'>
                  Limpiar búsqueda
                </button>
              )}
              {activeTab === "all" && (
                <ModalForFormsGreenBtn title='➕ Enviar Invitaciones'>
                  <GenerateSingleInvitation />
                </ModalForFormsGreenBtn>
              )}
            </div>
          ) : (
            <>
              <div className='flex justify-between items-center mb-3'>
                <h3 className='text-lg font-semibold text-[var(--main-arci)] fontArci'>
                  {activeTab === "all" ? "Todos los Leads" : `Leads - ${getStatusLabel(activeTab)}`}
                  <span className='text-sm font-normal text-[var(--dark-gray)] ml-2 fontRoboto'>
                    ({currentLeads.length} {currentLeads.length === 1 ? "resultado" : "resultados"})
                  </span>
                </h3>
                <button
                  onClick={() => mutate()}
                  className='btn btn-ghost btn-sm text-[var(--dark-gray)] hover:text-[var(--main-arci)]'
                  title='Actualizar leads'>
                  <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                    />
                  </svg>
                </button>
              </div>

              <div className='flex flex-col gap-2'>
                {currentLeads.map((lead: Lead, index: number) => (
                  <div
                    key={`lead-${lead.id || index}-${lead.email}`}
                    className='w-full h-auto bg-white rounded-md flex flex-col shadow-sm border border-[var(--soft-arci)]/50'>
                    <div className='w-full h-auto flex'>
                      <div className='flex flex-col align-middle justify-center w-2/3 p-2'>
                        <div className='flex items-center space-x-2 mb-1'>
                          <div className='avatar placeholder'>
                            <div className='bg-[var(--main-arci)] text-white rounded-full w-6 h-6 flex items-center justify-center'>
                              <span className='text-xs font-semibold fontArci'>
                                {lead.nombre ? lead.nombre.charAt(0).toUpperCase() : lead.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className='min-w-0 flex-1'>
                            {(lead.nombre || lead.apellido) && (
                              <h3 className='text-[var(--main-arci)] text-sm font-bold truncate fontArci'>
                                {[lead.nombre, lead.apellido].filter(Boolean).join(" ")}
                              </h3>
                            )}
                            <p
                              className={`text-xs ${
                                lead.nombre || lead.apellido ? "text-[var(--dark-gray)]" : "text-[var(--main-arci)] font-bold"
                              } truncate fontRoboto`}>
                              {lead.email}
                            </p>
                          </div>
                        </div>

                        <div className='space-y-1'>
                          <div className='flex items-center gap-1'>
                            <p className='text-xs text-[var(--dark-gray)] min-w-0 fontRoboto'>Status:</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
                              {lead.status === "sent_invitation" && "🌐"}
                              {lead.status === "sent_subscription" && "✅"}
                              {lead.status === "sent" && "📋"}
                              {!["sent_invitation", "sent_subscription", "sent"].includes(lead.status) && "❓"}
                              <span className='ml-1'>{getStatusLabel(lead.status)}</span>
                            </span>
                          </div>
                          <div className='flex'>
                            <p className='text-xs text-[var(--dark-gray)] fontRoboto'>Fecha:</p>
                            <p className='font-light text-[var(--main-arci)] text-xs ml-1 fontRoboto'>
                              {lead.created_at ? formatDate(lead.created_at).split(",")[0] : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className='w-1/3 p-2 flex flex-col justify-center'>
                        <ModalForFormsGreenBtn title='🔄 Reenviar'>
                          <ConfirmResendLeadInvitation
                            leadId={String(lead.id)}
                            email={lead.email}
                            nombre={lead.nombre}
                            apellido={lead.apellido}
                            status={lead.status}
                            onResendSuccess={() => {
                              // Actualizar la lista de leads después del reenvío
                              mutate();
                            }}
                          />
                        </ModalForFormsGreenBtn>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Información adicional */}
        <div className='bg-[var(--soft-arci)]/50 p-4 rounded-sm mt-4'>
          <h4 className='font-semibold text-[var(--main-arci)] mb-3 text-sm fontArci text-center'>Información sobre los Status</h4>
          <div className='space-y-3 text-sm'>
            <div className='bg-white p-3 rounded border border-[var(--soft-arci)]'>
              <div className='flex items-start gap-3'>
                <div className='w-6 h-6 rounded-full bg-[var(--main-arci)]/20 flex items-center justify-center text-[var(--main-arci)] text-xs font-bold mt-0.5'>
                  🌐
                </div>
                <div>
                  <div className='font-semibold text-[var(--main-arci)] text-sm fontRoboto'>Invitación al Sitio</div>
                  <div className='text-[var(--dark-gray)] text-xs mt-1 fontRoboto'>
                    Solo invitación para visitar el sitio web, sin crear cuenta automáticamente.
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-white p-3 rounded border border-[var(--soft-arci)]'>
              <div className='flex items-start gap-3'>
                <div className='w-6 h-6 rounded-full bg-[var(--green-arci)]/20 flex items-center justify-center text-[var(--green-arci)] text-xs font-bold mt-0.5'>
                  ✅
                </div>
                <div>
                  <div className='font-semibold text-[var(--main-arci)] text-sm fontRoboto'>Suscripción Completa</div>
                  <div className='text-[var(--dark-gray)] text-xs mt-1 fontRoboto'>Registro completo en la plataforma con acceso total.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
