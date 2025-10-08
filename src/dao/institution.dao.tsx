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

export const getInstitutionFullByUserIdDao = async (user_id: string | undefined) => {
  try {
    const fullInstitution = await prisma.auth.findFirst({
      where: { referCode: user_id },
      include: {
        institution_data: true,
        institution_specialization: true,
        institution_certifications: true,
        goals: true,
      },
    });
    if (fullInstitution) {
      const { password, ...safeUser } = fullInstitution;
      return safeUser;
    }
  } catch (error) {
    console.log("error de Profesional data full", error);
    throw new Error("Error al obtener profesional full");
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
//certifications
export const getInstitutionCertificationsDao = async (userId: string | undefined) => {
  try {
    const certifications = await prisma.institution_Certifications.findMany({
      where: { user_id: userId },
    });
    return certifications;
  } catch (error) {
    console.error("error de get institution Certifications Dao", error);
    throw new Error("Error al obtener certificaciones");
  }
};

export const createInstitutionCertificationDao = async (data: any) => {
  try {
    const newCertification = await prisma.institution_Certifications.create({
      data,
    });
    return newCertification;
  } catch (error) {
    console.error("error de create institution Certification Dao", error);
    throw new Error("Error al crear certificación");
  }
};

export const getInstitutionCertificationByIdDao = async (id: number) => {
  try {
    const certification = await prisma.institution_Certifications.findUnique({
      where: { id },
    });
    return certification;
  } catch (error) {
    console.error("error de get institution Certification By Id Dao", error);
    throw new Error("Error al obtener certificación");
  }
};

export const updateInstitutionCertificationDao = async (id: number, data: any) => {
  try {
    const updatedCertification = await prisma.institution_Certifications.update({
      where: { id },
      data,
    });
    return updatedCertification;
  } catch (error) {
    console.error("error de update institution Certification Dao", error);
    throw new Error("Error al actualizar certificación");
  }
};

export const deleteInstitutionCertificationDao = async (id: number) => {
  try {
    const deletedCertification = await prisma.institution_Certifications.delete({
      where: { id },
    });
    return deletedCertification;
  } catch (error) {
    console.error("error de delete institution Certification Dao", error);
    throw new Error("Error al eliminar certificación");
  }
};

//goals
export const getInstitutionGoalsDao = async (userId: string | undefined) => {
  try {
    const goals = await prisma.goals.findMany({
      where: { user_id: userId },
    });
    return goals;
  } catch (error) {
    console.error("error de get institution Goals Dao", error);
    throw new Error("Error al obtener objetivos");
  }
};

export const createInstitutionGoalDao = async (data: any) => {
  try {
    const newGoal = await prisma.goals.create({ data });
    return newGoal;
  } catch (error) {
    console.error("error de create institution Goal Dao", error);
    throw new Error("Error al crear objetivo");
  } 
};

export const getInstitutionGoalByIdDao = async (id: number) => {
  try {
    const goal = await prisma.goals.findUnique({
      where: { id },
    });
    return goal;
  } catch (error) {
    console.error("error de get institution Goal By Id Dao", error);
    throw new Error("Error al obtener objetivo");
  }
};

export const updateInstitutionGoalDao = async (id: number, data: any) => {
  try {
    const updatedGoal = await prisma.goals.update({
      where: { id },
      data,
    });
    return updatedGoal;
  } catch (error) {
    console.error("error de update institution Goal Dao", error);
    throw new Error("Error al actualizar objetivo");
  }
};

export const deleteInstitutionGoalDao = async (id: number) => {
  try {
    const deletedGoal = await prisma.goals.delete({
      where: { id },
    });
    return deletedGoal;
  } catch (error) {
    console.error("error de delete institution Goal Dao", error);
    throw new Error("Error al eliminar objetivo");
  }
};

// Funciones para obtener todas las instituciones
export const getAllInstitutionsDao = async () => {
  try {
    const institutions = await prisma.auth.findMany({
      where: {
        area: "institution",
        status: "registered",
      },
      select: {
        referCode: true,
      },
    });
    return institutions;
  } catch (error) {
    console.log("error de getAllInstitutionsDao", error);
    throw new Error("Error al obtener todas las instituciones");
  }
};

export const getAllInstitutionsPaginatedDao = async (page: number = 1, limit: number = 9, search?: string, country?: string, specialization?: string) => {
  try {
    const skip = (page - 1) * limit;
    
    // Construir el where clause con búsqueda y filtros
    const whereClause: any = {
      area: "institution",
      status: "registered",
    };

    // Array para condiciones OR y AND
    const orConditions: any[] = [];
    const andConditions: any[] = [];

    // Si hay término de búsqueda, agregarlo a las condiciones OR
    if (search && search.trim()) {
      orConditions.push(
        {
          institution_data: {
            some: {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { fake_name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { main_speciality: { contains: search, mode: 'insensitive' } },
              ]
            }
          }
        },
        {
          institution_specialization: {
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
          institution_certifications: {
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

    // Si hay filtro por país
    if (country && country.trim()) {
      andConditions.push({
        institution_data: {
          some: {
            country: { contains: country, mode: 'insensitive' }
          }
        }
      });
    }

    // Si hay filtro por especialización
    if (specialization && specialization.trim()) {
      andConditions.push({
        OR: [
          // Buscar en institution_specialization
          {
            institution_specialization: {
              some: {
                OR: [
                  { title: { contains: specialization, mode: 'insensitive' } },
                  { title_category: { contains: specialization, mode: 'insensitive' } }
                ]
              }
            }
          },
          // Buscar en main_speciality de institution_data
          {
            institution_data: {
              some: {
                main_speciality: { contains: specialization, mode: 'insensitive' }
              }
            }
          }
        ]
      });
    }

    // Construir la cláusula final
    if (orConditions.length > 0 && andConditions.length > 0) {
      // Si hay ambos filtros: (búsqueda) AND (otros filtros)
      whereClause.AND = [
        { OR: orConditions },
        ...andConditions
      ];
    } else if (orConditions.length > 0) {
      // Solo búsqueda
      whereClause.OR = orConditions;
    } else if (andConditions.length > 0) {
      // Solo filtros
      whereClause.AND = andConditions;
    }
    
    const [institutions, total] = await Promise.all([
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
      data: institutions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + limit < total,
      search: search || '',
      country: country || '',
      specialization: specialization || ''
    };
  } catch (error) {
    console.log("error de getAllInstitutionsPaginatedDao", error);
    throw new Error("Error al obtener instituciones paginadas");
  }
};
