import { getInvitationByEmail } from "@/service/invitations.service";
import { sendResetPasswordMail } from "@/utils/sendMail";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 });
    }

    // Verificar que el usuario existe y está registrado
    const user = await getInvitationByEmail(email);
    
    if (!user) {
      return NextResponse.json({ error: "No se encontró una cuenta con este email" }, { status: 404 });
    }

    if (user.status !== "registered" && user.status !== "active") {
      return NextResponse.json({ error: "La cuenta debe estar registrada para cambiar la contraseña" }, { status: 400 });
    }

    // Enviar email con enlace de reset
    const emailToSend = {
      sendTo: user.email,
      referCode: user.referCode,
      type: "reset-password"
    };

    const emailSent = await sendResetPasswordMail(emailToSend);
    
    if (!emailSent) {
      return NextResponse.json({ error: "Error al enviar el email de recuperación" }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "Se ha enviado un enlace de recuperación a tu email",
      success: true 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json({ 
      error: "Error interno del servidor",
      message: error.message 
    }, { status: 500 });
  }
}