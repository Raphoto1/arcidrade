import { createInstitutionDataDao, getInstitutionDataByRefferCodeDao, updateInstitutionDataDao } from "@/dao/institution.dao"

export const getInstitutionDataByUserIdService = async (userId: string) => { 
    const response = await getInstitutionDataByRefferCodeDao(userId)
    return response
}

export const createInstitutionDataService = async (data: any) => {
    const response = await createInstitutionDataDao(data);
    return response;
}

export const updateInstitutionDataService = async (data: any, userId: string) => {
    const response = await updateInstitutionDataDao(data, userId);
    return response;    
}