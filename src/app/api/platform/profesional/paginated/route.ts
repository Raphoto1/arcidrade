import { getAllProfesionalsPaginated } from "@/controller/userData.controller";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '9', 10);
    const search = searchParams.get('search') || undefined;
    const speciality = searchParams.get('speciality') || undefined;
    const subArea = searchParams.get('subArea') || undefined;
    const status = searchParams.get('status') || 'active'; // Por defecto 'active'
    const homologatedAny = searchParams.get('homologatedAny') === 'true';

    const isExport = searchParams.get('export') === 'true';
    const maxLimit = isExport ? 1000 : 50;

    // Validar parámetros
    if (page < 1 || limit < 1 || limit > maxLimit) {
      return NextResponse.json({ 
        error: `Parámetros inválidos. Page debe ser >= 1, limit debe estar entre 1 y ${maxLimit}` 
      }, { status: 400 });
    }

    const result = await getAllProfesionalsPaginated(page, limit, search, speciality, subArea, status, homologatedAny);
    
    return NextResponse.json({ 
      message: "Profesionales paginados obtenidos exitosamente", 
      ...result 
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
