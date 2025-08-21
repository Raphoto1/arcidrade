import prisma from "@/utils/db";
import { AreasAvailable } from "@prisma/client";

enum area {
  institution,
  profesional,
  manager,
  collab,
  campaign,
}

export async function registerUser(email: string, area: area, password: string, invitation_sender?:string, invitation_sender_id?:string) {
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
        email: email,
        password: password, // Debes generar o pedir la contraseña
        area: area as AreasAvailable,
        status: "pending_invitation", // Enum válido
        invitation_sender: invitation_sender, // Enum válido
        invitation_sender_id: invitation_sender_id, // O el id real del usuario que invita
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
