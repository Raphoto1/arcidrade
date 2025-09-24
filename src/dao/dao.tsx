import prisma from "@/utils/db";
import { encrypt } from "@/utils/encrypter";
import { StatusAvailable } from "@prisma/client";

// auth
export const getInvitationByIdDao = async (id: string) => {
  console.log("Buscando invitación por ID:", id);
  try {
    const chkInvitations = await prisma.auth.findUnique({
      where: { referCode: id },
    });

    return chkInvitations;
  } catch (error) {
    console.log("Error al obtener la invitación:", error);
    return null;
  }
};
export const getInvitationByEmailDao = async (email: string) => {
  try {
    const chkInvitations = await prisma.auth.findUnique({
      where: { email },
    });
    return chkInvitations;
  } catch (error) {
    console.log("Error al obtener la invitación por email:", error);
    return null;
  }
};
export const completeInvitationDao = async (id: string, email: string, password: string) => {
  console.log(id, email, password);

  try {
    const invitation = await getInvitationByEmailDao(email);
    const invitationIdChk = await getInvitationByIdDao(id);

    console.log("invitation desde dao", invitation?.email);
    console.log("invitationIdChk desde dao", invitationIdChk?.email);

    // Verifica que ambos emails existan y sean iguales
    if (!invitation?.email || !invitationIdChk?.email) {
      throw new Error("El email no concuerda con la invitación.");
    }

    const encryptedPass = await encrypt(password);
    const updatedUser = await prisma.auth.update({
      where: { referCode: id },
      data: {
        password: encryptedPass,
        status: "registered",
      },
    });
    return true;
  } catch (error) {
    console.log("Error al completar la invitación:", error);
    throw error; // Propaga el error para manejarlo en el endpoint
  }
};

// Platform

// Platform - Institution

// Platform - Profesional_________________________________________________________________
export const getProfesionalDataByRefferCodeDao = async (user_id: string | undefined) => {
  try {
    const profesionalData = await prisma.profesional_data.findFirst({
      where: { user_id },
    });
    return profesionalData;
  } catch (error) {
    console.log("error de Profesional Data By Reffer Code Dao", error);
    throw new Error("Error al obtener el estudio principal del profesional:");
  }
};
// agregar info al profesional
export const createProfesionalDataDao = async (data: any | undefined) => {
  try {
    const result = await prisma.profesional_data.create({
      data: data,
    });
    return result;
  } catch (error) {
    throw new Error("Error al crear profesional data");
  }
};
//actualizar  info al profesional
export const updateProfesionalDataDao = async (data: any, user_id: string | undefined) => {
  console.log("se actualiza dao");
  const updateInfo = await prisma.profesional_data.updateManyAndReturn({
    where: { user_id: user_id },
    data: data,
  });
  console.log("update Info", updateInfo);
  return updateInfo;
};
// actualizar estado de profesional
export const updateProfesionalStatus = async (id: string, status: StatusAvailable) => {
  try {
    const statusUpdate = await prisma.auth.update({
      where: { referCode: id },
      data: {
        status: status,
      },
    });
  } catch (error) {
    console.log("Error al completar la invitación:", error);
    throw error; // Propaga el error para manejarlo en el endpoint
  }
};
//obtener main_study profesional
export const getProfesionalMainStudyDao = async (user_id: string | undefined) => {
  try {
    const mainStudy = await prisma.main_study.findFirst({
      where: { user_id },
    });
    return mainStudy;
  } catch (error) {
    throw new Error("Error al obtener el estudio principal del profesional:");
  }
};
//crear main_study profesional
export const createProfesionalMainStudyDao = async (data: any) => {
  try {
    const result = prisma.main_study.create({
      data: data,
    });
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);

    throw new Error("Error al crear el estudio Principal");
  }
};
//actualizar main_study profesional
export const updateProfesionalMainStudyDao = async (data: any, user_id: string | undefined) => {
  try {
    const studyUpdate = await prisma.main_study.update({
      where: { user_id: user_id },
      data: data,
    });

    return studyUpdate;
  } catch (error) {
    console.error(error);

    throw new Error("Error al actualizar main study");
  }
};

export const createUserSpecializationDao = async (data: any) => {
  try {
    const result = await prisma.study_specialization.create({
      data: data,
    });
    console.log("result de dao specialization", result);
    return result;
  } catch (error) {
    throw new Error("error al crear especialidad");
  }
};

export const getUserSpecializationByTitle = async (title: string) => {
  try {
    const result = await prisma.study_specialization.findFirst({ where: { title: title } });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("error dao");
  }
};

export const getUserSpecializationsDao = async (userId: string) => {
  try {
    const result = await prisma.study_specialization.findMany({ where: { user_id: userId } });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("error dao");
  }
};

export const getUserSpecializationByIdDao = async (id: number) => {
  try {
    const result = await prisma.study_specialization.findFirst({
      where: {
        id,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("error dao");
  }
};

export const deleteSpecializationByIdDao = async (id: number) => {
  try {
    const result = await prisma.study_specialization.delete({
      where: { id },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("error dao");
  }
};

export const updateSpecializationByIdDao = async (id: number, data: any) => {
  try {
    const result = await prisma.study_specialization.update({
      where: { id: id },
      data: data,
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("error dao");
  }
};
//DESARROLLO FUTURO
export const getFavoriteSpecializationBySpecializationIdDao = async (specializationId: number) => {
  try {
    const result = await prisma.study_speciality_favorite.findFirst({
      where:{study_speciality_id:specializationId}
    })
    return result
  } catch (error) {
        console.error(error);
    throw new Error("error dao");
  }
}
//DESARROLLO FUTURO
export const CreateFavoriteSpecializationByIdDao = async (id: number, data: any) => {
  try {
    const result = await prisma.study_speciality_favorite.create({
      data:data
    })
    return result
  } catch (error) {
        console.error(error);
    throw new Error("error dao");
  }
}