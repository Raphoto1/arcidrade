import { NextResponse } from "next/server";
import { registerUser } from "@/service/register.service";

export async function POST(request: Request) {
    const body = await request.json();
    const { email, area } = body;
    console.log(email, area);
    
  // Perform registration logic here
     const user = await registerUser(email, area);
    console.log("User desde auth", user);
   
  if (!user) {
      return NextResponse.json({ error: 'User registration failed' }, { status: 500 });
  } 
// generar correo de invitacion con el id que se genero en db
    
    
    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
}