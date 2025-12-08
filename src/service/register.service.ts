import prisma from "@/utils/db";
import { AreasAvailable, SenderNum, StatusAvailable } from "@/generated/prisma";
import { encrypt } from "@/utils/encrypter";
import { fakerES as faker } from "@faker-js/faker";

enum area {
  institution,
  profesional,
  manager,
  collab,
  campaign,
}

export async function registerUser(email: string, area: string, invitation_sender?: string, invitation_sender_id?: string) {
  // revisar el sender para saber si es un extender

  if ((invitation_sender && invitation_sender_id === "") || null) {
    invitation_sender = "external";
    invitation_sender_id = "external";
  }
  // encryptar pass
  try {
    const user = await prisma.auth.create({
      data: {
        email: email as string,
        area: area as AreasAvailable,
        status: "invited" as StatusAvailable, // Enum válido
        password: "" as string,
        invitation_sender: (invitation_sender as SenderNum) || "external", // Enum válido
        invitation_sender_id: invitation_sender_id || "external", // O el id real del usuario que invita
      },
    });

    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error Al Registrar Usuario, intente con otro Email", error);
    return null;
  }
}

export async function failedMail(email: string, userId: string) {
  try {
    const response = await prisma.fail_mail.create({
      data: { email: email, user_id: userId }
    })
  } catch (error) {
    console.error("Error Al Registrar Usuario", error);
    return null;
  }
}

export async function registerLeads(user_id: string, email: string, status: string = 'sent') {
  try {
    const lead = await prisma.leads_send.create({
      data: {
        email: email as string,
        user_id: user_id as string,
        campaign_id: 'basic',
        status: status as string,
      },
    });

    if (!lead) {
      return null;
    }
    return lead;
  } catch (error) {
    console.error("Error Al Registrar Lead", error);
    return null;
  }
}

export async function registerDirectUser(
  email: string, 
  password: string, 
  nombre: string, 
  sub_area: string,
  accountType: string = 'profesional',
  institutionName?: string
) {
  try {
    // Verificar si el email ya existe
    const existingUser = await prisma.auth.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      throw new Error("El email ya está registrado");
    }

    // Encriptar contraseña
    const hashedPassword = await encrypt(password);

    // Determinar el área según el tipo de cuenta
    const userArea = accountType === 'institution' ? 'institution' : 'profesional';

    // Crear usuario con estado "active" (usuario registrado directamente)
    const user = await prisma.auth.create({
      data: {
        email: email,
        area: userArea as AreasAvailable,
        status: "active" as StatusAvailable,
        password: hashedPassword,
        invitation_sender: "external" as SenderNum,
        invitation_sender_id: "external",
      },
    });

    if (!user) {
      return null;
    }

    if (accountType === 'institution') {
      // Crear perfil de institución con fake_name generado
      const fakeInstitutionName = faker.company.name();
      await prisma.institution_Data.create({
        data: {
          user_id: user.referCode,
          fake_name: fakeInstitutionName,
          name: institutionName || nombre,
          country: "", // Vacío por ahora
        },
      });
    } else {
      // Crear perfil de profesional con fake_name generado
      const fakeProfessionalName = faker.person.firstName();
      await prisma.profesional_data.create({
        data: {
          user_id: user.referCode,
          fake_name: fakeProfessionalName,
          name: nombre,
          last_name: "", // Vacío por ahora
        },
      });

      // Crear main_study con sub_area solo para profesionales
      await prisma.main_study.create({
        data: {
          user_id: user.referCode,
          sub_area: sub_area as any, // El enum Sub_area
          title: "", // Vacío por ahora
          status: "", // Vacío por ahora
        },
      });
    }

    return user;
  } catch (error: any) {
    console.error("Error al registrar usuario directo:", error);
    throw error;
  }
}
