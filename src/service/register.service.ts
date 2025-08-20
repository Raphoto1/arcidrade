import prisma from "@/utils/db";

export async function registerUser(email: string, area: string) {
    console.log("Registering user:", email, area);
try {
    const user = await prisma.auth.create({
      data: {
       email: email,
                password: "temporal123", // Debes generar o pedir la contraseña
                area: area,
                status: "pending_invitation", // Enum válido
                invitation_sender: "victor", // Enum válido
                invitation_sender_id: "system", // O el id real del usuario que invita
      }
    });
      console.log("User creado:", user);
      if (!user) {
        return null;
      }
      return user;
    
} catch (error) {
    console.error("Error registering user:", error);
    return null;
}
}