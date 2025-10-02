import { createInstitutionDataDao, createInstitutionSpecialityDao, deleteInstitutionSpecialityDao, getInstitutionDataByRefferCodeDao, getInstitutionSpecialitiesDao, getInstitutionSpecialityDao, updateInstitutionDataDao, updateInstitutionSpecialityDao } from "@/dao/institution.dao"

export const getInstitutionDataByUserIdService = async (userId: string|undefined) => { 
    const response = await getInstitutionDataByRefferCodeDao(userId)
    return response
}

export const createInstitutionDataService = async (data: any) => {
    const response = await createInstitutionDataDao(data);
    return response;
}

export const updateInstitutionDataService = async (data: any, userId: string | undefined) => {
    const response = await updateInstitutionDataDao(data, userId);
    return response;    
}
//speciality
export const createInstitutionSpecialityService = async (data: any) => { 
  const response = await createInstitutionSpecialityDao(data);
  return response;
}

export const getInstitutionSpecialitiesService = async (userId: string | undefined) => { 
    const response = await getInstitutionSpecialitiesDao(userId);
    return response;
}

export const getInstitutionSpecialityService = async (id: number) => {
    const response = await getInstitutionSpecialityDao(id);
    return response;
}

export const deleteInstitutionSpecialityService = async (id: number) => { 
    const response = await deleteInstitutionSpecialityDao(id);
    return response;
}

export const updateInstitutionSpecialityService = async (id: number, data: any) => {
const update = await updateInstitutionSpecialityDao(id, data);
return update;
}