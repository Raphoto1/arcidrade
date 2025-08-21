import prisma from "@/utils/db";

export const getInvitationById = async (id: string) => {
    console.log('Fetching invitation with ID:', id);

 const chkInvitations = await prisma.auth.findUnique({
   where: { referCode:id }
 })
 return chkInvitations
}