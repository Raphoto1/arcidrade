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
  deleteUserSpecialityService
} from "@/service/userData.service";
import { deleteFileService, uploadFileService } from "@/service/File.service";

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

export const getUserData = async (): Promise<[UserDataFiltered, UserMainStudyFiltered]> => {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) throw new Error("Sesión inválida");

  const userData = await getUserDataService(session.user.id);
  const userMainStudy = await getMainStudyService(session.user.id);

  if (!userData) throw new Error("No se encontró información del profesional");
  if (!userMainStudy) throw new Error("No se encontró información del estudio principal");

  const { id: _, user_id: __, ...userDataFiltered } = userData;
  const { id: ___, user_id: ____, ...userMainStudyFiltered } = userMainStudy;

  return [userDataFiltered ?? null, userMainStudyFiltered ?? null];
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

export const createSpeciality = async (data: any) => {
  try {
    console.log("data en controller", data);
//se crea pack
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    //ajuste de fecha endDate
    let endDateFix = data.endDate
    if (endDateFix === '') {
      endDateFix =null
    } else {
       endDateFix = new Date(data.endDate)
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
  return response
}

export const deleteUserSpecialitie = async (id: number) => {
  const result = await deleteUserSpecialityService(id)
  return result
}