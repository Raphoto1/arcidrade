import {
  createInstitutionCertificationDao,
  createInstitutionDataDao,
  createInstitutionSpecialityDao,
  deleteInstitutionCertificationDao,
  deleteInstitutionSpecialityDao,
  getInstitutionCertificationByIdDao,
  getInstitutionCertificationsDao,
  getInstitutionDataByRefferCodeDao,
  getInstitutionSpecialitiesDao,
  getInstitutionSpecialityDao,
  updateInstitutionCertificationDao,
  updateInstitutionDataDao,
  updateInstitutionSpecialityDao,
  createInstitutionGoalDao,
  getInstitutionGoalsDao,
  getInstitutionGoalByIdDao,
  updateInstitutionGoalDao,
  deleteInstitutionGoalDao,
  getInstitutionFullByUserIdDao,
  getAllInstitutionsDao,
  getAllInstitutionsPaginatedDao,
  getAllActiveInstitutionsDao,
  getAllPausedInstitutionsDao
} from "@/dao/institution.dao";

export const getInstitutionDataByUserIdService = async (userId: string | undefined) => {
  const response = await getInstitutionDataByRefferCodeDao(userId);
  return response;
};

export const getInstitutionDataFullByUserIdService = async (userId: string | undefined) => {
  const response = await getInstitutionFullByUserIdDao(userId);
  return response;
};

export const createInstitutionDataService = async (data: any) => {
  const response = await createInstitutionDataDao(data);
  return response;
};

export const updateInstitutionDataService = async (data: any, userId: string | undefined) => {
  const response = await updateInstitutionDataDao(data, userId);
  return response;
};
//speciality
export const createInstitutionSpecialityService = async (data: any) => {
  const response = await createInstitutionSpecialityDao(data);
  return response;
};

export const getInstitutionSpecialitiesService = async (userId: string | undefined) => {
  const response = await getInstitutionSpecialitiesDao(userId);
  return response;
};

export const getInstitutionSpecialityService = async (id: number) => {
  const response = await getInstitutionSpecialityDao(id);
  return response;
};

export const deleteInstitutionSpecialityService = async (id: number) => {
  const response = await deleteInstitutionSpecialityDao(id);
  return response;
};

export const updateInstitutionSpecialityService = async (id: number, data: any) => {
  const update = await updateInstitutionSpecialityDao(id, data);
  return update;
};
//certification
export const getInstitutionCertificationsService = async (userId: string | undefined) => {
  const response = await getInstitutionCertificationsDao(userId);
  return response;
};

export const createInstitutionCertificationService = async (data: any) => {
  const response = await createInstitutionCertificationDao(data);
  return response;
};

export const getInstitutionCertificationService = async (id: number) => {
  const response = await getInstitutionCertificationByIdDao(id);
  return response;
};

export const updateInstitutionCertificationService = async (id: number, data: any) => {
  const response = await updateInstitutionCertificationDao(id, data);
  return response;
};

export const deleteInstitutionCertificationService = async (id: number) => {
  const response = await deleteInstitutionCertificationDao(id);
  return response;
};
//goal
export const createInstitutionGoalService = async (data: any) => {
  const response = await createInstitutionGoalDao(data);
  return response;
};

export const getInstitutionGoalsService = async (userId: string | undefined) => {
  const response = await getInstitutionGoalsDao(userId);
  return response;
};

export const getInstitutionGoalService = async (id: number) => {
  const response = await getInstitutionGoalByIdDao(id);
  return response;
};

export const updateInstitutionGoalService = async (id: number, data: any) => {
  const update = await updateInstitutionGoalDao(id, data);
  return update;
}

export const deleteInstitutionGoalService = async (id: number) => {
  const response = await deleteInstitutionGoalDao(id);
  return response;
}

export const getAllInstitutionsService = async () => {
  const response = await getAllInstitutionsDao();
  return response;
}

export const getAllInstitutionsPaginatedService = async (page: number = 1, limit: number = 9, search?: string, country?: string, specialization?: string) => {
  const response = await getAllInstitutionsPaginatedDao(page, limit, search, country, specialization);
  return response;
}

export const getAllActiveInstitutionsService = async () => {
  const response = await getAllActiveInstitutionsDao();
  return response;
};

export const getAllPausedInstitutionsService = async () => {
  const response = await getAllPausedInstitutionsDao();
  return response;
}