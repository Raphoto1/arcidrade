import prisma from "@/utils/db";
import { encrypt } from "@/utils/encrypter";
import { StatusAvailable } from "@prisma/client";

export const getInstitutionFullByIdDao = async (user_id: string | undefined) => {
  try {
    const fullUser = await prisma.auth.findFirst({
      where: { referCode: user_id },
      include: {
        institution_data: true,
        institution_specialization: true,
        institution_certifications: true,
        goals: true,
      },
    });
    if (fullUser) {
      const { password, ...safeUser } = fullUser;
      return safeUser;
    }
  } catch (error) {
        console.log("error de Profesional data full", error);
    throw new Error("Error al obtener profesional full");
  }
};

export const getInstitutionDataByRefferCodeDao = async (user_id: string | undefined) => {
  try {
    const institutionData = await prisma.institution_Data.findFirst({
      where: { user_id },
    });
    return institutionData;
  } catch (error) {
    console.error("error de institution Data By Reffer Code Dao", error);
    throw new Error("Error al obtener institucion");
  }
};
