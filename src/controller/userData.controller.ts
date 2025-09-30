// app immports
import { fakerES as faker } from "@faker-js/faker";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { Main_study, Profesional_data } from "@prisma/client";

// my imports
import {
  createUserDataService,
  createUserDataMainStudy,
  getUserDataService,
  getMainStudyService,
  updateUserDataService,
  createUserSpecialityService,
  getUserSpecialitiesService,
  deleteUserSpecialityService,
  getSpecialityService,
  updateUserSpecializationService,
  makeFavoriteSpecialityService,
  getUserCertificationsService,
  createUserCertificationService,
  getCertificationByIdService,
  updateUserCertificationService,
  deleteUserCertificationService,
  getUserExperiencesService,
  createUserExperienceService,
  getUserExperienceByIdService,
  deleteUserExperienceService,
  updateUserExperienceService,
  getUserFullByIdService,
} from "@/service/userData.service";
import { deleteFileService, uploadFileService } from "@/service/File.service";
import { updateProfesionalMainStudyDao } from "@/dao/dao";
//user__________________________________________________________________________________
export const createUserData = async (data: any) => {
  //se extrae el session
  const session = await getServerSession(authOptions);
  //se revisa si es profesional o institution
  switch (session?.user.area) {
    case "profesional":
      try {
        //se organiza la data para enviar a cada tabla
        const fakeNameProfesional = await faker.person.firstName();
        const profesionalDataPack = {
          user_id: session.user.id,
          fake_name: fakeNameProfesional,
          name: data.name,
          last_name: data.last_name,
          phone: data.phone,
          birth_date: new Date(data.birthDate),
          country: data.country,
          state: data.state,
          city: data.city,
        };
        const profesionalMainStudyPack = {
          user_id: session.user.id,
          title: data.title,
          status: data.titleStatus,
          institution: data.titleInstitution,
          country: data.studyCountry,
        };
        //se envian los paquetes al service
        const resultUserData = await createUserDataService(profesionalDataPack);
        const resultMainStudy = await createUserDataMainStudy(profesionalMainStudyPack);
        return true;
      } catch (error) {
        console.error(error);

        throw new Error("error en userdatacontroller");
      }
      break;
    case "institution":
      console.log("es institution");
      const fakeNameInstitution = await faker.company.name();
      break;
    default:
      break;
  }

  console.log("data en el controller de userData", data);
  return data;
};

export const updateUserData = async (data: any) => {
  console.log("actualizo");
  try {
    const result = updateUserDataService(data);
    return result;
  } catch (error) {
    throw new Error("error actualizando");
  }
};

type UserDataFiltered = Omit<Profesional_data, "id" | "user_id">;
type UserMainStudyFiltered = Omit<Main_study, "id" | "user_id">;

export const getUserData = async (): Promise<any> => {
  //revisar que si sea una sesion valida
  const session = await getServerSession(authOptions);
  if (!session?.user.id) throw new Error("Sesión inválida");
  //buscar en db
  let userData = await getUserDataService(session.user.id);
  let userMainStudy = await getMainStudyService(session.user.id);
  //crear estructura de datos son id ni user_id
  const userDataFiltered = {} as UserDataFiltered;
  const userMainStudyFiltered = {} as UserMainStudyFiltered;
  //revisar si userData esta vacio y enviar la data vacia con el structure o completa
  if (userData == null) {
    return [userDataFiltered, userMainStudyFiltered];
  } else {
    const sendPack = [userData ?? null, userMainStudy ?? null];
    return sendPack;
  }
};

export const getUserFull = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) throw new Error("Sesión inválida");
    const userId = session?.user.id;
    const fullData = await getUserFullByIdService(userId);
    return fullData
  } catch (error) {
    console.error(error);
    throw new Error("error al subir archivo");
  }
};

export const uploadUserCv = async (file: File) => {
  try {
    const session = await getServerSession(authOptions);
    let userId = session?.user.id;
    const chkUserCvFile = await getUserData();
    if (chkUserCvFile[0].cv_file) {
      const deleteFile = await deleteFileService(chkUserCvFile[0].cv_file);
    }
    if (!session) {
      userId = "error";
    }
    const uploadResult = await uploadFileService(file, `cv`, userId);
    //obtengo la url del archivo y la cargo a la db
    const cvUrl = await uploadResult?.url;
    const dbUpdate = await updateUserData({ cv_file: cvUrl });
    return dbUpdate;
  } catch (error) {
    console.error(error);
    throw new Error("error al subir archivo");
  }
};

export const uploadUserCvLink = async (link: any) => {
  try {
    const chkUserCvFile = await getUserData();
    console.log("chkUserCvFile", chkUserCvFile[0].cv_file);
    if (chkUserCvFile[0].cv_file) {
      console.log("elimino el archivo");
      const deleteFile = await deleteFileService(chkUserCvFile[0].cv_file);
      console.log("deletefileService desde controller", deleteFile);
    }
    const dbUpdate = await updateUserData({ cv_link: link, cv_file: null });
    //limpiar file si existe
    return dbUpdate;
  } catch (error) {
    console.error(error);
    throw new Error("error al subir Link");
  }
};

export const deleteCv = async () => {
  try {
    const chkUserCvFile = await getUserData();
    console.log("chkUserCvFile", chkUserCvFile[0].cv_file);
    if (chkUserCvFile[0].cv_file) {
      console.log("elimino el archivo");
      const deleteFile = await deleteFileService(chkUserCvFile[0].cv_file);
      console.log("deletefileService desde controller", deleteFile);
    }
    const dbUpdate = await updateUserData({ cv_link: null, cv_file: null });
    //limpiar file si existe
    return dbUpdate;
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};

export const uploadUserMainStudyLink = async (link: any) => {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    const chkMainStudy = await getMainStudyService(userId);
    console.log("link de mainstudy controller", link);
    console.log("encuentro el main", chkMainStudy?.user_id);
    if (!chkMainStudy) throw new Error("Estudio principal no encontrado");
    if (chkMainStudy?.link) {
      const updatePack = { link: link };
      const updateDb = await updateProfesionalMainStudyDao(updatePack, userId);
      console.log("updateDb controller", updateDb);
      return updateDb;
    }
    if (chkMainStudy?.file) {
      const deleteFile = await deleteFileService(chkMainStudy?.file);
      const updatePack = { link: link, file: null };
      const updateResult = await updateProfesionalMainStudyDao(updatePack, userId);
      return updateResult;
    }
    const updatePack = { link: link };
    const updateDb = await updateProfesionalMainStudyDao(updatePack, userId);
    console.log("updateDb controller", updateDb);
    return updateDb;
  } catch (error) {
    console.error(error);
    throw new Error("error al subir Link");
  }
};

export const uploadUserMainStudyFile = async (file: File) => {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    const chkMainStudy = await getMainStudyService(userId);
    if (!chkMainStudy) throw new Error("Estudio principal no encontrado");
    if (chkMainStudy?.link) {
      const uploadFile = await uploadFileService(file, "mainStudy", userId);
      const updatePack = { link: null, file: uploadFile.url };
      const updateDb = await updateProfesionalMainStudyDao(updatePack, userId);
      return updateDb;
    }
    if (chkMainStudy?.file) {
      const deleteFile = await deleteFileService(chkMainStudy?.file);
      const uploadFile = await uploadFileService(file, "mainStudy", userId);
      const updatePack = { file: uploadFile.url };
      const updateResult = await updateProfesionalMainStudyDao(updatePack, userId);
      return updateResult;
    }
    const uploadFile = await uploadFileService(file, "mainStudy", userId);
    const updatePack = { file: uploadFile.url };
    const updateResult = await updateProfesionalMainStudyDao(updatePack, userId);
    return updateResult;
  } catch (error) {
    console.error(error);
    throw new Error("error al subir archivo");
  }
};

export const deleteUserMainStudy = async () => {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    const chkMainStudy = await getMainStudyService(userId);
    if (chkMainStudy?.file) {
      const deleteFile = await deleteFileService(chkMainStudy?.file);
      const updateDb = await updateProfesionalMainStudyDao({ file: null }, userId);
      return updateDb;
    } else {
      const updateDb = await updateProfesionalMainStudyDao({ link: null }, userId);
      return updateDb;
    }
  } catch (error) {
    console.error(error);
    throw new Error("error al Borrar Main");
  }
};

export const uploadUserAvatar = async (file: File) => {
  try {
    const session = await getServerSession(authOptions);
    let userId = session?.user.id;
    const chkUserAvatar = await getUserData();
    if (chkUserAvatar[0].avatar) {
      const deleteFile = await deleteFileService(chkUserAvatar[0].avatar);
    }
    if (!session) {
      userId = "error";
    }
    const uploadResult = await uploadFileService(file, `avatar`, userId);
    //obtengo la url del archivo y la cargo a la db
    const avatarUrl = await uploadResult?.url;
    console.log(avatarUrl);

    const dbUpdate = await updateUserData({ avatar: avatarUrl });
    return dbUpdate;
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};
//speciality_______________________________________________________________________________________
export const createSpeciality = async (data: any) => {
  try {
    console.log("data en controller", data);
    //se crea pack
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    //ajuste de fecha endDate
    let endDateFix = data.endDate;
    if (endDateFix === "") {
      endDateFix = null;
    } else {
      endDateFix = new Date(data.endDate);
    }
    const specialPack = {
      user_id: userId,
      institution: data.titleInstitution,
      title: data.title,
      title_category: data.title_category,
      status: data.titleStatus,
      country: data.country,
      start_date: new Date(data.startDate),
      end_date: endDateFix,
    };
    const create = await createUserSpecialityService(specialPack);
    return create;
  } catch (error) {
    console.error(error);
    throw new Error("error en controller");
  }
};

export const getUserSpecialities = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) throw new Error("Sesión inválida");
  const userId = session?.user.id;
  const response = await getUserSpecialitiesService(userId);
  return response;
};

export const getSpeciality = async (id: number) => {
  try {
    const chk = getSpecialityService(id);
    return chk;
  } catch (error) {
    throw new Error("no existe la speci");
  }
};

export const deleteUserSpecialitie = async (id: number) => {
  //revisar si hay archivos para eliminarlos
  const chkFiles = await getSpeciality(id);
  if (chkFiles?.file) {
    const deleteFiles = await deleteFileService(chkFiles.file);
  }
  const result = await deleteUserSpecialityService(id);
  return result;
};

export const updateSpecialization = async (id: number, data: any) => {
  try {
    const result = updateUserSpecializationService(id, data);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("error al actualizar spe");
  }
};

export const uploadSpecialityLink = async (id: number, link: any) => {
  try {
    //verificar si ya existe un archivo y se bor
    const chk = await getSpecialityService(id);
    if (chk?.file) {
      const deleteFile = await deleteFileService(chk?.file);
      const updatePack = { link: link, file: null };
      const updateResult = await updateUserSpecializationService(id, updatePack);
      return updateResult;
    } else {
      const updatePack = { link: link };
      const updateResult = await updateUserSpecializationService(id, updatePack);

      return updateResult;
    }
  } catch (error) {
    console.error(error);
    throw new Error("error al subir Link");
  }
};

export const uploadUserSpecialityFile = async (id: number, file: File) => {
  try {
    console.log("entro a upload spefile");
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    const chk = await getSpecialityService(id);
    if (chk?.file) {
      console.log("si hay archivo y se borra");
      const deleteOld = await deleteFileService(chk?.file);
      console.log(deleteOld);
      const uploadNewFile = await uploadFileService(file, "specialization", userId);
      const uploadUrl = uploadNewFile.url;
      const updateDb = await updateUserSpecializationService(id, { file: uploadUrl });
      return updateDb;
    }
    const uploadNewFile = await uploadFileService(file, "specialization", userId);
    const uploadUrl = uploadNewFile.url;
    const updateDb = await updateUserSpecializationService(id, { file: uploadUrl });
    return updateDb;
  } catch (error) {
    console.error(error);
    throw new Error("error al subir archivo");
  }
};
//DESARROLLO FUTURO
export const makeFavoriteSpeciality = async (study_speciality_id: number) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  //revisar si ya hay algun favorito con el id del study specialization
  const result = await makeFavoriteSpecialityService(userId, study_speciality_id);
  return result;
};
//certifications____________________________________________________________________________
export const getUserCertifications = async () => {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    //se envia a service
    const certificates = await getUserCertificationsService(userId);
    return certificates;
  } catch (error) {
    console.log("Error al obtener certificaciones", error);
    throw new Error();
  }
};

export const createUserCertification = async (data: any) => {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    let endDateFix = data.endDate;
    if (endDateFix === "") {
      endDateFix = null;
    } else {
      endDateFix = new Date(data.endDate);
    }
    //se normaliza la info
    const certPack = {
      user_id: userId,
      title: data.title,
      status: data.titleStatus,
      start_date: new Date(data.startDate),
      end_date: endDateFix,
      country: data.country,
      institution: data.titleInstitution,
      description: data.description,
    };
    //se envia a service
    const result = await createUserCertificationService(userId, certPack);
    return result;
  } catch (error) {
    console.log("Error al obtener certificaciones", error);
    throw new Error();
  }
};

export const getCertificationById = async (id: number) => {
  try {
    const certificate = await getCertificationByIdService(id);
    return certificate;
  } catch (error) {
    console.log("Error al obtener certificaciones", error);
    throw new Error();
  }
};

export const updateCertification = async (id: number, data: any) => {
  try {
    console.log("data en controller cert", data);
    //normalizar la info
    //aajuste de enddate
    let endDateFix = data.endDate;
    if (endDateFix === "") {
      endDateFix = null;
    } else {
      endDateFix = new Date(data.endDate);
    }
    //ajuste de startdate
    let startDateFix = data.startDate;
    if (startDateFix === "") {
      startDateFix = null;
    } else {
      startDateFix = new Date(data.startDate);
    }
    const specialPack = {
      institution: data.titleInstitution,
      title: data.title,
      status: data.titleStatus,
      country: data.country,
      start_date: startDateFix,
      end_date: endDateFix,
      description: data.description,
    };
    const update = await updateUserCertificationService(id, specialPack);
    console.log("update de cert", update);

    return update;
  } catch (error) {
    console.error(error);
    throw new Error("error al Actualizar");
  }
};

export const deleteUserCertification = async (id: number) => {
  //revisar si hay archivos para eliminarlos
  const chkFiles = await getCertificationById(id);
  if (chkFiles?.file) {
    const deleteFiles = await deleteFileService(chkFiles.file);
    const deleteCert = await deleteUserCertificationService(id);
    return deleteCert;
  } else {
    const result = await deleteUserCertificationService(id);
    return result;
  }
};

export const uploadUserCertificationLink = async (id: number, link: any) => {
  try {
    //verificar si ya existe un archivo y se borra
    const chk = await getCertificationById(id);
    if (chk?.file) {
      //si existe se borra el archivo antiguo
      const deleteFile = await deleteFileService(chk?.file);
      //se agrega la nueva info
      const updatePack = {
        link: link,
        file: null,
      };
      const updateDb = await updateUserCertificationService(id, updatePack);
      return updateDb;
    } else {
      const updateDb = await updateUserCertificationService(id, { link: link });
      return updateDb;
    }
  } catch (error) {
    console.error(error);
    throw new Error("error al subir Link");
  }
};

export const uploadUserCertificationFile = async (id: number, file: any) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  //verificar si ya existe un archivo y se borra
  const chk = await getCertificationById(id);
  if (chk?.link) {
    //se elimina el link y se agrega el archivo
    const uploadFile = await uploadFileService(file, "certification", userId);
    const updatePack = { link: null, file: uploadFile.url };
    const updateDb = await updateUserCertificationService(id, updatePack);
    return updateDb;
  } else if (chk?.file) {
    //se elimina el archivo y se agrega el nuevo archivo
    const deleteBlob = await deleteFileService(chk.file);
    const uploadFile = await uploadFileService(file, "certification", userId);
    const updateDb = await updateUserCertificationService(id, { file: uploadFile.url });
    return updateDb;
  } else {
    const uploadFile = await uploadFileService(file, "certification", userId);
    const updateDb = await updateUserCertificationService(id, { file: uploadFile.url });
    return updateDb;
  }
};
//experience___________________________________________________________________________________
export const getUserExperiences = async () => {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    const response = await getUserExperiencesService(userId);
    return response;
  } catch (error) {
    console.log("Error al obtener Experiencia", error);
    throw new Error();
  }
};

export const getUserExperienceById = async (id: number) => {
  try {
    const result = await getUserExperienceByIdService(id);
    return result;
  } catch (error) {
    console.log("Error al obtener certificaciones", error);
    throw new Error();
  }
};

export const createUserExperience = async (data: any) => {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    //ajuste de fecha endDate
    let endDateFix = data.endDate;
    if (endDateFix === "") {
      endDateFix = null;
    } else {
      endDateFix = new Date(data.endDate);
    }
    const userPack = {
      user_id: userId,
      title: data.title,
      institution: data.institution,
      start_date: new Date(data.startDate),
      end_date: endDateFix,
      country: data.country,
      state: data.state,
      city: data.city,
      description: data.description,
    };
    const response = await createUserExperienceService(userPack);
    return response;
  } catch (error) {
    console.log("Error al crear Experiencia", error);
    throw new Error();
  }
};

export const deleteUserExperience = async (id: number) => {
  try {
    const chk = await getUserExperienceByIdService(id);
    if (chk?.file) {
      const deleteFile = await deleteFileService(chk.file);
      const deleteUser = await deleteUserExperienceService(id);
      return deleteUser;
    } else {
      const deleteUser = await deleteUserExperienceService(id);
      return deleteUser;
    }
  } catch (error) {
    console.log("Error al obtener certificaciones", error);
    throw new Error();
  }
};

export const updateUserExperience = async (id: number, data: any) => {
  try {
    //normalizar la info
    //aajuste de enddate
    let endDateFix = data.endDate;
    if (endDateFix === "") {
      endDateFix = null;
    } else {
      endDateFix = new Date(data.endDate);
    }
    //ajuste de startdate
    let startDateFix = data.startDate;
    if (startDateFix === "") {
      startDateFix = null;
    } else {
      startDateFix = new Date(data.startDate);
    }
    const specialPack = {
      institution: data.titleInstitution,
      title: data.title,
      country: data.country,
      state: data.state,
      city: data.city,
      start_date: startDateFix,
      end_date: endDateFix,
      description: data.description,
    };
    const response = await updateUserExperienceService(id, specialPack);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("error al Actualizar");
  }
};

export const uploadUserExperienceLink = async (id: number, link: any) => {
  try {
    //verificar si ya existe un archivo y se borra
    const chk = await getUserExperienceByIdService(id);
    if (chk?.file) {
      //si existe se borra el archivo antiguo
      const deleteFile = await deleteFileService(chk?.file);
      //se agrega la nueva info
      const updatePack = {
        link: link,
        file: null,
      };
      const updateDb = await updateUserExperienceService(id, updatePack);
      return updateDb;
    } else {
      const updateDb = await updateUserExperienceService(id, { link: link });
      return updateDb;
    }
  } catch (error) {
    console.error(error);
    throw new Error("error al subir Link");
  }
};

export const uploadUserExperienceFile = async (id: number, file: any) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  //verificar si ya existe un archivo y se borra
  const chk = await getUserExperienceByIdService(id);
  if (chk?.link) {
    //se elimina el link y se agrega el archivo
    const uploadFile = await uploadFileService(file, "experience", userId);
    const updatePack = { link: null, file: uploadFile.url };
    const updateDb = await updateUserExperienceService(id, updatePack);
    return updateDb;
  } else if (chk?.file) {
    //se elimina el archivo y se agrega el nuevo archivo
    const deleteBlob = await deleteFileService(chk.file);
    const uploadFile = await uploadFileService(file, "experience", userId);
    const updateDb = await updateUserExperienceService(id, { file: uploadFile.url });
    return updateDb;
  } else {
    const uploadFile = await uploadFileService(file, "experience", userId);
    const updateDb = await updateUserExperienceService(id, { file: uploadFile.url });
    return updateDb;
  }
};
