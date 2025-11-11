import prisma from "@/utils/db";

export const getCampaignDataByUserId = async (userId: string) => {
    try {
        const campaignData = await prisma.campaign_data.findFirst({
            where: { user_id: userId },
        });
        return campaignData;
    } catch (error) {
        throw new Error("Error fetching campaign data Dao");
    }
};

export const createCampaignData = async (data: any) => {
    try {
        const campaignData = await prisma.campaign_data.create({
            data: {
                user_id: data.user_id,
                name: data.name,
                last_name: data.last_name,
                company: data.company,
                role: data.role,
                country: data.country,
                state: data.state,
                city: data.city,
                status: "active", // Status por defecto
            },
        });
        return campaignData;
    } catch (error) {
        throw new Error("Error creating campaign data Dao");
    }
};

export const updateCampaignData = async (userId: string, data: any) => {
    try {
        const campaignData = await prisma.campaign_data.updateMany({
            where: { user_id: userId },
            data: {
                name: data.name,
                last_name: data.last_name,
                company: data.company,
                role: data.role,
                country: data.country,
                state: data.state,
                city: data.city,
                updated_at: new Date(),
            },
        });
        return campaignData;
    } catch (error) {
        throw new Error("Error updating campaign data Dao");
    }
};

export const deleteCampaignData = async (userId: string) => {
    try {
        const campaignData = await prisma.campaign_data.deleteMany({
            where: { user_id: userId },
        });
        return campaignData;
    } catch (error) {
        throw new Error("Error deleting campaign data Dao");
    }
};

export const getCampaignLeadsByUserIdDao = async (userId: string) => {
    try {
        const leadsData = await prisma.leads_send.findMany({
            where: { user_id: userId },
        });
        return leadsData;
    } catch (error) {
        throw new Error("Error fetching campaign leads Dao");
    }
}