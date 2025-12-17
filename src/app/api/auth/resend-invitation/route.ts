import { NextResponse } from "next/server";
import { sendInvitationMail } from "@/utils/sendMail";
import prisma from "@/utils/db";
import { withPrismaRetry } from "@/utils/retryUtils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email es requerido" },
        { status: 400 }
      );
    }

    // Buscar el usuario por email con retry logic
    const user = await withPrismaRetry(() =>
      prisma.auth.findFirst({
        where: {
          email: email.toLowerCase().trim(),
          status: "invited" // Solo reenviar a usuarios invitados
        },
      })
    );

    if (!user) {
      return NextResponse.json(
        { message: "No se encontró una invitación pendiente para este email" },
        { status: 404 }
      );
    }

    // Reenviar el email de invitación
    const emailToSend = {
      sendTo: user.email,
      referCode: user.referCode,
    };

    const emailSent = await sendInvitationMail(emailToSend);

    if (!emailSent) {
      return NextResponse.json(
        { message: "Error al enviar el email de invitación" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Invitación reenviada exitosamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error al reenviar invitación:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
