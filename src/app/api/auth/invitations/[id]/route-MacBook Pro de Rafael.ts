import { completeInvitation, getInvitationById } from "@/service/invitations.service";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// confirmar invitación enviada
export async function GET(request: NextRequest) {
  const id = await request.nextUrl.pathname.split("/").pop(); // extrae el [id] de la URL
  if (!id) {
    return NextResponse.json({ error: "Missing invitation ID" }, { status: 400 });
  }
  const invitation = await getInvitationById(id);
  if (!invitation) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }
  return NextResponse.json(invitation, { status: 200 });
}

// actualizar pass de invitación
export async function POST(request: NextRequest) {
  const id = await request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "Missing invitation ID" }, { status: 400 });
  }
  try {
    const body = await request.json();
    const { password, email } = body;
    const updatePassword = await completeInvitation(id, email, password);
    return NextResponse.json({ message: "Invitación procesada", updatePassword }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message, error }, { status: 409 });
  }
}
