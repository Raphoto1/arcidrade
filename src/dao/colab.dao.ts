import prisma from "@/utils/db";

// Obtener datos de colaborador por user_id
export const getColabDataByUserIdDao = async (user_id: string) => {
  try {
    const colabData = await prisma.colaborator_data.findFirst({
      where: { user_id },
    });
    return colabData;
  } catch (error) {
    console.error("Error al obtener datos del colaborador:", error);
    throw new Error("Error al obtener datos del colaborador");
  }
};

// Crear datos de colaborador
export const createColabDataDao = async (data: any) => {
  try {
    const result = await prisma.colaborator_data.create({
      data: data,
    });
    return result;
  } catch (error) {
    console.error("Error al crear datos del colaborador:", error);
    throw new Error("Error al crear datos del colaborador");
  }
};

// Actualizar datos de colaborador
export const updateColabDataDao = async (data: any, user_id: string) => {
  try {
    const updateInfo = await prisma.colaborator_data.updateMany({
      where: { user_id: user_id },
      data: data,
    });
    return updateInfo;
  } catch (error) {
    console.error("Error al actualizar datos del colaborador:", error);
    throw new Error("Error al actualizar datos del colaborador");
  }
};