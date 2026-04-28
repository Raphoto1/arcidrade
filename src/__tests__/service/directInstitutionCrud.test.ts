import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock, encryptMock, getInstitutionDataByRefferCodeDaoMock } = vi.hoisted(() => ({
  prismaMock: {
    auth: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    institution_Data: {
      create: vi.fn(),
    },
    institution_extra_data: {
      create: vi.fn(),
    },
  },
  encryptMock: vi.fn(),
  getInstitutionDataByRefferCodeDaoMock: vi.fn(),
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

vi.mock("@/dao/institution.dao", () => ({
  createInstitutionCertificationDao: vi.fn(),
  createInstitutionDataDao: vi.fn(),
  createInstitutionSpecialityDao: vi.fn(),
  deleteInstitutionCertificationDao: vi.fn(),
  deleteInstitutionSpecialityDao: vi.fn(),
  getInstitutionCertificationByIdDao: vi.fn(),
  getInstitutionCertificationsDao: vi.fn(),
  getInstitutionDataByRefferCodeDao: getInstitutionDataByRefferCodeDaoMock,
  getInstitutionSpecialitiesDao: vi.fn(),
  getInstitutionSpecialityDao: vi.fn(),
  updateInstitutionCertificationDao: vi.fn(),
  updateInstitutionDataDao: vi.fn(),
  updateInstitutionSpecialityDao: vi.fn(),
  createInstitutionGoalDao: vi.fn(),
  getInstitutionGoalsDao: vi.fn(),
  getInstitutionGoalByIdDao: vi.fn(),
  updateInstitutionGoalDao: vi.fn(),
  deleteInstitutionGoalDao: vi.fn(),
  getInstitutionFullByUserIdDao: vi.fn(),
  getAllInstitutionsDao: vi.fn(),
  getAllInstitutionsPaginatedDao: vi.fn(),
  getAllActiveInstitutionsDao: vi.fn(),
  getAllPausedInstitutionsDao: vi.fn(),
}));

import { registerDirectUser } from "@/service/register.service";
import { getInstitutionDataByUserIdService } from "@/service/institutionData.service";

describe("direct institution CRUD - create/read", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    encryptMock.mockResolvedValue("hashed-secret");
    prismaMock.auth.findUnique.mockResolvedValue(null);
    prismaMock.auth.create.mockResolvedValue({
      referCode: "inst-123",
      email: "inst@example.com",
      area: "institution",
      status: "active",
    });
    prismaMock.institution_Data.create.mockResolvedValue({
      user_id: "inst-123",
      fake_name: "Institucion Demo",
      name: "Hospital Central",
      country: "",
    });
    prismaMock.institution_extra_data.create.mockResolvedValue({
      user_id: "inst-123",
      terms_accepted: false,
      terms_accepted_at: null,
    });
  });

  it("crea una institución por registro directo con auth y perfil institucional", async () => {
    const result = await registerDirectUser(
      "inst@example.com",
      "super-secret",
      "Contacto Base",
      "doctor",
      "institution",
      "Hospital Central"
    );

    expect(encryptMock).toHaveBeenCalledWith("super-secret");
    expect(prismaMock.auth.create).toHaveBeenCalledWith({
      data: {
        email: "inst@example.com",
        area: "institution",
        status: "active",
        password: "hashed-secret",
        invitation_sender: "external",
        invitation_sender_id: "external",
      },
    });
    expect(prismaMock.institution_Data.create).toHaveBeenCalledWith({
      data: {
        user_id: "inst-123",
        fake_name: "Institucion Demo",
        name: "Hospital Central",
        country: "",
      },
    });
    expect(prismaMock.institution_extra_data.create).toHaveBeenCalledWith({
      data: {
        user_id: "inst-123",
        terms_accepted: false,
        terms_accepted_at: null,
      },
    });
    expect(result).toEqual({
      referCode: "inst-123",
      email: "inst@example.com",
      area: "institution",
      status: "active",
    });
  });

  it("lee el perfil institucional creado por referCode", async () => {
    const institutionProfile = {
      user_id: "inst-123",
      name: "Hospital Central",
      description: "Institución registrada directo",
      auth: {
        referCode: "inst-123",
        email: "inst@example.com",
      },
    };

    getInstitutionDataByRefferCodeDaoMock.mockResolvedValue(institutionProfile);

    const result = await getInstitutionDataByUserIdService("inst-123");

    expect(getInstitutionDataByRefferCodeDaoMock).toHaveBeenCalledWith("inst-123");
    expect(result).toEqual(institutionProfile);
  });
});