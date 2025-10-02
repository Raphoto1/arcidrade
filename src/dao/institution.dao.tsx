import prisma from "@/utils/db";

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

export const createInstitutionDataDao = async (data: any) => {
  try {
    const newInstitutionData = await prisma.institution_Data.create({
      data,
    });
    return newInstitutionData;
  } catch (error) {
    console.error("error de create institution Data Dao", error);
    throw new Error("Error al crear institucion");
  }
};

export const updateInstitutionDataDao = async (data: any, userId: string | undefined) => {
  try {
    const updatedInstitutionData = await prisma.institution_Data.updateManyAndReturn({
      where: { user_id: userId },
      data,
    });
    return updatedInstitutionData;
  } catch (error) {
    console.error("error de update institution Data Dao", error);
    throw new Error("Error al actualizar institucion");
  }
};
//speciality
export const createInstitutionSpecialityDao = async (data: any) => {
  try {
    const newSpeciality = await prisma.institution_specialization.create({
      data,
    });
    return newSpeciality;
  } catch (error) {
    console.error("error de create institution Speciality Dao", error);
    throw new Error("Error al crear especialidad");
  }
};

export const getInstitutionSpecialitiesDao = async (userId: string | undefined) => {
  try {
    const specialities = await prisma.institution_specialization.findMany({
      where: { user_id: userId },
    });
    return specialities;
  } catch (error) {
    console.error("error de get institution Specialities Dao", error);
    throw new Error("Error al obtener especialidades");
  }
};

export const getInstitutionSpecialityDao = async (id: number) => {
  try {
    const speciality = await prisma.institution_specialization.findUnique({
      where: { id },
    });
    return speciality;
  } catch (error) {
    console.error("error de get institution Speciality Dao", error);
    throw new Error("Error al obtener especialidad");
  }
};

export const deleteInstitutionSpecialityDao = async (id: number) => {
  try {
    const deletedSpeciality = await prisma.institution_specialization.delete({
      where: { id },
    });
    return deletedSpeciality;
  } catch (error) {
    console.error("error de delete institution Speciality Dao", error);
    throw new Error("Error al eliminar especialidad");
  }
};

export const updateInstitutionSpecialityDao = async (id: number, data: any) => {
  try {
    const updatedSpeciality = await prisma.institution_specialization.update({
      where: { id },
      data,
    });
    return updatedSpeciality;
  } catch (error) {
    console.error("error de update institution Speciality Dao", error);
    throw new Error("Error al actualizar especialidad");
  }
};
