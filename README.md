This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

---

# Plataforma de Gestión de Procesos

## Descripción

Esta plataforma permite la gestión de procesos profesionales (por ejemplo, médicos o institucionales). Los usuarios pueden crear, actualizar, listar y archivar procesos, cada uno con información relevante como cargo, especialidad principal, especialidades extras, fechas, estado, tipo de proceso y descripción.

## Tecnologías

- **Frontend:** React, DaisyUI, react-icons, SWR
- **Backend:** Next.js API Routes
- **ORM:** Prisma

## Estructura de Carpetas

- `/src/components/`  
  Componentes de la interfaz, como formularios, cards y modales.
- `/src/hooks/`  
  Hooks personalizados para consumir la API y manejar el estado.
- `/src/controller/`  
  Lógica de negocio y controladores para los procesos.
- `/src/dao/`  
  Acceso a datos usando Prisma.
- `/src/app/api/`  
  Rutas API de Next.js para operaciones CRUD.

## Principales Hooks

- `useProcesses`: Obtiene todos los procesos.
- `useActiveProcesses`: Obtiene procesos con estado "active".
- `usePendingProcesses`: Obtiene procesos con estado "pending".
- `useArchivedProcesses`: Obtiene procesos con estado "archived".
- `useProcess(processId)`: Obtiene un proceso por su ID.

## Hooks personalizados

En la carpeta `/src/hooks/` se encuentran los siguientes hooks para consumir la API y manejar el estado de los procesos:

- **useProcesses**  
  Obtiene todos los procesos registrados en la plataforma.

- **useActiveProcesses**  
  Obtiene los procesos con estado "active".

- **usePendingProcesses**  
  Obtiene los procesos con estado "pending".

- **useArchivedProcesses**  
  Obtiene los procesos con estado "archived".

- **useProcess(processId)**  
  Obtiene la información de un proceso específico por su ID.

- **useCalcDates(start_date, approval_date)**  
  Calcula el plazo y los días restantes de un proceso según su fecha de inicio y aprobación.

- **useHandleSubmitText(payload, endpoint)**  
  Realiza peticiones POST para crear o actualizar procesos.

---

Estos hooks utilizan SWR para el manejo eficiente de datos y revalidación automática en el frontend.

## Componentes Clave

- **ProcessBasic:** Muestra información básica de un proceso.
- **CreateProcessForm / UpdateProcessForm:** Formularios para crear y actualizar procesos.
- **ActiveProcess / PendingProcess:** Listados de procesos activos y pendientes, con opción de desplegar/ocultar usando DaisyUI.

## Endpoints API

A continuación se listan los endpoints disponibles en la carpeta `/src/app/api/`.  
**Los endpoints marcados con 🔒 están protegidos por middleware y requieren autenticación.**

- `GET /api/platform/process/`  
  Lista todos los procesos. 🔒

- `GET /api/platform/process/status/[status]`  
  Lista procesos por estado (`active`, `pending`, `archived`). 🔒

- `GET /api/platform/process/[id]`  
  Obtiene un proceso por ID. 🔒

- `POST /api/platform/process/`  
  Crea un proceso. 🔒

- `POST /api/platform/process/update`  
  Actualiza un proceso existente. 🔒

- `POST /api/platform/process/status`  
  Actualiza el estado de un proceso. 🔒

- `GET /api/platform/ping`  
  Endpoint público para verificar la conexión con la API. (No protegido)

---

**Notas:**
- Todos los endpoints relacionados con procesos están protegidos por el middleware de autenticación, por lo que solo usuarios autenticados pueden acceder.
- El endpoint `/api/platform/ping` es público y puede usarse para pruebas de conexión.
- Los endpoints usan Next.js API Routes y Prisma para la gestión de datos.

## Modelos Principales

- **Process:**  
  - id, position, main_speciality, extra_specialities, start_date, approval_date, end_date, profesional_status, description, type, status, user_id, created_at, updated_at

- **ExtraSpeciality:**  
  - id, process_id, speciality

## Flujo Básico

1. El usuario puede crear un proceso desde el formulario.
2. Los procesos se listan y pueden filtrarse por estado.
3. Cada proceso puede ser editado, archivado o eliminado.
4. Las especialidades extras se gestionan dinámicamente en los formularios.

## Notas

- Los componentes usan DaisyUI para estilos y react-icons para iconografía.
- Los hooks usan SWR para manejo de datos y revalidación automática.
- Prisma gestiona la persistencia y relaciones entre procesos y especialidades.

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
