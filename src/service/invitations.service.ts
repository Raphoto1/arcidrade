import prisma from "@/utils/db";

export const getInvitationById = async (id: string) => {
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

export const completeInvitation = async (id: string, password: string) => {
  try {
    console.log('Completing invitation for ID:', id);
    console.log('New password:', password);

    const updatedUser = await prisma.auth.update({
      where: { referCode: id },
      data: {
        password: password,
        status: "active"
      }
    });
    console.log('updatePassword desde service invitations', updatedUser);

    return updatedUser;
  } catch (error) {
    console.log('Error al completar la invitación:', error);
    return null;
  }
};
