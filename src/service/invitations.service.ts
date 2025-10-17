import prisma from "@/utils/db";
import { encrypt } from "@/utils/encrypter";

import { getInvitationByIdDao, getInvitationByEmailDao, completeInvitationDao, listInvitedUsersDao, listRegisteredUsersDao } from "@/dao/dao";
import { sendInvitationMail } from "@/utils/sendMail";
import { failedMail } from "./register.service";

export const getInvitationById = async (id: string) => {
  try {
    const chkInvitations = await getInvitationByIdDao(id);
    return chkInvitations;
  } catch (error) {
    console.log("Error al obtener la invitación:", error);
    return null;
  }
};

export const getInvitationByEmail = async (email: string) => {
  try {
    const chkInvitations = await getInvitationByEmailDao(email);
    return chkInvitations;
  } catch (error) {
    console.log("Error al obtener la invitación por email:", error);
    return null;
  }
};

export const completeInvitation = async (id: string, email: string, password: string) => {
  try {
    const result = await completeInvitationDao(id, email, password);
    return result;
  } catch (error) {
    console.log("Error al completar la invitación:", error);
    throw error;
  }
};

export const resendInvitation = async (id: string) => {
  try {
    const invitation = await getInvitationByIdDao(id);
    if (!invitation) {
      throw new Error("Invitation not found");
    }
    console.log("invitation", invitation);
    const emailToSend = {
      sendTo: invitation.email,
      referCode: invitation.referCode,
    };
    const emailSent = await sendInvitationMail(emailToSend);
    if (!emailSent) {
      const failMail = await failedMail(invitation.email, invitation.referCode);
      console.error("failMail", failMail);
      throw new Error("Failed to resend invitation email");
    }
    // Aquí puedes agregar la lógica para reenviar la invitación
    return { success: true };
  } catch (error) {
    console.log("Error al reenviar la invitación:", error);
    throw error;
  }
};

export const listInvitedInvitationsService = async () => {
  const result = await listInvitedUsersDao();
  return result;
};

export const listRegisteredInvitationsService = async () => {
  const result = await listRegisteredUsersDao();
  return result;
};
