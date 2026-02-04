import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { getInvitationsByStatus } from "@/controller/victor.controller";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        // Verificar que el usuario es Colab
        if (session.user.area !== 'colab') {
            return NextResponse.json(
                { error: "Acceso denegado. Solo Colab puede acceder." },
                { status: 403 }
            );
        }

        const invitationStatus = request.nextUrl.searchParams.get("status");
        const invitationsList = await getInvitationsByStatus(invitationStatus || '');
        return NextResponse.json({ message: 'Successfully fetched invitations', payload: invitationsList });
    } catch (error) {
        console.error("Error getting invitations:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
