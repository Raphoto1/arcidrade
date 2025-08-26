import { NextResponse } from "next/server";
import { registerUser } from "@/service/register.service";
import {sendMail} from "@/utils/sendMail";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, area } = body;
  console.log(email, area);
  // Perform registration logic here
  const user = await registerUser(email, area);
  console.log("User desde auth", user);
  if (!user) {
    return NextResponse.json({ error: "Creación de Invitacion Fallida, intente con otro Email" }, { status: 500 });
  } else {
    const link = `${process.env.PLAT_URL}/completeInvitation/${user.referCode}`;
    // generar correo de invitacion con el id que se genero en db
    const emailToSend = {
      email: 'no_reply@example.com',
      sendTo: user.email,
      subject: "Completa tu registro en la plataforma Arcidrade",
      text: `Hola,\n\nHas sido invitado a unirte a la plataforma Arcidrade. Por favor, haz clic en el siguiente enlace para completar tu registro:\n\n${link}\n\nSi no solicitaste esta invitación, puedes ignorar este correo.\n\nSaludos,\nEl equipo de Arcidrade`
    }
    await sendMail(emailToSend);

    return NextResponse.json({ message: "Invitación enviada satisfactoriamente" }, { status: 201 });
  }
}
