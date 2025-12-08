import { resetPassword, getInvitationById } from "@/service/invitations.service";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// confirmar reset password
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

// actualizar contraseña
export async function POST(request: NextRequest) {
  const id = await request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "Missing invitation ID" }, { status: 400 });
  }
  try {
    const body = await request.json();
    const { password, email } = body;
    
    console.log("Reset password request:", { id, email: email?.substring(0, 3) + "***" });
    
    if (!password || !email) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 });
    }
    
    const updatePassword = await resetPassword(id, email, password);
    return NextResponse.json({ message: "Contraseña actualizada correctamente", updatePassword }, { status: 201 });
  } catch (error: any) {
    console.error("Error in reset password API:", error);
    return NextResponse.json({ 
      message: error.message || "Error al actualizar la contraseña", 
      error: error.message 
    }, { status: 409 });
  }
}