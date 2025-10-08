import { deleteFileService, uploadFileService } from "@/service/File.service";
import {
  createInstitutionDataService,
  createInstitutionSpecialityService,
  getInstitutionDataByUserIdService,
  updateInstitutionDataService,
  getInstitutionSpecialitiesService,
  deleteInstitutionSpecialityService,
  getInstitutionSpecialityService,
  updateInstitutionSpecialityService,
  getInstitutionCertificationsService,
  createInstitutionCertificationService,
  getInstitutionCertificationService,
  updateInstitutionCertificationService,
  deleteInstitutionCertificationService,
  getInstitutionGoalsService,
  createInstitutionGoalService,
  getInstitutionGoalService,
  updateInstitutionGoalService,
  deleteInstitutionGoalService,
  getInstitutionDataFullByUserIdService,
  getAllInstitutionsService,
  getAllInstitutionsPaginatedService,
} from "@/service/institutionData.service";
import { authOptions } from "@/utils/authOptions";
import { fakerES as faker } from "@faker-js/faker";
import { get } from "http";
import { getServerSession } from "next-auth";

export const getInstitutionData = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const institutionData = await getInstitutionDataByUserIdService(userId);
  const institutionDataFiltered = {} as any;
  if (institutionData == null) {
    return institutionDataFiltered;
  }
  return institutionData;
};

export const getInstitutionDataFull = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const institutionData = await getInstitutionDataFullByUserIdService(userId);
  return institutionData;
};

export const getInstitutionDataFullById = async (id: string) => {
  const institutionData = await getInstitutionDataFullByUserIdService(id);
  return institutionData;
}

export const getInstitutionDataByReferCode = async (id: string) => {
  const institutionData = await getInstitutionDataByUserIdService(id);
  return institutionData;
};

export const createInstitutionData = async (data: any) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  //AQUI SE PUEDE NORMALIZAR LA DATA EN CASO DE SER NECESARIO
  const chk = await getInstitutionDataByUserIdService(userId);
  if (chk) {
    const fake_name = faker.company.name();
    const uploadPack = {
      name: data.name,
      fake_name: fake_name,
      established: new Date(data.foundationDate),
      phone: data.contactNumber,
      country: data.country,
      state: data.state,
      city: data.city,
      main_speciality: data.specialization,
      company_id: data.nif,
      website: data.web,
    };
    const response = await updateInstitutionDataService(uploadPack, userId);
    return response;
  } else {
    const fake_name = faker.company.name();
    const uploadPack = {
      user_id: userId,
      name: data.name,
      fake_name: fake_name,
      established: new Date(data.foundationDate),
      phone: data.contactNumber,
      country: data.country,
      state: data.state,
      city: data.city,
      main_speciality: data.specialization,
      company_id: data.nif,
      website: data.web,
      avatar: "", // Provide a default or from data if available
      status: "active", // Or another default status
    };
    const response = await createInstitutionDataService(uploadPack);
    return response;
  }
};

export const updateInstitutionData = async (data: any) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const response = await updateInstitutionDataService(data, userId);
  return response;
};
//speciality
export const createInstitutionSpeciality = async (data: any) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const uploadPack = {
    user_id: userId,
    title: data.title,
    title_category: data.title_category,
  };
  const response = await createInstitutionSpecialityService(uploadPack);
  return response;
};

export const getInstitutionSpecialities = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const response = await getInstitutionSpecialitiesService(userId);
  return response;
};

export const getInstitutionSpeciality = async (id: number) => {
  const speciality = await getInstitutionSpecialityService(id);
  return speciality;
};

export const deleteInstitutionSpeciality = async (id: number) => {
  const response = await deleteInstitutionSpecialityService(id);
  return response;
};

export const updateInstitutionSpeciality = async (id: number, data: any) => {
  //AQUI SE PUEDE NORMALIZAR LA DATA EN CASO DE SER NECESARIO
  const specialPack = {
    title: data.title,
    title_category: data.title_category,
  };
  const update = await updateInstitutionSpecialityService(id, specialPack);
  return update;
};

export const getInstitutionCertifications = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const response = await getInstitutionCertificationsService(userId);
  return response;
};

export const createInstitutionCertification = async (data: any) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const uploadPack = {
    user_id: userId,
    title: data.title,
    institution: data.institution,
    year: new Date(data.year),
    description: data.description || "",
  };
  const response = await createInstitutionCertificationService(uploadPack);
  return response;
};

export const getInstitutionCertification = async (id: number) => {
  const certification = await getInstitutionCertificationService(id);
  return certification;
};

export const updateInstitutionCertification = async (id: number, data: any) => {
  //AQUI SE PUEDE NORMALIZAR LA DATA EN CASO DE SER NECESARIO
  const certPack = {
    title: data.title,
    institution: data.institution,
    year: new Date(data.year),
    description: data.description || "",
  };
  const update = await updateInstitutionCertificationService(id, certPack);
  return update;
};

export const deleteInstitutionCertification = async (id: number) => {
  const chk = await getInstitutionCertificationService(id);
  if (chk?.file) {
    //eliminar el archivo
    const deleteFile = await deleteFileService(chk.file);
    const deleteCert = await deleteInstitutionCertificationService(id);
    return deleteCert;
  } else {
    const deleteCert = await deleteInstitutionCertificationService(id);
    return deleteCert;
  }
};
//goals
export const getInstitutionGoals = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const response = await getInstitutionGoalsService(userId);
  return response;
};

export const createInstitutionGoal = async (data: any) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const uploadPack = {
    user_id: userId,
    title: data.title,
    year: new Date(data.year),
    description: data.description || "",
  };
  const response = await createInstitutionGoalService(uploadPack);
  return response;
};

export const getInstitutionGoal = async (id: number) => {
  const goal = await getInstitutionGoalService(id);
  return goal;
};

export const updateInstitutionGoal = async (id: number, data: any) => {
  //AQUI SE PUEDE NORMALIZAR LA DATA EN CASO DE SER NECESARIO
  const goalPack = {
    title: data.title,
    year: new Date(data.year),
    description: data.description || "",
  };
  const update = await updateInstitutionGoalService(id, goalPack);
  return update;
};

export const uploadInstitutionGoalLink = async (id: number, link: any) => {
  //verificar si ya existe un archivo y se borra
  const chk = await getInstitutionGoal(id);
  if (chk?.file) {
    //si existe se borra el archivo antiguo
    const deleteFile = await deleteFileService(chk?.file);
    //se agrega la nueva info
    const updatePack = {
      link: link,
      file: null,
    };
    const updateDb = await updateInstitutionGoalService(id, updatePack);
    return updateDb;
  } else {
    const updateDb = await updateInstitutionGoalService(id, { link: link });
    return updateDb;
  }
};

export const uploadInstitutionGoalFile = async (id: number, file: File) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  //verificar si ya existe un archivo y se borra
  const chk = await getInstitutionGoal(id);
  if (chk?.link) {
    //se elimina el link y se agrega el archivo
    const uploadFile = await uploadFileService(file, "goal", userId);
    const updatePack = { link: null, file: uploadFile.url };
    const updateDb = await updateInstitutionGoalService(id, updatePack);
    return updateDb;
  } else if (chk?.file) {
    //se elimina el archivo y se agrega el nuevo archivo
    const deleteBlob = await deleteFileService(chk.file);
    const uploadFile = await uploadFileService(file, "goal", userId);
    const updateDb = await updateInstitutionGoalService(id, { file: uploadFile.url });
    return updateDb;
  } else {
    const uploadFile = await uploadFileService(file, "goal", userId);
    const updateDb = await updateInstitutionGoalService(id, { file: uploadFile.url });
    return updateDb;
  }
};

export const deleteInstitutionGoal = async (id: number) => {
  const chk = await getInstitutionGoal(id);
  if (chk?.file) {
    //eliminar el archivo
    const deleteFile = await deleteFileService(chk.file);
    const deleteGoal = await deleteInstitutionGoalService(id);
    return deleteGoal;
  } else {
    const deleteGoal = await deleteInstitutionGoalService(id);
    return deleteGoal;
  }
};

export const getAllInstitutions = async () => {
  try {
    const response = await getAllInstitutionsService();
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("error al obtener todas las instituciones");
  }
};

export const getAllInstitutionsPaginated = async (page: number = 1, limit: number = 9, search?: string, country?: string, specialization?: string) => {
  try {
    const response = await getAllInstitutionsPaginatedService(page, limit, search, country, specialization);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("error al obtener instituciones paginadas");
  }
};
