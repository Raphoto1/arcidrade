import prisma from "@/utils/db";
import { AreasAvailable, SenderNum, StatusAvailable } from "@prisma/client";

enum area {
  institution,
  profesional,
  manager,
  collab,
  campaign,
}

export async function registerUser(email: string, area: string, password?: string, invitation_sender?:string, invitation_sender_id?:string) {
  console.log("Registering user:", email, area);
  // revisar el sender para saber si es un extender
  if (invitation_sender && invitation_sender_id === '' || null) {
    invitation_sender = 'external'
    invitation_sender_id = 'external'
  }

  // encryptar pass
  try {
    const user = await prisma.auth.create({
      data: {
        email: email as string,
        area: area as AreasAvailable,
        status: "invited" as StatusAvailable, // Enum válido
        password : "" as string,
        invitation_sender: invitation_sender as SenderNum || 'external', // Enum válido
        invitation_sender_id: invitation_sender_id || 'external', // O el id real del usuario que invita
      },
    });
    console.log("User creado:", user);
    if (!user) {
      return null;
    }
    return true;
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
}
