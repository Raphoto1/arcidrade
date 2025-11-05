import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Si es una ruta de API
    if (pathname.startsWith('/api/platform')) {
      // Verificar que el usuario esté autenticado
      if (!token) {
        return NextResponse.json(
          { error: "No autorizado - Autenticación requerida" },
          { status: 401 }
        );
      }

      // Verificar que el usuario tenga un área válida
      if (!token?.area || !['profesional', 'institution', 'manager', 'collab', 'campaign', 'victor'].includes(token.area as string)) {
        return NextResponse.json(
          { error: "No autorizado - Área de usuario inválida" },
          { status: 403 }
        );
      }

      // Rutas de solo lectura que instituciones pueden ver de profesionales
      const institutionViewProfesionalRoutes = [
        '/api/platform/profesional/all',
        '/api/platform/profesional/paginated',
        '/api/platform/profesional/', // Ver profesional específico por ID
      ];

      // Rutas donde profesionales pueden ver procesos e instituciones
      const profesionalViewRoutes = [
        '/api/platform/process',        // Ver procesos disponibles
        '/api/platform/institution',   // Ver datos de instituciones
        '/api/platform/profesional/',  // Ver su propio perfil
      ];

      // Rutas donde profesionales pueden aplicar a procesos
      const profesionalApplyRoutes = [
        '/api/platform/process/apply', // Aplicar a procesos
        '/api/platform/process/status', // Actualizar estado de aplicación
      ];

      // Rutas de gestión que solo instituciones/managers pueden modificar
      const institutionManagementRoutes = [
        '/api/platform/process' // Solo si es POST/PUT/DELETE para crear/modificar procesos
      ];

      // Rutas específicas para campaign y managers
      const campaignRoutes = [
        '/api/platform/campaign',
        '/api/platform/leads'
      ];

      // Rutas específicas para managers y víctor (administración)
      const managerRoutes = [
        '/api/platform/analytics',
        '/api/platform/admin'
      ];

      const isInstitutionViewRoute = institutionViewProfesionalRoutes.some(route => 
        pathname.startsWith(route)
      );

      const isProfesionalViewRoute = profesionalViewRoutes.some(route => 
        pathname.startsWith(route)
      );

      const isProfesionalApplyRoute = profesionalApplyRoutes.some(route => 
        pathname.startsWith(route)
      );

      const isInstitutionManagementRoute = institutionManagementRoutes.some(route => 
        pathname.startsWith(route)
      );

      const isCampaignRoute = campaignRoutes.some(route => 
        pathname.startsWith(route)
      );

      const isManagerRoute = managerRoutes.some(route => 
        pathname.startsWith(route)
      );

      // Validar acceso a visualización de profesionales (instituciones pueden ver)
      if (isInstitutionViewRoute && !['institution', 'manager', 'victor'].includes(token.area as string)) {
        return NextResponse.json(
          { error: "No autorizado - Solo instituciones pueden ver datos de profesionales" },
          { status: 403 }
        );
      }

      // Validar acceso para que profesionales vean procesos e instituciones
      if (isProfesionalViewRoute) {
        const method = req.method;
        
        // GET: Profesionales e instituciones pueden ver
        if (method === 'GET') {
          if (!['profesional', 'institution', 'manager', 'victor'].includes(token.area as string)) {
            return NextResponse.json(
              { error: "No autorizado - Solo profesionales e instituciones pueden ver esta información" },
              { status: 403 }
            );
          }
        }
      }

      // Validar aplicaciones de profesionales a procesos
      if (isProfesionalApplyRoute && !['profesional', 'manager', 'victor'].includes(token.area as string)) {
        return NextResponse.json(
          { error: "No autorizado - Solo profesionales pueden aplicar a procesos" },
          { status: 403 }
        );
      }

      // Validar acceso a procesos (profesionales pueden ver, instituciones pueden gestionar)
      if (isInstitutionManagementRoute) {
        const method = req.method;
        
        // GET: Tanto profesionales como instituciones pueden ver
        if (method === 'GET') {
          if (!['profesional', 'institution', 'manager', 'victor'].includes(token.area as string)) {
            return NextResponse.json(
              { error: "No autorizado - Solo profesionales e instituciones pueden ver procesos" },
              { status: 403 }
            );
          }
        }
        
        // POST/PUT/DELETE: Solo instituciones pueden modificar
        if (['POST', 'PUT', 'DELETE'].includes(method)) {
          if (!['institution', 'manager', 'victor'].includes(token.area as string)) {
            return NextResponse.json(
              { error: "No autorizado - Solo instituciones pueden gestionar procesos" },
              { status: 403 }
            );
          }
        }
      }

      // Validar acceso a rutas de campaña
      if (isCampaignRoute && !['campaign', 'manager', 'victor'].includes(token.area as string)) {
        return NextResponse.json(
          { error: "No autorizado - Solo usuarios de campaña y managers pueden acceder a esta ruta" },
          { status: 403 }
        );
      }

      // Validar acceso a rutas de manager
      if (isManagerRoute && !['manager', 'victor'].includes(token.area as string)) {
        return NextResponse.json(
          { error: "No autorizado - Solo managers pueden acceder a esta ruta" },
          { status: 403 }
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Para rutas del frontend /platform, requiere token
        if (pathname.startsWith('/platform')) {
          return !!token;
        }

        // Para rutas de API /api/platform, requiere token
        if (pathname.startsWith('/api/platform')) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = { 
  matcher: [
    "/platform/:path*",      // Protege todas las rutas del frontend
    "/api/platform/:path*",  // Protege todas las rutas de API
    "/api/upload/:path*"     // Protege rutas de upload
  ] 
};
