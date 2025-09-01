import { NextResponse } from "next/server";
import { registerUser } from "@/service/register.service";
import {sendInvitationMail} from "@/utils/sendMail";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, area, invitation_sender, invitation_sender_id } = body;
  console.log(email, area, invitation_sender);
  // Perform registration logic here
  const user = await registerUser(email, area, invitation_sender, invitation_sender_id);
  console.log("User desde auth", user);
  if (!user) {
    return NextResponse.json({ error: "Creación de Invitacion Fallida, intente con otro Email" }, { status: 500 });
  } else {
    const emailToSend = {
      sendTo: user.email,
      referCode: user.referCode
    }
    await sendInvitationMail(emailToSend);

    return NextResponse.json({ message: "Invitación enviada satisfactoriamente" }, { status: 201 });
  }
}
