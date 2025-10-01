import { getInstitutionDataByUserIdService } from "@/service/institutionData.service"
import { authOptions } from "@/utils/authOptions"
import { Institution_Data } from "@prisma/client"
import { getServerSession } from "next-auth"

type institutionDataFiltered= Omit<Institution_Data, 'id' | 'user_id' >
export const getInstitutionData = async () => { 
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id as string
    const institutionData = await getInstitutionDataByUserIdService(userId);
    const institutionDataFiltered = {} as institutionDataFiltered;
    if (institutionData == null) {
        return institutionDataFiltered
    }
    return institutionData
}