import { listInvitedInvitationsService, listRegisteredInvitationsService } from "@/service/invitations.service";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";
import { updateUserStatusByIdService } from "../service/userData.service";
import { updateInstitutionDataService } from "@/service/institutionData.service";
import { updateUserDataByIdService } from "@/service/userData.service";


export const listInvitations = async () => {
  const chkUser = await getServerSession(authOptions);
  if (!chkUser) throw new Error("No autorizado");
  if (chkUser.user.area !== "victor" && chkUser.user.area !== "colab") throw new Error("No autorizado");
  const result = await listInvitedInvitationsService();
  return result;
};

export const getInvitationsByStatus = async (status: string) => {
  const chkUser = await getServerSession(authOptions);
  if (!chkUser) throw new Error("No autorizado");
  if (chkUser.user.area !== "victor" && chkUser.user.area !== "colab") throw new Error("No autorizado");
  switch (status) {
    case "invited":
      // Lógica para obtener invitaciones pendientes
      const resultInvited = await listInvitedInvitationsService();
      return resultInvited;
      break;
    case "registered":
      const resultRegistered = await listRegisteredInvitationsService();
      return resultRegistered;
      // Lógica para obtener invitaciones registradas
      break;
    default:
      break;
  }
};

// Función para obtener todos los leads de campaña con filtros
export const getAllCampaignLeads = async (filters: {
  area?: string | null;
  status?: string | null;
  limit?: number;
  page?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}) => {
  const chkUser = await getServerSession(authOptions);
  if (!chkUser) throw new Error("No autorizado");
  if (chkUser.user.area !== "victor" && chkUser.user.area !== "colab") throw new Error("No autorizado");

  const {
    status,
    limit = 10,
    page = 1,
    orderBy = "created_at",
    order = "desc"
  } = filters;

  try {
    // Construir where clause para Leads_send
    const whereClause: any = {};
    if (status) whereClause.status = status;

    // Obtener leads con información del usuario que los generó
    const leads = await prisma.leads_send.findMany({
      where: whereClause,
      include: {
        auth: {
          select: {
            referCode: true,
            email: true,
            area: true
          }
        }
      },
      orderBy: {
        created_at: order as "asc" | "desc"
      },
      ...(limit && {
        take: limit,
        skip: (page - 1) * limit
      })
    });

    // Obtener total de registros para paginación
    const total = await prisma.leads_send.count({
      where: whereClause
    });

    // Transformar datos para incluir información del generador
    const transformedLeads = leads.map(lead => ({
      id: lead.id,
      email: lead.email,
      campaign_id: lead.campaign_id,
      status: lead.status,
      created_at: lead.created_at,
      updated_at: lead.updated_at,
      generated_by: lead.user_id,
      generated_by_name: (lead as any).auth?.email || 'Sistema', // Email completo en lugar de split
      generated_by_email: (lead as any).auth?.email || null,
      generated_by_area: (lead as any).auth?.area || null
    }));

    return {
      leads: transformedLeads,
      total
    };

  } catch (error) {
    console.error("Error en getAllCampaignLeads:", error);
    throw new Error("Error al obtener leads de campaña");
  }
};

// Función para obtener estadísticas de leads de campaña
export const getCampaignLeadsStats = async () => {
  const chkUser = await getServerSession(authOptions);
  if (!chkUser) throw new Error("No autorizado");
  if (chkUser.user.area !== "victor" && chkUser.user.area !== "colab") throw new Error("No autorizado");

  try {
    // Estadísticas por estado
    const statsByStatus = await prisma.leads_send.groupBy({
      by: ['status'],
      _count: {
        id: true
      },
      where: {
        status: {
          not: null
        }
      }
    });

    // Total de leads
    const totalLeads = await prisma.leads_send.count();

    // Leads por mes (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const leadsByMonth = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as count
      FROM "Leads_send" 
      WHERE created_at >= ${sixMonthsAgo}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `;

    // Top generadores de leads
    const topGenerators = await prisma.$queryRaw`
      SELECT 
        a.email as generator_email,
        a.area as generator_area,
        COUNT(ls.id) as leads_generated
      FROM "Leads_send" ls
      LEFT JOIN "Auth" a ON ls.user_id = a."referCode"
      WHERE ls.user_id IS NOT NULL
      GROUP BY a.email, a.area
      ORDER BY leads_generated DESC
      LIMIT 10
    `;

    return {
      total: totalLeads,
      byStatus: statsByStatus,
      byMonth: leadsByMonth,
      topGenerators
    };

  } catch (error) {
    console.error("Error en getCampaignLeadsStats:", error);
    throw new Error("Error al obtener estadísticas de leads");
  }
};

export const desactivateUser = async (id: string) => {
  const chkUser = await getServerSession(authOptions);
  if (!chkUser) throw new Error("No autorizado");
  if (chkUser.user.area !== "victor" && chkUser.user.area !== "colab") throw new Error("No autorizado");
  try {
    const result = await updateUserStatusByIdService('desactivated', id);
    return result;
    //cambiar statuus en auth a desactivated
  } catch (error) {
    console.error("Error desactivating user:", error);
    throw new Error("Error al desactivar el usuario");
  }
}

export const activateUser = async (id: string) => {
  const chkUser = await getServerSession(authOptions);
  if (!chkUser) throw new Error("No autorizado");
  if (chkUser.user.area !== "victor" && chkUser.user.area !== "colab") throw new Error("No autorizado");
  try {
    const result = await updateUserStatusByIdService('active', id);
    return result;
    //cambiar statuus en auth a desactivated
  } catch (error) {
    console.error("Error activating user:", error);
    throw new Error("Error al activar el usuario");
  }
}

export const deleteUser = async (id: string) => {
  const chkUser = await getServerSession(authOptions);
  if (!chkUser) throw new Error("No autorizado");
  if (chkUser.user.area !== "victor" && chkUser.user.area !== "colab") throw new Error("No autorizado");
  try {
    // Eliminar el usuario de Auth - con CASCADE se eliminarán todos los datos relacionados
    const result = await prisma.auth.delete({
      where: {
        referCode: id
      }
    });
    return { success: true, message: "Usuario eliminado correctamente" };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Error al eliminar el usuario");
  }
}

export const updateUserDescription = async (id: string, area: string, description: string) => {
  const chkUser = await getServerSession(authOptions);
  if (!chkUser) throw new Error("No autorizado");
  switch (area) {
    case 'institution':
      const resultAdmin = await updateInstitutionDataService({ description: description }, id);
      return resultAdmin;
      break;
    case 'profesional':
      const resultProf = await updateUserDataByIdService({ description: description },id);
      return resultProf;
      break;
    default:
      throw new Error("Área no válida");
  }
}