import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  deleteFileServiceMock,
  getServerSessionMock,
  prismaMock,
  updateInstitutionDataServiceMock,
  updateUserDataByIdServiceMock,
  updateUserStatusByIdServiceMock,
} = vi.hoisted(() => ({
  getServerSessionMock: vi.fn(),
  updateUserStatusByIdServiceMock: vi.fn(),
  updateUserDataByIdServiceMock: vi.fn(),
  updateInstitutionDataServiceMock: vi.fn(),
  deleteFileServiceMock: vi.fn(),
  prismaMock: {
    profesional_data: {
      findUnique: vi.fn(),
    },
    main_study: {
      findUnique: vi.fn(),
    },
    study_specialization: {
      findMany: vi.fn(),
    },
    profesional_certifications: {
      findMany: vi.fn(),
    },
    experience: {
      findMany: vi.fn(),
    },
    institution_Data: {
      findUnique: vi.fn(),
    },
    institution_Certifications: {
      findMany: vi.fn(),
    },
    goals: {
      findMany: vi.fn(),
    },
    colaborator_data: {
      findMany: vi.fn(),
    },
    profesionals_listed: {
      deleteMany: vi.fn(),
    },
    auth: {
      delete: vi.fn(),
    },
  },
}));

vi.mock("next-auth", () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock("@/utils/authOptions", () => ({
  authOptions: {},
}));

vi.mock("@/utils/db", () => ({
  default: prismaMock,
}));

vi.mock("@/service/invitations.service", () => ({
  listInvitedInvitationsService: vi.fn(),
  listRegisteredInvitationsService: vi.fn(),
}));

vi.mock("@/service/userData.service", () => ({
  updateUserStatusByIdService: updateUserStatusByIdServiceMock,
  updateUserDataByIdService: updateUserDataByIdServiceMock,
}));

vi.mock("@/service/institutionData.service", () => ({
  updateInstitutionDataService: updateInstitutionDataServiceMock,
}));

vi.mock("@/service/File.service", () => ({
  deleteFileService: deleteFileServiceMock,
}));

import { activateUser, deleteUser, desactivateUser, updateUserDescription } from "@/controller/victor.controller";

describe("direct institution CRUD - update/delete", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getServerSessionMock.mockResolvedValue({
      user: {
        area: "victor",
      },
    });

    updateUserStatusByIdServiceMock.mockResolvedValue({ success: true });
    updateUserDataByIdServiceMock.mockResolvedValue([{ description: "No debería usarse" }]);
    updateInstitutionDataServiceMock.mockResolvedValue({ description: "Descripcion institucional" });
    deleteFileServiceMock.mockResolvedValue(undefined);

    prismaMock.profesional_data.findUnique.mockResolvedValue(null);
    prismaMock.main_study.findUnique.mockResolvedValue(null);
    prismaMock.study_specialization.findMany.mockResolvedValue([]);
    prismaMock.profesional_certifications.findMany.mockResolvedValue([]);
    prismaMock.experience.findMany.mockResolvedValue([]);
    prismaMock.institution_Data.findUnique.mockResolvedValue({
      avatar: "https://blob/inst-avatar.png",
    });
    prismaMock.institution_Certifications.findMany.mockResolvedValue([
      { file: "https://blob/inst-cert-1.pdf" },
    ]);
    prismaMock.goals.findMany.mockResolvedValue([
      { file: "https://blob/goal-1.pdf" },
    ]);
    prismaMock.colaborator_data.findMany.mockResolvedValue([]);
    prismaMock.profesionals_listed.deleteMany.mockResolvedValue({ count: 0 });
    prismaMock.auth.delete.mockResolvedValue({ referCode: "inst-123" });
  });

  it("actualiza la descripcion de una institución registrada directo", async () => {
    const result = await updateUserDescription("inst-123", "institution", "Descripcion institucional");

    expect(updateInstitutionDataServiceMock).toHaveBeenCalledWith(
      { description: "Descripcion institucional" },
      "inst-123"
    );
    expect(updateUserDataByIdServiceMock).not.toHaveBeenCalled();
    expect(result).toEqual({ description: "Descripcion institucional" });
  });

  it("permite desactivar y reactivar a la institución", async () => {
    await desactivateUser("inst-123");
    await activateUser("inst-123");

    expect(updateUserStatusByIdServiceMock).toHaveBeenNthCalledWith(1, "desactivated", "inst-123");
    expect(updateUserStatusByIdServiceMock).toHaveBeenNthCalledWith(2, "active", "inst-123");
  });

  it("elimina archivos institucionales y borra la cuenta", async () => {
    const result = await deleteUser("inst-123");

    expect(deleteFileServiceMock).toHaveBeenCalledTimes(3);
    expect(deleteFileServiceMock).toHaveBeenCalledWith("https://blob/inst-avatar.png");
    expect(deleteFileServiceMock).toHaveBeenCalledWith("https://blob/inst-cert-1.pdf");
    expect(deleteFileServiceMock).toHaveBeenCalledWith("https://blob/goal-1.pdf");
    expect(prismaMock.profesionals_listed.deleteMany).toHaveBeenCalledWith({
      where: {
        profesional_id: "inst-123",
      },
    });
    expect(prismaMock.auth.delete).toHaveBeenCalledWith({
      where: {
        referCode: "inst-123",
      },
    });
    expect(result).toEqual({ success: true, message: "Usuario eliminado correctamente" });
  });
});