import { NextResponse } from "next/server";
import { registerUser, registerLeads, failedMail } from "@/service/register.service";
import { sendInvitationMail } from "@/utils/sendMail";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, area, invitation_sender, invitation_sender_id, invitation_sender_role } = body;
  console.log(email, area, invitation_sender);
  // Perform registration logic here
  const user = await registerUser(email, area, invitation_sender, invitation_sender_id);
  console.log("User desde auth", user);
  if (!user) {
    return NextResponse.json({ error: "Creación de Invitacion Fallida, intente con otro Email" }, { status: 500 });
  } else {
    const emailToSend = {
      sendTo: user.email,
      referCode: user.referCode,
    };
    const emailSent = await sendInvitationMail(emailToSend);
    if (!emailSent) {
      console.log('no se enviia mail');
      const failMail = await failedMail(email, user.referCode);
      console.error('failMail', failMail);
    }
    if (invitation_sender_role === "campaign") {
      const lead = await registerLeads(invitation_sender_id, user.email);
    }
    return NextResponse.json({ message: "Invitación enviada satisfactoriamente" }, { status: 201 });
  }
}
