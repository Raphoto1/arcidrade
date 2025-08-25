import { completeInvitation, getInvitationById } from "@/service/invitations.service";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// confirmar invitacion enviada CHECK
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params; // <-- Usa await aquí
  const invitation = await getInvitationById(id);
  if (!invitation) {
    return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
  }
  return NextResponse.json(invitation, { status: 200 });
}

// actualizar pass de invitacion
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { password, email } = body;
    const updatePassword = await completeInvitation(id, email, password);
    console.log('updatePassword desde route invitations', updatePassword);
    return NextResponse.json({ message: 'Invitación procesada', updatePassword }, { status: 201 });
    
  } catch (error:any) {
    return NextResponse.json({ message: error.messaage, error }, { status: 409 });
  }
}
