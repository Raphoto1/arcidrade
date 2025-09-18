
import type { Profesional_data } from "@prisma/client"
import type { Main_study } from "@prisma/client"

export const getUserDataService = async (id: string) => {
    //retorna la data segun el userId
}

export const createUserDataService = async (data?: any) => {
    //crear user data
    console.log('profesional data pack en service', data);
    
}

export const createUserDataMainStudy = async (data: any) => {
    // crear MainStudy
    console.log('data main study pack en service', data);
    
}