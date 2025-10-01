import { getInstitutionDataByRefferCodeDao } from "@/dao/institution.dao"

export const getInstitutionDataByUserIdService = async (userId: string) => { 
    const response = await getInstitutionDataByRefferCodeDao(userId)
    return response
}