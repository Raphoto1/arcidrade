import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import {
  getColabDataByUserIdDao,
  createColabDataDao,
  updateColabDataDao,
} from "@/dao/colab.dao";
import prisma from "@/utils/db";

// Obtener datos del colaborador
export const getColabDataService = async (id?: string | null) => {
  if (!id) return null;
  return await getColabDataByUserIdDao(id);
};

// Crear o actualizar datos del colaborador
export const createColabDataService = async (data?: any) => {
  const session = await getServerSession(authOptions);
  const id = session?.user.id;
  
  if (!id) {
    throw new Error("No se pudo obtener el ID del usuario");
  }
  
  // Verificar si existe
  const chk = await getColabDataService(id);
  
  if (!chk) {
    // Crear datos del colaborador - agregar user_id
    const dataWithUserId = {
      ...data,
      user_id: id,
    };
    const result = await createColabDataDao(dataWithUserId);
    
    // Si tiene nombre, actualizar status del usuario a active
    if (data.name) {
      await prisma.auth.update({
        where: { referCode: id },
        data: { status: "active" },
      });
    }
    
    return result;
  } else {
    // Actualizar datos del colaborador
    const result = await updateColabDataDao(data, id);
    
    // Si tiene nombre y el status no es active, actualizarlo
    if (data.name) {
      const user = await prisma.auth.findUnique({
        where: { referCode: id },
      });
      
      if (user && user.status !== "active") {
        await prisma.auth.update({
          where: { referCode: id },
          data: { status: "active" },
        });
      }
    }
    
    return result;
  }
};

// Actualizar datos del colaborador
export const updateColabDataService = async (data?: any, userId?: string) => {
  const session = await getServerSession(authOptions);
  const id = userId || session?.user.id;
  
  if (!id) {
    throw new Error("No se pudo obtener el ID del usuario");
  }
  
  const result = await updateColabDataDao(data, id);
  
  // Si tiene nombre y el status no es active, actualizarlo
  if (data.name) {
    const user = await prisma.auth.findUnique({
      where: { referCode: id },
    });
    
    if (user && user.status !== "active") {
      await prisma.auth.update({
        where: { referCode: id },
        data: { status: "active" },
      });
    }
  }
  
  return result;
};