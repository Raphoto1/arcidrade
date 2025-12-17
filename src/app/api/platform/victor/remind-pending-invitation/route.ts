import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/db";
import { sendPendingInvitationReminder } from "@/utils/sendMail";
import { withPrismaRetry } from "@/utils/retryUtils";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Solo Victor/Manager pueden enviar recordatorios de invitación
    if (!session || (session.user.area !== 'manager' && session.user.area !== 'victor')) {
      return NextResponse.json(
        { error: "Acceso denegado" },
        { status: 403 }
      );
    }

    // Obtener usuarios con status 'invited' con retry logic
    const invitedUsers = await withPrismaRetry(() =>
      prisma.auth.findMany({
        where: {
          status: 'invited'
        },
        select: {
          email: true,
          referCode: true,
          area: true
        }
      })
    );

    if (invitedUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No hay usuarios con status 'invited'",
        sent: 0
      });
    }

    // Obtener top 3 procesos activos con retry logic
    const topProcesses = await withPrismaRetry(() =>
      prisma.process.findMany({
        where: {
          status: 'active'
        },
        select: {
          position: true,
          id: true
        },
        orderBy: {
          created_at: 'desc'
        },
        take: 3
      })
    );

    // Enviar emails a cada usuario invitado
    let sentCount = 0;
    const failedEmails: string[] = [];

    for (const user of invitedUsers) {
      try {
        await sendPendingInvitationReminder({
          email: user.email,
          referCode: user.referCode,
          area: user.area,
          topProcesses: topProcesses
        });
        sentCount++;
      } catch (error) {
        console.error(`Error sending email to ${user.email}:`, error);
        failedEmails.push(user.email);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Recordatorios enviados exitosamente`,
      sent: sentCount,
      total: invitedUsers.length,
      failed: failedEmails.length > 0 ? failedEmails : null
    });

  } catch (error) {
    console.error("Error in remind-pending-invitation:", error);
    return NextResponse.json(
      {
        error: "Error al enviar recordatorios",
        message: error instanceof Error ? error.message : "Error desconocido"
      },
      { status: 500 }
    );
  }
}
