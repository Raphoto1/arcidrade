import { NextResponse } from "next/server";
import { registerDirectUser } from "@/service/register.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, nombre, sub_area, accountType, institutionName } = body;

    // Validaciones básicas
    if (!email || !password || !accountType) {
      return NextResponse.json(
        { error: "Email, contraseña y tipo de cuenta son requeridos" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Validaciones según tipo de cuenta
    if (accountType === 'institution') {
      if (!institutionName) {
        return NextResponse.json(
          { error: "El nombre de la institución es requerido" },
          { status: 400 }
        );
      }
    } else {
      // Validaciones para profesional
      if (!nombre || !sub_area) {
        return NextResponse.json(
          { error: "Nombre y categoría profesional son requeridos" },
          { status: 400 }
        );
      }
    }

    // Registrar usuario
    const user = await registerDirectUser(
      email, 
      password, 
      nombre, 
      sub_area, 
      accountType,
      institutionName
    );

    if (!user) {
      return NextResponse.json(
        { error: "Error al crear la cuenta. El email podría estar en uso" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Cuenta creada exitosamente", userId: user.referCode },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error en registro directo:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear cuenta" },
      { status: 500 }
    );
  }
}
