// app immports
import { fakerES as faker } from "@faker-js/faker";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
// my imports
import { createUserDataService, createUserDataMainStudy } from "@/service/userData.service";
//types
import type { UserDataCatch } from "@/types/backendTypes/userDataCatchType";
import type { Profesional_data } from "@prisma/client";

export const createUserData = async (data: UserDataCatch) => {
  //se extrae el session
  const session = await getServerSession(authOptions);
  //se revisa si es profesional o institution
  switch (session?.user.area) {
    case "profesional":
      console.log("es profesional");
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
      console.log("profesionalDataPack", profesionalDataPack);
      //se envian los paquetes al service
      createUserDataService(profesionalDataPack);
      createUserDataMainStudy(profesionalMainStudyPack)
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
