import { getAllInstitutionsPaginated } from "@/controller/institutionData.controller";
import { StatusAvailable } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '9', 10);
    const search = searchParams.get('search') || undefined;
    const country = searchParams.get('country') || undefined;
    const specialization = searchParams.get('specialization') || undefined;
    const status = (searchParams.get('status') || 'active') as StatusAvailable;

    // Validar parámetros
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json({ 
        error: "Parámetros inválidos. Page debe ser >= 1, limit debe estar entre 1 y 50" 
      }, { status: 400 });
    }

    const result = await getAllInstitutionsPaginated(page, limit, search, country, specialization, status);
    
    return NextResponse.json({ 
      message: "Instituciones paginadas obtenidas exitosamente", 
      ...result 
    });
  } catch (error) {
    console.error("Error in Institution Paginated API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
