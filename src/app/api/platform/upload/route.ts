import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
  return NextResponse.json({ error: "Ruta no disponible" }, { status: 404 });
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: "Ruta no disponible" }, { status: 404 });
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json({ error: "Ruta no disponible" }, { status: 404 });
}

export async function PUT(): Promise<NextResponse> {
  return NextResponse.json({ error: "Ruta no disponible" }, { status: 404 });
}
