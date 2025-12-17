import { NextResponse } from "next/server";
import { registerUser, registerLeads, failedMail } from "@/service/register.service";
import { sendInvitationMail } from "@/utils/sendMail";
import { withPrismaRetry } from "@/utils/retryUtils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, area, invitation_sender, invitation_sender_id, invitation_sender_role } = body;
    
    // Perform registration logic with retry on database failures
    const user = await withPrismaRetry(() => 
      registerUser(email, area, invitation_sender, invitation_sender_id)
    );
    
    if (!user) {
      return NextResponse.json({ error: "Creación de Invitacion Fallida, intente con otro Email" }, { status: 500 });
    }
    
    const emailToSend = {
      sendTo: user.email,
      referCode: user.referCode,
    };
    
    const emailSent = await sendInvitationMail(emailToSend);
    
    if (!emailSent) {
      console.log('Email sending failed, registering as failed mail');
      await withPrismaRetry(() => failedMail(email, user.referCode));
    }
    
    if (invitation_sender_role === "campaign") {
      await withPrismaRetry(() => 
        registerLeads(invitation_sender_id, user.email, "sent_subscription")
      );
    }
    
    return NextResponse.json({ message: "Invitación enviada satisfactoriamente" }, { status: 201 });
  } catch (error) {
    console.error('Error in register API:', error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud de invitación" }, 
      { status: 500 }
    );
  }
}
