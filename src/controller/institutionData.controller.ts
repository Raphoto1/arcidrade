import { createInstitutionDataService, getInstitutionDataByUserIdService, updateInstitutionDataService } from "@/service/institutionData.service";
import { authOptions } from "@/utils/authOptions";
import { fakerES as faker } from "@faker-js/faker";
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
      }
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
      }
    const response = await createInstitutionDataService(uploadPack);
    return response;
  }
};
