import prisma from "@/utils/db";
import { encrypt } from "@/utils/encrypter";
import { StatusAvailable } from "@/generated/prisma";

// auth
export const getInvitationByIdDao = async (id: string) => {

  try {
    const chkInvitations = await prisma.auth.findUnique({
      where: { referCode: id },
    });

    return chkInvitations;
  } catch (error) {

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

    return null;
  }
};

export const getUserEmailByRefferCodeDao = async (referCode: string) => {
  try {
    const user = await prisma.auth.findUnique({
      where: { referCode },
      select: { email: true }
    });
    return user?.email || null;
  } catch (error) {
    console.error("Error al obtener el email por referCode:", error);
    return null;
  }
};

export const completeInvitationDao = async (id: string, email: string, password: string) => {


  try {
    const invitation = await getInvitationByEmailDao(email);
    const invitationIdChk = await getInvitationByIdDao(id);




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

    throw error; // Propaga el error para manejarlo en el endpoint
  }
};

export const listInvitedUsersDao = async () => {
  try {
    const invitedUsers = await prisma.auth.findMany({
      where: { status: "invited" },
    });
    return invitedUsers;
  } catch (error) {
    console.error("Error al listar usuarios invitados:", error);
    throw error;
  }
};

export const listRegisteredUsersDao = async () => {
  try {
    const registeredUsers = await prisma.auth.findMany({
      where: { status: "registered" },
    });
    return registeredUsers;
  } catch (error) {
    console.error("Error al listar usuarios registrados:", error);
    throw error;
  }
};

// Platform - Profesional_________________________________________________________________
export const getProfesionalFullByIdDao = async (user_id: string | undefined) => {
  try {
    const fullUser = await prisma.auth.findFirst({
      where: { referCode: user_id },
      include: {
        profesional_data: true,
        main_study: true,
        study_specialization: true,
        profesional_certifications: true,
        experience: true,
      },
    });
    if (fullUser) {
      const { password, ...safeUser } = fullUser;
      return safeUser;
    }
  } catch (error) {

    throw new Error("Error al obtener profesional full");
  }
};

export const getProfesionalDataByRefferCodeDao = async (user_id: string | undefined) => {
  try {
    const profesionalData = await prisma.profesional_data.findFirst({
      where: { user_id },
    });
    // console.log("profesionalData dao", profesionalData);
    
    return profesionalData;
  } catch (error) {
    console.error("error de Profesional Data By Reffer Code Dao", error);
    throw new Error("Error al obtener el estudio principal del profesional:");
  }
};

export const getAllProfesionalsDao = async () => {
  try {
    const profesionals = await prisma.auth.findMany({
      where: {
        area: "profesional",
        status: "registered",
      },
      select: {
        referCode: true,
      },
    });
    return profesionals;
  } catch (error) {

    throw new Error("Error al obtener todos los profesionales");
  }
};

export const getAllProfesionalsPaginatedDao = async (page: number = 1, limit: number = 9, search?: string, speciality?: string) => {
  try {
    const skip = (page - 1) * limit;
    
    // Construir el where clause con búsqueda y filtro por especialidad
    const whereClause: any = {
      area: "profesional",
      status: "registered",
    };

    // Array para condiciones OR
    const orConditions: any[] = [];
    const andConditions: any[] = [];

    // Si hay término de búsqueda, agregarlo a las condiciones OR
    if (search && search.trim()) {
      orConditions.push(
        {
          profesional_data: {
            some: {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { last_name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ]
            }
          }
        },
        {
          main_study: {
            some: {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { institution: { contains: search, mode: 'insensitive' } },
              ]
            }
          }
        },
        {
          study_specialization: {
            some: {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { title_category: { contains: search, mode: 'insensitive' } },
                { institution: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ]
            }
          }
        },
        {
          profesional_certifications: {
            some: {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { institution: { contains: search, mode: 'insensitive' } },
              ]
            }
          }
        }
      );
    }

    // Si hay filtro por especialidad, agregarlo a las condiciones AND
    if (speciality && speciality.trim()) {
      andConditions.push({
        OR: [
          // Buscar en main_study
          {
            main_study: {
              some: {
                title: { contains: speciality, mode: 'insensitive' }
              }
            }
          },
          // Buscar en study_specialization
          {
            study_specialization: {
              some: {
                OR: [
                  { title: { contains: speciality, mode: 'insensitive' } },
                  { title_category: { contains: speciality, mode: 'insensitive' } }
                ]
              }
            }
          }
        ]
      });
    }

    // Construir la cláusula final
    if (orConditions.length > 0 && andConditions.length > 0) {
      // Si hay ambos filtros: (búsqueda) AND (especialidad)
      whereClause.AND = [
        { OR: orConditions },
        ...andConditions
      ];
    } else if (orConditions.length > 0) {
      // Solo búsqueda
      whereClause.OR = orConditions;
    } else if (andConditions.length > 0) {
      // Solo filtro por especialidad
      whereClause.AND = andConditions;
    }
    
    const [profesionals, total] = await Promise.all([
      prisma.auth.findMany({
        where: whereClause,
        select: {
          referCode: true,
        },
        skip,
        take: limit,
        orderBy: {
          creation_date: 'desc'
        }
      }),
      prisma.auth.count({
        where: whereClause
      })
    ]);

    return {
      data: profesionals,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + limit < total,
      search: search || '',
      speciality: speciality || ''
    };
  } catch (error) {

    throw new Error("Error al obtener profesionales paginados");
  }
};

export const getAllProfesionalsBByStatusDao = async (status: StatusAvailable) => {
  try {
    const profesionals = await prisma.auth.findMany({
      where: {
        area: "profesional",
        status: status,
      },
      select: {
        referCode: true,
      },
    });
    return profesionals;
  } catch (error) {

    throw new Error("Error al obtener todos los profesionales");
  }
};

export const getAllProfesionalsBySpecialityDao = async (speciality: string) => {
  try {
    const profesionals = await prisma.auth.findMany({
      where: {
        area: "profesional",
        study_specialization: {
          some: {
            title: speciality,
          },
        },
      },
      select: {
        referCode: true,
        email: true,
        status: true,
        profesional_data: true,
        main_study: true,
        study_specialization: true,
        profesional_certifications: true,
        experience: true,
      },
    });
    return profesionals;
  } catch (error) {

    throw new Error("Error al obtener todos los profesionales por especialidad");
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

  const updateInfo = await prisma.profesional_data.updateManyAndReturn({
    where: { user_id: user_id },
    data: data,
  });

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

    return result;
  } catch (error) {
    throw new Error("error al crear especialidad");
  }
};

export const getUserSpecializationByTitle = async (userId: string | undefined, title: string) => {
  try {
    const result = await prisma.study_specialization.findFirst({ where: { user_id: userId, title: title } });
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
      where: { study_speciality_id: specializationId },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("error dao");
  }
};
//DESARROLLO FUTURO
export const CreateFavoriteSpecializationByIdDao = async (id: number, data: any) => {
  try {
    const result = await prisma.study_speciality_favorite.create({
      data: data,
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("error dao");
  }
};

//certifications
export const getCertificationsByUserIdDao = async (userId: string | undefined) => {
  try {
    const result = await prisma.profesional_certifications.findMany({
      where: { user_id: userId },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("error dao");
  }
};

export const getCertificationByTitleDao = async (userId: string | undefined, title: string | undefined) => {
  try {
    const result = await prisma.profesional_certifications.findFirst({
      where: { user_id: userId, title: title },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("error dao");
  }
};

export const getCertificationByIdDao = async (id: number | undefined) => {
  try {
    const result = await prisma.profesional_certifications.findFirst({
      where: { id: id },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("error dao");
  }
};

export const createUserCertificationDao = async (data: any) => {
  try {
    const result = await prisma.profesional_certifications.create({
      data,
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("error dao");
  }
};

export const updateCertificationByIdDao = async (id: number | undefined, data: any) => {
  try {
    const result = await prisma.profesional_certifications.update({
      where: { id: id },
      data: data,
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("error dao");
  }
};

export const deleteUserCertificationByIdDao = async (id: number | undefined) => {
  try {
    const result = await prisma.profesional_certifications.delete({
      where: { id: id },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("error dao");
  }
};
//experience
export const getUserExperiencesByUserIdDao = async (userId: string | undefined) => {
  try {
    const result = await prisma.experience.findMany({
      where: { user_id: userId },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("error dao");
  }
};

export const createUserExperienceDao = async (data: any) => {
  try {
    const result = await prisma.experience.create({
      data,
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("error dao");
  }
};

export const deleteUserExperienceByIdDao = async (id: number | undefined) => {
  try {
    const result = await prisma.experience.delete({
      where: { id: id },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("error dao");
  }
};

export const getUserExperienceByIdDao = async (id: number | undefined) => {
  try {
    const result = await prisma.experience.findFirst({ where: { id: id } });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("error dao");
  }
};

export const updateUserExperienceByIdDao = async (id: number | undefined, data: any) => {
  try {
    const result = await prisma.experience.update({
      where: { id: id },
      data,
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("error dao");
  }
};
