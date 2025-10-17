import { listInvitedInvitationsService, listRegisteredInvitationsService } from "@/service/invitations.service";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

export const listInvitations = async () => {
  const chkUser = await getServerSession(authOptions);
  if (!chkUser) throw new Error("No autorizado");
  if (chkUser.user.area !== "victor") throw new Error("No autorizado");
  const result = await listInvitedInvitationsService();
  return result;
};

export const getInvitationsByStatus = async (status: string) => {
  const chkUser = await getServerSession(authOptions);
  if (!chkUser) throw new Error("No autorizado");
  if (chkUser.user.area !== "victor") throw new Error("No autorizado");
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
