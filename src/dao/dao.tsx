import prisma from "@/utils/db";
import { encrypt } from "@/utils/encrypter";
import { log } from "console";

export const getInvitationByIdDao = async (id: string) => {
  console.log('Buscando invitación por ID:', id);

  try {
    const chkInvitations = await prisma.auth.findUnique({
      where: { referCode:id }
    })


    return chkInvitations
  } catch (error) {
    console.log('Error al obtener la invitación:', error);
    return null
  }
}

export const getInvitationByEmailDao = async (email: string) => {
  try {
    const chkInvitations = await prisma.auth.findUnique({
      where: { email }
    })
    return chkInvitations
  } catch (error) {
    console.log('Error al obtener la invitación por email:', error);
    return null
  }
}

export const completeInvitationDao = async (id: string, email: string, password: string) => {
  console.log(id, email, password);
  
  try {
    const invitation = await getInvitationByEmailDao(email);
    const invitationIdChk = await getInvitationByIdDao(id);

    console.log('invitation desde dao', invitation?.email);
    console.log('invitationIdChk desde dao', invitationIdChk?.email);

    // Verifica que ambos emails existan y sean iguales
    if (!invitation?.email || !invitationIdChk?.email) {
      throw new Error("El email no concuerda con la invitación.");
    }

      
    const encryptedPass = await encrypt(password);
    const updatedUser = await prisma.auth.update({
      where: { referCode: id },
      data: {
        password: encryptedPass,
        status: "active"
      }
    });
    return true;
  } catch (error) {
    console.log('Error al completar la invitación:', error);
    throw error; // Propaga el error para manejarlo en el endpoint
  }
};
