// app immports
import { fakerES as faker } from "@faker-js/faker";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
// my imports
import { createUserDataService, createUserDataMainStudy } from "@/service/userData.service";



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
        console.log(resultMainStudy);
        
        return true;
      } catch (error) {
        console.error(error);
        
        throw new Error('error en userdatacontroller');
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
};

export const getUserData = async () => {
  const userData = {
    name: 'rafa',
    last_name:'test'
  }
  return userData
}