import { 
    getCampaignDataByUserId, 
    createCampaignData, 
    updateCampaignData, 
    deleteCampaignData, 
    getCampaignLeadsByUserIdDao
} from "@/dao/campaign.dao";
import prisma from "@/utils/db";

export const getCampaignDataByUserIdService = async (userId: string) => {
    try {
        const result = await getCampaignDataByUserId(userId);
        return result;
    } catch (error) {
        console.error("Error in getCampaignDataByUserIdService:", error);
        throw new Error("Error fetching campaign data service");
    }
};

export const createCampaignDataService = async (campaignData: any) => {
    try {
        // Validar datos requeridos
        if (!campaignData.user_id) {
            throw new Error("user_id is required");
        }

        if (!campaignData.name || campaignData.name.trim() === '') {
            throw new Error("name is required");
        }

        const result = await createCampaignData(campaignData);
        return result;
    } catch (error) {
        console.error("Error in createCampaignDataService:", error);
        throw error;
    }
};

export const updateCampaignDataService = async (userId: string, campaignData: any) => {
    try {
        // Verificar que el usuario existe
        const existingData = await getCampaignDataByUserId(userId);
        if (!existingData) {
            throw new Error("Campaign data not found for this user");
        }

        // Validar que el nombre no esté vacío si se proporciona
        if (campaignData.name !== undefined && campaignData.name.trim() === '') {
            throw new Error("name cannot be empty");
        }

        const result = await updateCampaignData(userId, campaignData);
        return result;
    } catch (error) {
        console.error("Error in updateCampaignDataService:", error);
        throw error;
    }
};

export const deleteCampaignDataService = async (userId: string) => {
    try {
        // Verificar que el usuario existe
        const existingData = await getCampaignDataByUserId(userId);
        if (!existingData) {
            throw new Error("Campaign data not found for this user");
        }

        const result = await deleteCampaignData(userId);
        return result;
    } catch (error) {
        console.error("Error in deleteCampaignDataService:", error);
        throw error;
    }
};

export const upsertCampaignDataService = async (userId: string, campaignData: any) => {
    try {
        // Verificar si ya existe data para este usuario
        const existingData = await getCampaignDataByUserId(userId);
        
        const dataToSave = {
            ...campaignData,
            user_id: userId,
        };

        if (existingData) {
            // Si existe, actualizar
            const result = await updateCampaignData(userId, dataToSave);
            return { action: 'updated', data: result };
        } else {
            // Si no existe, crear
            const result = await createCampaignData(dataToSave);
            
            // Al crear por primera vez, actualizar el status del usuario de "invited" a "active"
            try {
                await prisma.auth.updateMany({
                    where: {
                        referCode: userId, // userId en este contexto es el referCode
                        status: "registered" // Solo actualizar si el status actual es "invited"
                    },
                    data: {
                        status: "active"
                    }
                });
            } catch (statusUpdateError) {
                console.error(`Error al actualizar status del usuario ${userId}:`, statusUpdateError);
                // No arrojamos error aquí para que no falle la creación de campaign data
                // pero lo loggeamos para debugging
            }
            
            return { action: 'created', data: result };
        }
    } catch (error) {
        console.error("Error in upsertCampaignDataService:", error);
        throw error;
    }
};

export const getCampaignLeadsByUserIdService = async (userID: string) => {
    const leads = await getCampaignLeadsByUserIdDao(userID);
    return leads;
}