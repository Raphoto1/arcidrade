import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock, encryptMock, getProfesionalDataByRefferCodeDaoMock } = vi.hoisted(() => ({
  prismaMock: {
    auth: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    profesional_data: {
      create: vi.fn(),
    },
    main_study: {
      create: vi.fn(),
    },
  },
  encryptMock: vi.fn(),
  getProfesionalDataByRefferCodeDaoMock: vi.fn(),
}));

vi.mock("@/utils/db", () => ({
  default: prismaMock,
}));

vi.mock("@/utils/encrypter", () => ({
  encrypt: encryptMock,
}));

vi.mock("@faker-js/faker", () => ({
  fakerES: {
    person: {
      firstName: vi.fn(() => "Profesional Demo"),
    },
    company: {
      name: vi.fn(() => "Institucion Demo"),
    },
  },
}));

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/utils/authOptions", () => ({
  authOptions: {},
}));

vi.mock("@/controller/userData.controller", () => ({
  getCertificationById: vi.fn(),
}));

vi.mock("@/dao/dao", () => ({
  createProfesionalMainStudyDao: vi.fn(),
  createUserSpecializationDao: vi.fn(),
  getProfesionalDataByRefferCodeDao: getProfesionalDataByRefferCodeDaoMock,
  getUserEmailByRefferCodeDao: vi.fn(),
  getProfesionalMainStudyDao: vi.fn(),
  getUserSpecializationByTitle: vi.fn(),
  updateProfesionalDataDao: vi.fn(),
  updateProfesionalMainStudyDao: vi.fn(),
  getUserSpecializationsDao: vi.fn(),
  getUserSpecializationByIdDao: vi.fn(),
  deleteSpecializationByIdDao: vi.fn(),
  updateSpecializationByIdDao: vi.fn(),
  getFavoriteSpecializationBySpecializationIdDao: vi.fn(),
  getCertificationsByUserIdDao: vi.fn(),
  getCertificationByTitleDao: vi.fn(),
  createUserCertificationDao: vi.fn(),
  getCertificationByIdDao: vi.fn(),
  updateCertificationByIdDao: vi.fn(),
  deleteUserCertificationByIdDao: vi.fn(),
  getUserExperiencesByUserIdDao: vi.fn(),
  createUserExperienceDao: vi.fn(),
  deleteUserExperienceByIdDao: vi.fn(),
  getUserExperienceByIdDao: vi.fn(),
  updateUserExperienceByIdDao: vi.fn(),
  getProfesionalFullByIdDao: vi.fn(),
  getAllProfesionalsDao: vi.fn(),
  getAllProfesionalsPaginatedDao: vi.fn(),
  updateProfesionalAuthStatusDao: vi.fn(),
  createProfesionalDataDao: vi.fn(),
}));

import { registerDirectUser } from "@/service/register.service";
import { getUserDataService } from "@/service/userData.service";

describe("direct professional CRUD - create/read", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    encryptMock.mockResolvedValue("hashed-secret");
    prismaMock.auth.findUnique.mockResolvedValue(null);
    prismaMock.auth.create.mockResolvedValue({
      referCode: "prof-123",
      email: "pro@example.com",
      area: "profesional",
      status: "active",
    });
    prismaMock.profesional_data.create.mockResolvedValue({
      user_id: "prof-123",
      fake_name: "Profesional Demo",
      name: "Profesional Uno",
      last_name: "",
    });
    prismaMock.main_study.create.mockResolvedValue({
      user_id: "prof-123",
      sub_area: "doctor",
      title: "",
      status: "",
    });
  });

  it("crea un profesional por registro directo con auth, perfil y main_study", async () => {
    const result = await registerDirectUser(
      "pro@example.com",
      "super-secret",
      "Profesional Uno",
      "doctor",
      "profesional"
    );

    expect(encryptMock).toHaveBeenCalledWith("super-secret");
    expect(prismaMock.auth.create).toHaveBeenCalledWith({
      data: {
        email: "pro@example.com",
        area: "profesional",
        status: "active",
        password: "hashed-secret",
        invitation_sender: "external",
        invitation_sender_id: "external",
      },
    });
    expect(prismaMock.profesional_data.create).toHaveBeenCalledWith({
      data: {
        user_id: "prof-123",
        fake_name: "Profesional Demo",
        name: "Profesional Uno",
        last_name: "",
      },
    });
    expect(prismaMock.main_study.create).toHaveBeenCalledWith({
      data: {
        user_id: "prof-123",
        sub_area: "doctor",
        title: "",
        status: "",
      },
    });
    expect(result).toEqual({
      referCode: "prof-123",
      email: "pro@example.com",
      area: "profesional",
      status: "active",
    });
  });

  it("lee el perfil profesional creado por referCode", async () => {
    const professionalProfile = {
      user_id: "prof-123",
      name: "Profesional Uno",
      description: "Perfil directo",
      auth: {
        referCode: "prof-123",
        email: "pro@example.com",
      },
    };

    getProfesionalDataByRefferCodeDaoMock.mockResolvedValue(professionalProfile);

    const result = await getUserDataService("prof-123");

    expect(getProfesionalDataByRefferCodeDaoMock).toHaveBeenCalledWith("prof-123");
    expect(result).toEqual(professionalProfile);
  });
});