import prisma from "@/utils/db";

export const getInvitationById = async (id: string) => {
 const chkInvitations = await prisma.auth.findUnique({
   where: { referCode:id }
 })
  if (chkInvitations) {
    return true
  } else {
    return false
  }
}