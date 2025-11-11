import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import {
  getCampaignDataByUserIdService,
  createCampaignDataService,
  updateCampaignDataService,
  deleteCampaignDataService,
  upsertCampaignDataService,
  getCampaignLeadsByUserIdService,
} from "@/service/campaign.service";

export const getCampaignData = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      throw new Error("No autorizado - Se requiere autenticación");
    }

    // Verificar que el usuario sea de tipo campaign
    if (session.user.area !== "campaign") {
      throw new Error("No autorizado - Solo usuarios campaign pueden acceder a esta funcionalidad");
    }

    const userId = session.user.id;
    const result = await getCampaignDataByUserIdService(userId);

    return result;
  } catch (error) {
    console.error("Error in getCampaignData controller:", error);
    throw error;
  }
};

export const createCampaignData = async (data: any) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      throw new Error("No autorizado - Se requiere autenticación");
    }

    // Verificar que el usuario sea de tipo campaign
    if (session.user.area !== "campaign") {
      throw new Error("No autorizado - Solo usuarios campaign pueden crear datos");
    }

    const userId = session.user.id;

    // Validar que el user_id coincida con el de la sesión
    if (data.user_id && data.user_id !== userId) {
      throw new Error("No autorizado - No puedes crear datos para otro usuario");
    }

    const campaignData = {
      ...data,
      user_id: userId, // Asegurar que se use el user_id de la sesión
    };

    const result = await createCampaignDataService(campaignData);
    return result;
  } catch (error) {
    console.error("Error in createCampaignData controller:", error);
    throw error;
  }
};

export const updateCampaignData = async (data: any) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      throw new Error("No autorizado - Se requiere autenticación");
    }

    // Verificar que el usuario sea de tipo campaign
    if (session.user.area !== "campaign") {
      throw new Error("No autorizado - Solo usuarios campaign pueden actualizar datos");
    }

    const userId = session.user.id;

    // Validar que el user_id coincida con el de la sesión (si se proporciona)
    if (data.user_id && data.user_id !== userId) {
      throw new Error("No autorizado - No puedes actualizar datos de otro usuario");
    }

    const result = await updateCampaignDataService(userId, data);
    return result;
  } catch (error) {
    console.error("Error in updateCampaignData controller:", error);
    throw error;
  }
};

export const deleteCampaignData = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      throw new Error("No autorizado - Se requiere autenticación");
    }

    // Verificar que el usuario sea de tipo campaign
    if (session.user.area !== "campaign") {
      throw new Error("No autorizado - Solo usuarios campaign pueden eliminar datos");
    }

    const userId = session.user.id;
    const result = await deleteCampaignDataService(userId);

    return result;
  } catch (error) {
    console.error("Error in deleteCampaignData controller:", error);
    throw error;
  }
};

export const upsertCampaignData = async (data: any) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      throw new Error("No autorizado - Se requiere autenticación");
    }

    // Verificar que el usuario sea de tipo campaign
    if (session.user.area !== "campaign") {
      throw new Error("No autorizado - Solo usuarios campaign pueden gestionar datos");
    }

    const userId = session.user.id;

    // Validar que el user_id coincida con el de la sesión (si se proporciona)
    if (data.user_id && data.user_id !== userId) {
      throw new Error("No autorizado - No puedes gestionar datos de otro usuario");
    }

    const campaignData = {
      ...data,
      user_id: userId, // Asegurar que se use el user_id de la sesión
    };

    const result = await upsertCampaignDataService(userId, campaignData);
    return result;
  } catch (error) {
    console.error("Error in upsertCampaignData controller:", error);
    throw error;
  }
};

// Funciones para Victor (administrador) - acceso completo
export const getCampaignDataByUserIdAsAdmin = async (userId: string) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      throw new Error("No autorizado - Se requiere autenticación");
    }

    // Solo Victor puede acceder a datos de otros usuarios
    if (session.user.area !== "victor") {
      throw new Error("No autorizado - Solo administradores pueden acceder a datos de otros usuarios");
    }

    const result = await getCampaignDataByUserIdService(userId);
    return result;
  } catch (error) {
    console.error("Error in getCampaignDataByUserIdAsAdmin controller:", error);
    throw error;
  }
};

export const updateCampaignDataAsAdmin = async (userId: string, data: any) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      throw new Error("No autorizado - Se requiere autenticación");
    }

    // Solo Victor puede modificar datos de otros usuarios
    if (session.user.area !== "victor") {
      throw new Error("No autorizado - Solo administradores pueden modificar datos de otros usuarios");
    }

    const result = await updateCampaignDataService(userId, data);
    return result;
  } catch (error) {
    console.error("Error in updateCampaignDataAsAdmin controller:", error);
    throw error;
  }
};

export const getCampaignLeads = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.referCode) {
      throw new Error("No autorizado - Se requiere autenticación");
    }

    // Verificar que el usuario sea de tipo campaign
    if (session.user.area !== "campaign") {
      throw new Error("No autorizado - Solo usuarios campaign pueden acceder a sus leads");
    }

    const userReferCode = session.user.referCode;
    const leads = await getCampaignLeadsByUserIdService(userReferCode);
    return leads;
  } catch (error) {
    console.error("Error in getCampaignLeads controller:", error);
    throw error;
  }
};
