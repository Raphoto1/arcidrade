// app immports
import { fakerES as faker } from "@faker-js/faker";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { Main_study, Profesional_data, Sub_area } from "@/generated/prisma";

// my imports
import {
  createUserDataService,
  createUserDataMainStudy,
  getUserDataService,
  getMainStudyService,
  updateUserDataService,
  updateUserMainStudyService,
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
  getAllProfesionalsService,
  getAllProfesionalsPaginatedService,
} from "@/service/userData.service";
import { deleteFileService, uploadFileService } from "@/service/File.service";
import { updateProfesionalAuthStatusDao, updateProfesionalMainStudyDao } from "@/dao/dao";
import { getInstitutionDataByUserIdService, updateInstitutionCertificationService, updateInstitutionDataService } from "@/service/institutionData.service";
import { getInstitutionCertification, updateInstitutionCertification } from "./institutionData.controller";
//user__________________________________________________________________________________
export const createUserData = async (data: any) => {
  console.log('[createUserData] Iniciando creación de datos de usuario');
  
  //se extrae el session
  const session = await getServerSession(authOptions);
  
  if (!session) {
    console.error('[createUserData] No hay sesión activa');
    throw new Error("No hay sesión de usuario activa");
  }
  
  console.log('[createUserData] Usuario:', session.user.id, 'Área:', session.user.area);
  
  //se revisa si es profesional o institution
  switch (session?.user.area) {
    case "profesional":
      try {
        console.log('[createUserData] Procesando como profesional');
        
        // Validar campo requerido
        if (!data.sub_area) {
          console.error('[createUserData] Campo requerido faltante: sub_area');
          throw new Error("El campo 'Categoría de Profesión' es requerido");
        }
        
        if (!data.name) {
          console.error('[createUserData] Campo requerido faltante: name');
          throw new Error("El campo 'Nombre' es requerido");
        }
        
        //se organiza la data para enviar a cada tabla
        const fakeNameProfesional = await faker.person.firstName();
        const profesionalDataPack = {
          user_id: session.user.id,
          fake_name: fakeNameProfesional,
          name: data.name,
          last_name: data.last_name || null,
          phone: data.phone || null,
          birth_date: data.birthDate ? new Date(data.birthDate) : null,
          country: data.country || null,
          state: data.state || null,
          city: data.city || null,
        };

        const profesionalMainStudyPack = {
          user_id: session.user.id,
          title: data.title || null,
          status: data.titleStatus || null,
          institution: data.titleInstitution || null,
          country: data.studyCountry || null,
          sub_area: data.sub_area, // Este campo es requerido
        };
        
        console.log('[createUserData] Paquete datos profesional:', JSON.stringify(profesionalDataPack, null, 2));
        console.log('[createUserData] Paquete estudio principal:', JSON.stringify(profesionalMainStudyPack, null, 2));
        
        //se envian los paquetes al service
        console.log('[createUserData] Guardando datos profesional...');
        const resultUserData = await createUserDataService(profesionalDataPack);
        console.log('[createUserData] ✓ Datos profesional guardados');
        
        console.log('[createUserData] Guardando estudio principal...');
        const resultMainStudy = await createUserDataMainStudy(profesionalMainStudyPack);
        console.log('[createUserData] ✓ Estudio principal guardado');
        
        console.log('[createUserData] Actualizando estado de autenticación...');
        const updateAuthStatus = await updateProfesionalAuthStatusDao(session.user.id, "active");
        console.log('[createUserData] ✓ Estado actualizado');
        
        console.log('[createUserData] ✓✓ Proceso completado exitosamente');
        return true;
      } catch (error) {
        console.error('[createUserData] ✗ Error en el proceso:');
        console.error('[createUserData] Error type:', error instanceof Error ? error.constructor.name : typeof error);
        console.error('[createUserData] Error message:', error instanceof Error ? error.message : String(error));
        console.error('[createUserData] Error stack:', error instanceof Error ? error.stack : 'No stack available');
        throw error instanceof Error ? error : new Error(String(error));
      }
      break;
    case "institution":
      const fakeNameInstitution = await faker.company.name();
      break;
    default:
      break;
  }


  return data;
};

export const updateUserData = async (data: any) => {

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
    return fullData;
  } catch (error) {
    console.error(error);
    throw new Error("error al subir archivo");
  }
};

export const getAllProfesionals = async () => {
  try {
    const response = await getAllProfesionalsService();
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("error al obtener todos los profesionales");
  }
};

export const getAllProfesionalsPaginated = async (page: number = 1, limit: number = 9, search?: string, speciality?: string, subArea?: string, status?: string) => {
  try {
    const response = await getAllProfesionalsPaginatedService(page, limit, search, speciality, subArea, status);
    return response;
  } catch (error) {
    console.error('Error al obtener profesionales paginados:', error);
    throw error; // Pasar el error original
  }
};

export const getProfesionalByReferCode = async (refCode: string) => {
  try {
    const profesional = await getUserFullByIdService(refCode);
    return profesional;
  } catch (error) {
    console.error(error);
    throw new Error("error al obtener profesional por referCode");
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

    if (chkUserCvFile[0].cv_file) {

      const deleteFile = await deleteFileService(chkUserCvFile[0].cv_file);

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

    if (chkUserCvFile[0].cv_file) {

      const deleteFile = await deleteFileService(chkUserCvFile[0].cv_file);

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


    if (!chkMainStudy) throw new Error("Estudio principal no encontrado");
    if (chkMainStudy?.link) {
      const updatePack = { link: link };
      const updateDb = await updateProfesionalMainStudyDao(updatePack, userId);

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
    //profesional
    if (session?.user.area === "profesional") {
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
      const dbUpdate = await updateUserData({ avatar: avatarUrl });
      return dbUpdate;
      //institution
    } else if (session?.user.area === "institution") {
      const chkInstitutionAvatar = await getInstitutionDataByUserIdService(userId);
      if (chkInstitutionAvatar?.avatar) {
        const deleteFile = await deleteFileService(chkInstitutionAvatar.avatar);
      }
      const uploadResult = await uploadFileService(file, `avatar`, userId);
      //obtengo la url del archivo y la cargo a la db
      const avatarUrl = await uploadResult?.url;
      const dbUpdate = await updateInstitutionDataService({ avatar: avatarUrl }, userId);
      return dbUpdate;
    }
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};
//speciality_______________________________________________________________________________________
export const createSpeciality = async (data: any) => {
  try {
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
      sub_area: data.subArea,
      start_date: new Date(data.startDate),
      end_date: endDateFix,
    };
    
    // Crear la especialidad
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

    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    const chk = await getSpecialityService(id);
    if (chk?.file) {

      const deleteOld = await deleteFileService(chk?.file);

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

    throw new Error();
  }
};

export const getCertificationById = async (id: number) => {
  try {
    const certificate = await getCertificationByIdService(id);
    return certificate;
  } catch (error) {

    throw new Error();
  }
};

export const updateCertification = async (id: number, data: any) => {
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
      status: data.titleStatus,
      country: data.country,
      start_date: startDateFix,
      end_date: endDateFix,
      description: data.description,
    };
    const update = await updateUserCertificationService(id, specialPack);


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
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    if (session?.user.area === "profesional") {
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
    } else if (session?.user.area === "institution") {
      //verificar si ya existe un archivo y se borra
      const chk = await getInstitutionCertification(id);
      if (chk?.file) {
        //si existe se borra el archivo antiguo
        const deleteFile = await deleteFileService(chk?.file);
        //se agrega la nueva info
        const updatePack = {
          link: link,
          file: null,
        };
        const updateDb = await updateInstitutionCertificationService(id, updatePack);
        return updateDb;
      } else {
        const updateDb = await updateInstitutionCertificationService(id, { link: link });
        return updateDb;
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error("error al subir Link");
  }
};

export const uploadUserCertificationFile = async (id: number, file: any) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  if (session?.user.area === "profesional") {
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
  } else if (session?.user.area === "institution") {
    //verificar si ya existe un archivo y se borra
    const chk = await getInstitutionCertification(id);
    if (chk?.link) {
      //se elimina el link y se agrega el archivo
      const uploadFile = await uploadFileService(file, "certification", userId);
      const updatePack = { link: null, file: uploadFile.url };
      const updateDb = await updateInstitutionCertificationService(id, updatePack);
      return updateDb;
    } else if (chk?.file) {
      //se elimina el archivo y se agrega el nuevo archivo
      const deleteBlob = await deleteFileService(chk.file);
      const uploadFile = await uploadFileService(file, "certification", userId);
      const updateDb = await updateInstitutionCertificationService(id, { file: uploadFile.url });
      return updateDb;
    } else {
      const uploadFile = await uploadFileService(file, "certification", userId);
      const updateDb = await updateInstitutionCertificationService(id, { file: uploadFile.url });
      return updateDb;
    }
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

    throw new Error();
  }
};

export const getUserExperienceById = async (id: number) => {
  try {
    const result = await getUserExperienceByIdService(id);
    return result;
  } catch (error) {

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
