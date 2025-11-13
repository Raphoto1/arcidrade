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

      // Victor tiene acceso total a toda la API - bypass todas las validaciones
      if (token.area === 'victor') {
        return NextResponse.next();
      }

      // Rutas de gestión de perfil de profesional (validación prioritaria)
      const profesionalProfileRoutes = [
        '/api/platform/profesional/speciality',
        '/api/platform/profesional/certification', 
        '/api/platform/profesional/complete',
        '/api/platform/profesional/experience'
      ];
      
      if (profesionalProfileRoutes.some(route => pathname.startsWith(route))) {
        const method = req.method;
        
        // GET: Tanto profesionales como instituciones pueden ver datos de perfil
        if (method === 'GET') {
          if (['profesional', 'institution', 'manager', 'victor'].includes(token.area as string)) {
            return NextResponse.next();
          } else {
            return NextResponse.json(
              { error: "No autorizado - Solo profesionales e instituciones pueden ver datos de perfil" },
              { status: 403 }
            );
          }
        }
        
        // POST/PUT/DELETE: Solo profesionales pueden modificar su perfil
        if (['POST', 'PUT', 'DELETE'].includes(method)) {
          if (['profesional', 'manager', 'victor'].includes(token.area as string)) {
            return NextResponse.next();
          } else {
            return NextResponse.json(
              { error: "No autorizado - Solo profesionales pueden gestionar su perfil" },
              { status: 403 }
            );
          }
        }
      }

      // Rutas de solo lectura que instituciones pueden ver de profesionales
      const institutionViewProfesionalRoutes = [
        '/api/platform/profesional/all',
        '/api/platform/profesional/paginated',
        '/api/platform/profesional/', // Ver profesional específico por ID
      ];

      // Rutas donde profesionales pueden ver datos de instituciones y gestionar su perfil
      const profesionalViewRoutes = [
        '/api/platform/institution',   // Ver datos de instituciones
        '/api/platform/profesional/',  // Ver su propio perfil
      ];

      // Rutas donde profesionales pueden aplicar a procesos
      const profesionalApplyRoutes = [
        '/api/platform/process/apply', // Aplicar a procesos
        '/api/platform/process/candidates', // Agregarse como candidato a procesos
      ];

      // Rutas para actualizar status de aplicaciones (solo profesionales)
      const profesionalStatusUpdateRoutes = [
        '/api/platform/process/application/status', // Solo para POST/PUT (actualizar status de aplicaciones)
      ];

      // Rutas de procesos - manejo especial por método HTTP
      const processRoutes = [
        '/api/platform/process'
      ];

      // Ruta específica para candidates (manejo especial)
      const candidatesRoute = '/api/platform/process/candidates';

      // Rutas de status de procesos para consultas (profesionales e instituciones pueden ver)
      const processStatusRoutes = [
        '/api/platform/process/status/'  // Para consultar procesos por status como /status/completed, /status/active, etc.
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

      const isProfesionalStatusUpdateRoute = profesionalStatusUpdateRoutes.some(route => 
        pathname.startsWith(route)
      );

      const isProcessStatusRoute = processStatusRoutes.some(route => 
        pathname.startsWith(route)
      ) || pathname.includes('/api/platform/process/status/'); // Asegurar que incluya rutas como /status/completed

      const isProcessRoute = processRoutes.some(route => 
        pathname === route || (pathname.startsWith(route + '/') && !pathname.includes('/status/') && !pathname.startsWith(candidatesRoute))
      ) && !isProcessStatusRoute && !isProfesionalApplyRoute && !isProfesionalStatusUpdateRoute;

      const isCandidatesRoute = pathname.startsWith(candidatesRoute);

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

      // Validar aplicaciones de profesionales a procesos (solo POST y solo para /api/platform/process/apply)
      if (isProfesionalApplyRoute) {
        const method = req.method;
        // Solo aplicar restricción a POST en rutas que NO sean candidates
        if (method === 'POST' && !pathname.startsWith('/api/platform/process/candidates') && !['profesional', 'manager', 'victor'].includes(token.area as string)) {
          return NextResponse.json(
            { error: "No autorizado - Solo profesionales pueden aplicar a procesos" },
            { status: 403 }
          );
        }
      }

      // Validar actualizaciones de status por profesionales (POST/PUT)
      if (isProfesionalStatusUpdateRoute) {
        const method = req.method;
        if (['POST', 'PUT', 'DELETE'].includes(method)) {
          if (!['profesional', 'manager', 'victor'].includes(token.area as string)) {
            return NextResponse.json(
              { error: "No autorizado - Solo profesionales pueden actualizar status de aplicaciones" },
              { status: 403 }
            );
          }
        }
      }

      // Validar acceso a rutas de status de procesos para consultas (GET)
      if (isProcessStatusRoute) {
        const method = req.method;
        // Para GET, tanto profesionales como instituciones pueden ver
        if (method === 'GET') {
          if (!['profesional', 'institution', 'manager', 'victor'].includes(token.area as string)) {
            return NextResponse.json(
              { error: "No autorizado - Solo profesionales e instituciones pueden ver procesos por status" },
              { status: 403 }
            );
          }
          // Si pasa la validación, permitir el acceso
          return NextResponse.next();
        }
        // Para otros métodos (POST, PUT, DELETE) en rutas de status
        if (['POST', 'PUT', 'DELETE'].includes(method)) {
          if (!['institution', 'manager', 'victor'].includes(token.area as string)) {
            return NextResponse.json(
              { error: "No autorizado - Solo instituciones pueden modificar status de procesos" },
              { status: 403 }
            );
          }
          return NextResponse.next();
        }
      }

      // Validar acceso a rutas de candidates
      if (isCandidatesRoute) {
        const method = req.method;
        
        // GET: Tanto profesionales como instituciones pueden ver candidatos
        if (method === 'GET') {
          if (!['profesional', 'institution', 'manager', 'victor'].includes(token.area as string)) {
            return NextResponse.json(
              { error: "No autorizado - Solo profesionales e instituciones pueden ver candidatos" },
              { status: 403 }
            );
          }
          return NextResponse.next();
        }
        
        // POST: Profesionales pueden agregarse e instituciones pueden agregar otros
        if (method === 'POST') {
          if (!['profesional', 'institution', 'manager', 'victor'].includes(token.area as string)) {
            return NextResponse.json(
              { error: "No autorizado - Solo profesionales e instituciones pueden gestionar candidatos" },
              { status: 403 }
            );
          }
          return NextResponse.next();
        }
        
        // PUT/DELETE: Solo instituciones pueden modificar/eliminar
        if (['PUT', 'DELETE'].includes(method)) {
          if (!['institution', 'manager', 'victor'].includes(token.area as string)) {
            return NextResponse.json(
              { error: "No autorizado - Solo instituciones pueden modificar candidatos" },
              { status: 403 }
            );
          }
          return NextResponse.next();
        }
      }

      // Validar acceso a rutas de procesos (manejo especial por método HTTP)
      if (isProcessRoute) {
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
