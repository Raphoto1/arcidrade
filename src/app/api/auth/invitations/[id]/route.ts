import { completeInvitation, getInvitationById } from "@/service/invitations.service";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// confirmar invitacion enviada CHECK
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params; // <-- Usa await aquí
  console.log('id desde route invitations', id);
  const invitation = await getInvitationById(id);
  console.log('invitation desde route invitations', invitation);
  if (!invitation) {
    return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
  }
  return NextResponse.json(invitation, { status: 200 });
}

// actualizar pass de invitacion
export async function POST(  request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  const body = await request.json();
  console.log("Invitación recibida:", body);

  // Aquí puedes manejar la lógica para aceptar o rechazar la invitación
  const { password } = body;
  console.log('password desde route invitations', password);

  //USAR BCRYPT PARA CONTRASEÑA OJO
  // Aquí puedes agregar la lógica para actualizar la contraseña de la invitación
  const updatePassword = await completeInvitation(id, password);
  console.log('updatePassword desde route invitations', updatePassword);
  return NextResponse.json({ message: 'Invitación procesada', updatePassword }, { status: 200 });
}
