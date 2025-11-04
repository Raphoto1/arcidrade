# 🏥 ARCIDRADE - Plataforma de Conectividad Médica

**ARCIDRADE** es una plataforma integral que conecta profesionales de la salud con instituciones médicas, facilitando procesos de contratación, gestión de perfiles profesionales y búsqueda de talento en el sector salud.

## 🎯 **Propósito**

ARCIDRADE funciona como un puente digital entre:
- **👨‍⚕️ Profesionales de la Salud** (Doctores, Enfermeros, Farmacéuticos)
- **🏥 Instituciones Médicas** (Hospitales, Clínicas, Centros de Salud)

Permitiendo procesos eficientes de reclutamiento, gestión de perfiles y creación de oportunidades laborales.

---

## 🚀 **Inicio Rápido**

### Requisitos Previos
- Node.js 18+
- PostgreSQL
- Prisma CLI

### Instalación
```bash
# Clonar repositorio
git clone [repo-url]
cd arcidrade

# Instalar dependencias
npm install

# Configurar base de datos
cp .env.example .env
# Configurar DATABASE_URL en .env

# Ejecutar migraciones
npx prisma migrate dev
npx prisma generate

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

---

## 🏗️ **Arquitectura del Sistema**

### **Stack Tecnológico**
- **Frontend:** Next.js 15.5.6, React, TypeScript
- **Styling:** DaisyUI, TailwindCSS
- **Backend:** Next.js API Routes
- **Base de Datos:** PostgreSQL con Prisma ORM
- **Autenticación:** NextAuth.js
- **Estado:** SWR para cache y sincronización
- **Formularios:** React Hook Form

### **Estructura de Usuarios**

#### 👨‍⚕️ **Profesionales de la Salud**
```typescript
enum Sub_area {
  doctor      // Médicos y especialistas
  nurse       // Enfermeros y técnicos
  pharmacist  // Farmacéuticos
}
```

#### 🏥 **Instituciones Médicas**
- Hospitales públicos y privados
- Clínicas especializadas
- Centros de atención primaria
- Instituciones de salud mental

---

## 📂 **Estructura del Proyecto**

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Autenticación
│   │   └── platform/      # Endpoints principales
│   ├── auth/              # Páginas de autenticación
│   ├── platform/          # Área principal de la aplicación
│   └── services/          # Páginas de servicios
├── components/            # Componentes React
│   ├── auth/             # Componentes de autenticación
│   ├── forms/            # Formularios especializados
│   ├── platform/         # Componentes de la plataforma
│   └── pieces/           # Componentes reutilizables
├── controller/           # Lógica de negocio
├── dao/                  # Acceso a datos (Data Access Objects)
├── hooks/                # Hooks personalizados
├── service/              # Servicios de negocio
├── static/               # Datos estáticos y configuraciones
├── types/                # Definiciones de tipos TypeScript
└── utils/                # Utilidades y helpers
```

---

## 🔑 **Funcionalidades Principales**

### **Para Profesionales de la Salud**

#### 📋 **Gestión de Perfil**
- **Datos Personales:** Información completa, foto de perfil
- **Estudio Principal:** Carrera universitaria, institución, fechas
- **Especialidades:** Múltiples especialidades por categoría profesional
- **Certificaciones:** Cursos, diplomados, certificaciones
- **Experiencia Laboral:** Historial profesional detallado

#### 🎯 **Categorización Inteligente**
```typescript
// Especialidades médicas (73 opciones)
medicalOptions: ["Cardiología", "Neurología", "Pediatría", ...]

// Especialidades de enfermería (25 opciones)  
nurseOptions: ["Enfermería Crítica", "Enfermería Pediátrica", ...]

// Especialidades farmacéuticas (4 opciones)
pharmacistOptions: ["Farmacia Hospitalaria", "Industria Farmacéutica", ...]
```

#### 🔍 **Búsqueda de Oportunidades**
- Procesos de selección activos
- Filtrado por especialidad y ubicación
- Postulación directa a procesos

### **Para Instituciones Médicas**

#### 🏥 **Gestión Institucional**
- **Perfil Corporativo:** Información completa de la institución
- **Certificaciones:** Acreditaciones y certificados institucionales
- **Especialidades:** Áreas de atención médica

#### 📊 **Gestión de Procesos de Contratación**
- **Creación de Procesos:** Definición de cargos y requisitos
- **Invitaciones Masivas:** Sistema de invitaciones por CSV
- **Seguimiento:** Estados de proceso (pendiente, activo, archivado)
- **Filtrado de Candidatos:** Por especialidad, experiencia, ubicación

---

## 🗄️ **Modelo de Base de Datos**

### **Entidades Principales**

```prisma
model Auth {
  referCode    String @id @default(cuid())
  email        String @unique
  area         AreasAvailable  // 'profesional' | 'institution'
  status       StatusAvailable // 'active' | 'pending' | 'archived'
  // ... relaciones
}

model Profesional_data {
  user_id     String @unique
  name        String
  last_name   String?
  phone       String?
  birth_date  DateTime?
  country     String
  state       String?
  city        String?
  // ...
}

model Main_study {
  user_id     String @unique
  title       String
  institution String
  sub_area    Sub_area?  // Nueva categorización
  // ...
}

model Study_specialization {
  user_id      String
  title        String
  title_category String
  sub_area     Sub_area?  // Filtrado por categoría
  // ...
}

model Process {
  user_id           String  // Institución creadora
  position          String
  main_speciality   String
  extra_specialities String?
  status            String  // 'pending' | 'active' | 'archived'
  // ...
}
```

### **Enums Importantes**

```prisma
enum AreasAvailable {
  profesional
  institution
}

enum StatusAvailable {
  active
  pending
  archived
}

enum Sub_area {
  doctor
  nurse
  pharmacist
}
```

---

## 🔗 **API Endpoints**

### **Autenticación**
```
POST   /api/auth/signup              # Registro de usuarios
POST   /api/auth/signin              # Inicio de sesión
GET    /api/auth/session             # Información de sesión
```

### **Profesionales**
```
GET    /api/platform/profesional/                    # Datos del profesional
POST   /api/platform/profesional/                    # Crear/actualizar perfil
GET    /api/platform/profesional/all                 # Todos los profesionales
GET    /api/platform/profesional/paginated           # Profesionales paginados
POST   /api/platform/profesional/speciality/         # Crear especialidad
GET    /api/platform/profesional/speciality          # Listar especialidades
PUT    /api/platform/profesional/speciality/[id]     # Actualizar especialidad
DELETE /api/platform/profesional/speciality/[id]     # Eliminar especialidad
```

### **Instituciones**
```
GET    /api/platform/institution/                    # Datos institucionales
POST   /api/platform/institution/                    # Crear/actualizar institución
```

### **Procesos**
```
GET    /api/platform/process/                        # Listar procesos
POST   /api/platform/process/                        # Crear proceso
GET    /api/platform/process/[id]                    # Obtener proceso específico
PUT    /api/platform/process/update                  # Actualizar proceso
POST   /api/platform/process/status                  # Cambiar estado de proceso
```

---

## 🎨 **Componentes Clave**

### **Formularios Inteligentes**
- **`ProfesionalProfileHookForm`** - Perfil con categorización automática
- **`ProfesionalSpecialityForm`** - Especialidades filtradas por `sub_area`
- **`ProcessForm`** - Creación de procesos con validaciones avanzadas

### **Gestión de Estado**
```typescript
// Hooks SWR para sincronización de datos
const { data, mutate } = useProfesional();           // Datos del profesional
const { data } = useProfesionalSpecialities();       // Especialidades
const { data } = useProcesses();                     // Procesos disponibles
const { data } = useAllProfesionals();               // Todos los profesionales
```

### **Componentes de UI**
- **Cards Dinámicas** - Información profesional e institucional
- **Modales Inteligentes** - Formularios con validación en tiempo real
- **Grillas Responsivas** - Listados con filtrado y paginación
- **Sistema de Notificaciones** - Feedback de acciones del usuario

---

## 🛠️ **Características Técnicas Avanzadas**

### **Invalidación Inteligente de Cache**
```typescript
// Sincronización automática entre componentes
const onSubmit = async (data) => {
  const response = await updateProfile(data);
  if (response.ok) {
    await Promise.all([
      mutate(),                                    // Cache local
      globalMutate("/api/platform/profesional/"), // Cache global
      globalMutate("/api/platform/profesional/complete"),
    ]);
  }
};
```

### **Filtrado Dinámico por Categoría**
```typescript
const getSpecialityOptions = () => {
  const currentSubArea = selectedSubArea || subArea;
  switch (currentSubArea) {
    case 'doctor': return medicalOptions;
    case 'nurse': return nurseOptions;
    case 'pharmacist': return pharmacistOptions;
    default: return [];
  }
};
```

### **Sistema de Invitaciones Masivas**
- Carga de archivos CSV
- Validación de emails
- Envío automático de invitaciones
- Seguimiento de respuestas

---

## 🔧 **Scripts de Utilidad**

```bash
# Base de datos
npm run db:migrate          # Ejecutar migraciones
npm run db:generate         # Generar cliente Prisma
npm run db:studio          # Abrir Prisma Studio
npm run db:reset           # Resetear base de datos (desarrollo)

# Desarrollo
npm run dev                # Servidor de desarrollo
npm run build             # Build de producción
npm run start             # Servidor de producción
npm run lint              # Linting del código

# Backups (scripts personalizados)
node backup-database.js    # Crear backup de base de datos
node restore-backup.js     # Restaurar desde backup
```

---

## 🚀 **Deployment**

### **Variables de Entorno**
```env
# Base de datos
DATABASE_URL="postgresql://user:pass@host:port/db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# Email (opcional)
EMAIL_SERVER_USER="your-email@domain.com"
EMAIL_SERVER_PASSWORD="your-password"
EMAIL_SERVER_HOST="smtp.your-provider.com"
EMAIL_SERVER_PORT="587"
EMAIL_FROM="noreply@your-domain.com"
```

### **Consideraciones de Producción**
- Configurar SSL/TLS para base de datos
- Implementar rate limiting en endpoints críticos
- Configurar monitoreo y logs
- Backup automático de base de datos
- CDN para assets estáticos

---

## 📊 **Métricas y Analytics**

La plataforma incluye sistema de analytics para:
- Registro de usuarios por tipo
- Procesos creados y completados
- Especialidades más demandadas
- Ubicaciones con mayor actividad
- Tiempo promedio de contratación

---

## 📝 **Licencia**

Este proyecto está bajo licencia MIT. Ver `LICENSE` para más detalles.

---

## 📞 **Soporte**

Para soporte técnico o consultas sobre ARCIDRADE:
- **Email:** soporte@arcidrade.com
- **Documentación:** [docs.arcidrade.com](https://docs.arcidrade.com)
- **Issues:** [GitHub Issues](https://github.com/owner/arcidrade/issues)

---

**ARCIDRADE** - Conectando talento médico con oportunidades de crecimiento profesional 🏥✨
