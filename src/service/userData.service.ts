//imports propios
import {
  createProfesionalMainStudyDao,
  createUserSpecializationDao,
  getProfesionalDataByRefferCodeDao,
  getProfesionalMainStudyDao,
  getUserSpecializationByTitle,
  updateProfesionalDataDao,
  updateProfesionalMainStudyDao,
  getUserSpecializationsDao,
  getUserSpecializationByIdDao,
  deleteSpecializationByIdDao,
} from "@/dao/dao";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { createProfesionalDataDao } from "@/dao/dao";

export const getUserDataService = async (id?: string | null) => {
  if (!id) return null;
  return await getProfesionalDataByRefferCodeDao(id);
};

export const getMainStudyService = async (id: string | undefined) => {
  const response = getProfesionalMainStudyDao(id);
  return response;
};

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

export const createUserDataMainStudy = async (data: any) => {
  // crear MainStudy
  console.log("data main study pack en service", data);
  //obtener id para crear o actualizar
  const session = await getServerSession(authOptions);
  const id = session?.user.id;
  const chk = await getProfesionalMainStudyDao(id);
  console.log(chk);

  if (!chk) {
    const result = await createProfesionalMainStudyDao(data);
    return result;
  } else {
    const result = await updateProfesionalMainStudyDao(data, id);
    return result;
  }
};

export const createUserSpecialityService = async (data: any) => {
  //revisar que no este creada previamente
  const chk = await getUserSpecializationByTitle(data.title);

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
    const result = chk.user_id == userId ? await deleteSpecializationByIdDao(id) : console.error('Intruso');
    return result
  } else {
    console.error('intento de Intruso');
    throw new Error('Unauthorized');
  }
};
