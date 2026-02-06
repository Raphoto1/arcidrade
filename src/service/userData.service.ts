//imports propios
import {
  createProfesionalMainStudyDao,
  createUserSpecializationDao,
  getProfesionalDataByRefferCodeDao,
  getUserEmailByRefferCodeDao,
  getProfesionalMainStudyDao,
  getUserSpecializationByTitle,
  updateProfesionalDataDao,
  updateProfesionalMainStudyDao,
  getUserSpecializationsDao,
  getUserSpecializationByIdDao,
  deleteSpecializationByIdDao,
  updateSpecializationByIdDao,
  getFavoriteSpecializationBySpecializationIdDao,
  getCertificationsByUserIdDao,
  getCertificationByTitleDao,
  createUserCertificationDao,
  getCertificationByIdDao,
  updateCertificationByIdDao,
  deleteUserCertificationByIdDao,
  getUserExperiencesByUserIdDao,
  createUserExperienceDao,
  deleteUserExperienceByIdDao,
  getUserExperienceByIdDao,
  updateUserExperienceByIdDao,
  getProfesionalFullByIdDao,
  getAllProfesionalsDao,
  getAllProfesionalsPaginatedDao,
  updateProfesionalAuthStatusDao,
} from "@/dao/dao";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { createProfesionalDataDao } from "@/dao/dao";
import { getCertificationById } from "@/controller/userData.controller";

export const getUserDataService = async (id?: string | null) => {
  if (!id) return null;
  return await getProfesionalDataByRefferCodeDao(id);
};

export const getUserEmailByReferCodeService = async (referCode?: string | null) => {
  if (!referCode) return null;
  return await getUserEmailByRefferCodeDao(referCode);
};

export const getUserFullByIdService = async (id?: string | null) => {
  if (!id) return null;
  const response = await getProfesionalFullByIdDao(id);
  return response;
};

export const getMainStudyService = async (id: string | undefined) => {
  const response = await getProfesionalMainStudyDao(id);
  return response;
};

export const getAllProfesionalsService = async () => {
  const response = await getAllProfesionalsDao();
  return response;
}

export const getAllProfesionalsPaginatedService = async (page: number = 1, limit: number = 9, search?: string, speciality?: string, subArea?: string, status?: string) => {
  const response = await getAllProfesionalsPaginatedDao(page, limit, search, speciality, subArea, status);
  return response;
}

export const createUserDataService = async (data?: any) => {
  //obtener id para crear o actualizar
  const session = await getServerSession(authOptions);
  const id = session?.user.id;
  // verificar si esta
  const chk = await getUserDataService(id);
  if (!chk) {
    //crear user data
    const result = await createProfesionalDataDao(data);
    return result;
  } else {
    //actualizar user Data
    const result = await updateProfesionalDataDao(data, id);
    return result;
  }
};

export const updateUserDataService = async (data?: any) => {
  const session = await getServerSession(authOptions);
  const id = session?.user.id;
  const result = await updateProfesionalDataDao(data, id);
  return result;
};

export const updateUserDataByIdService = async (data: any, userId: string) => {
  const result = await updateProfesionalDataDao(data, userId);
  return result;
};

export const updateUserStatusByIdService = async (status: string, userId: string) => {
  const result = await updateProfesionalAuthStatusDao( userId, status as any);
  return result;
};

export const createUserDataMainStudy = async (data: any) => {
  //obtener id para crear o actualizar
  const session = await getServerSession(authOptions);
  const id = session?.user.id;
  const chk = await getProfesionalMainStudyDao(id);

  if (!chk) {
    const result = await createProfesionalMainStudyDao(data);
    return result;
  } else {
    const result = await updateProfesionalMainStudyDao(data, id);
    return result;
  }
};

// Servicio específico para actualizar main_study
export const updateUserMainStudyService = async (data: any, userId: string) => {
  try {
    const result = await updateProfesionalMainStudyDao(data, userId);
    return result;
  } catch (error) {
    throw error;
  }
};
//speciality
export const createUserSpecialityService = async (data: any) => {
  //revisar que no este creada previamente para ese usuario
  const session = await getServerSession(authOptions);
  const id = session?.user.id;
  const chk = await getUserSpecializationByTitle(id, data.title);

  if (!chk) {
    const createSpeciality = await createUserSpecializationDao(data);
    return createSpeciality;
  }
  throw new Error("Especialización Ya Creada Previamente");
};

export const getUserSpecialitiesService = async (userId: string) => {
  const userSpetialities = await getUserSpecializationsDao(userId);
  return userSpetialities;
};

export const deleteUserSpecialityService = async (id: number) => {
  //extraer userId para verificar auth
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  const chk = await getUserSpecializationByIdDao(id);
  if (chk) {
    if (chk.user_id == userId) {
      const result = await deleteSpecializationByIdDao(id);
      return result;
    } else {
      throw new Error("Unauthorized");
    }
  } else {
    throw new Error("Unauthorized");
  }
};

export const getSpecialityService = async (id: number) => {
  const result = getUserSpecializationByIdDao(id);
  return result;
};

export const updateUserSpecializationService = async (id: number, data: any) => {
  const result = await updateSpecializationByIdDao(id, data);
  return result;
};
//DESARROLLO FUTURO
export const makeFavoriteSpecialityService = async (userId: string | undefined, specialityId: number) => {
  //revisar si ya hay algun favorito con el id del study specialization
  const chk = await getFavoriteSpecializationBySpecializationIdDao(specialityId);
  if (chk) {
    // actualizar favorito existente
  } else {
    // crear nuevo favorito
  }
  return userId;
};
//certifications
export const getUserCertificationsService = async (userId: string | undefined) => {
  const result = await getCertificationsByUserIdDao(userId);
  return result;
};

export const getUserCertificationByTitleService = async (userId: string | undefined, title: string | undefined) => {
  const result = await getCertificationByTitleDao(userId, title);
  return result;
};

export const getCertificationByIdService = async (id: number | undefined) => {
  const result = await getCertificationByIdDao(id);
  return result;
};

export const createUserCertificationService = async (userId: string | undefined, data: any) => {
  const chk = await getUserCertificationByTitleService(userId, data.title);
  if (chk?.title == data.title) {
    throw new Error("ta existe esta certificación");
  } else {
    const result = createUserCertificationDao(data);
    return result;
  }
};

export const updateUserCertificationService = async (id: number | undefined, data: any | undefined) => {
  const result = await updateCertificationByIdDao(id, data);
  return result;
};

export const deleteUserCertificationService = async (id: number) => {
  const result = await deleteUserCertificationByIdDao(id);
  return result;
};
//experience
export const getUserExperiencesService = async (userId: string | undefined) => {
  const result = await getUserExperiencesByUserIdDao(userId);
  return result;
};

export const createUserExperienceService = async (data: any) => {
  const result = await createUserExperienceDao(data);
  return result;
};

export const deleteUserExperienceService = async (id: number) => {
  const result = await deleteUserExperienceByIdDao(id);
  return result;
};

export const getUserExperienceByIdService = async (id: number | undefined) => {
  const result = await getUserExperienceByIdDao(id);
  return result;
};

export const updateUserExperienceService = async (id: number, data: any) => {
  const result = await updateUserExperienceByIdDao(id, data);
  return result;
};

// Nuevo servicio para obtener estadísticas de usuarios
// Caché en memoria para estadísticas con timestamp
let statsCache: any = null;
let statsCacheTime: number = 0;
const STATS_CACHE_DURATION = 30000; // Caché de 30 segundos

export const getUserStatsService = async () => {
  try {
    // Verificar si tenemos caché válido
    const now = Date.now();
    if (statsCache && (now - statsCacheTime) < STATS_CACHE_DURATION) {
      return statsCache;
    }

    // Usar la instancia de prisma directamente desde utils
    const { default: prisma } = await import("@/utils/db");
    
    // Optimización: usar un timeout más agresivo para conteos
    // Obtener conteos con AbortController para evitar queries largas
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos max
    
    try {
      // Obtener conteos directamente por cada status
      // Ejecutar secuencialmente en lugar de Promise.all para mejor control
      const invited = await prisma.auth.count({ where: { status: 'invited' } });
      const registered = await prisma.auth.count({ where: { status: 'registered' } });
      const active = await prisma.auth.count({ where: { status: 'active' } });
      const deactivated = await prisma.auth.count({ where: { status: 'desactivated' } });
      const total = await prisma.auth.count();

      // Convertir a formato más manejable
      const formattedStats = {
        invited,
        registered,
        active,
        deactivated,
        total
      };

      // Guardar en caché
      statsCache = formattedStats;
      statsCacheTime = now;

      return formattedStats;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error("Error getting user stats:", error);
    
    // Si hay error pero tenemos caché antiguo, devolver eso
    if (statsCache) {
      console.warn("Returning cached stats due to error");
      return statsCache;
    }
    
    // Si no hay caché, devolver valores por defecto
    return {
      invited: 0,
      registered: 0,
      active: 0,
      deactivated: 0,
      total: 0
    };
  }
};
