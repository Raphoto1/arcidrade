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

describe("direct professional CRUD - update/delete", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getServerSessionMock.mockResolvedValue({
      user: {
        area: "victor",
      },
    });

    updateUserStatusByIdServiceMock.mockResolvedValue({ success: true });
    updateUserDataByIdServiceMock.mockResolvedValue([{ description: "Nueva descripcion" }]);
    updateInstitutionDataServiceMock.mockResolvedValue({ success: true });
    deleteFileServiceMock.mockResolvedValue(undefined);

    prismaMock.profesional_data.findUnique.mockResolvedValue({
      avatar: "https://blob/avatar.png",
      cv_file: "https://blob/cv.pdf",
    });
    prismaMock.main_study.findUnique.mockResolvedValue({
      file: "https://blob/main-study.pdf",
    });
    prismaMock.study_specialization.findMany.mockResolvedValue([
      { file: "https://blob/spec-1.pdf" },
      { file: null },
    ]);
    prismaMock.profesional_certifications.findMany.mockResolvedValue([
      { file: "https://blob/cert-1.pdf" },
    ]);
    prismaMock.experience.findMany.mockResolvedValue([
      { file: "https://blob/exp-1.pdf" },
    ]);
    prismaMock.institution_Data.findUnique.mockResolvedValue(null);
    prismaMock.institution_Certifications.findMany.mockResolvedValue([]);
    prismaMock.goals.findMany.mockResolvedValue([]);
    prismaMock.colaborator_data.findMany.mockResolvedValue([
      { avatar: "https://blob/colab-avatar.png", file: "https://blob/colab-file.pdf" },
    ]);
    prismaMock.profesionals_listed.deleteMany.mockResolvedValue({ count: 2 });
    prismaMock.auth.delete.mockResolvedValue({ referCode: "prof-123" });
  });

  it("actualiza la descripcion de un profesional registrado directo", async () => {
    const result = await updateUserDescription("prof-123", "profesional", "Nueva descripcion");

    expect(updateUserDataByIdServiceMock).toHaveBeenCalledWith(
      { description: "Nueva descripcion" },
      "prof-123"
    );
    expect(result).toEqual([{ description: "Nueva descripcion" }]);
  });

  it("permite desactivar y reactivar al profesional", async () => {
    await desactivateUser("prof-123");
    await activateUser("prof-123");

    expect(updateUserStatusByIdServiceMock).toHaveBeenNthCalledWith(1, "desactivated", "prof-123");
    expect(updateUserStatusByIdServiceMock).toHaveBeenNthCalledWith(2, "active", "prof-123");
  });

  it("elimina archivos, lo saca de procesos y borra el usuario", async () => {
    const result = await deleteUser("prof-123");

    expect(deleteFileServiceMock).toHaveBeenCalledTimes(8);
    expect(deleteFileServiceMock).toHaveBeenCalledWith("https://blob/avatar.png");
    expect(deleteFileServiceMock).toHaveBeenCalledWith("https://blob/cv.pdf");
    expect(deleteFileServiceMock).toHaveBeenCalledWith("https://blob/main-study.pdf");
    expect(deleteFileServiceMock).toHaveBeenCalledWith("https://blob/spec-1.pdf");
    expect(deleteFileServiceMock).toHaveBeenCalledWith("https://blob/cert-1.pdf");
    expect(deleteFileServiceMock).toHaveBeenCalledWith("https://blob/exp-1.pdf");
    expect(deleteFileServiceMock).toHaveBeenCalledWith("https://blob/colab-avatar.png");
    expect(deleteFileServiceMock).toHaveBeenCalledWith("https://blob/colab-file.pdf");
    expect(prismaMock.profesionals_listed.deleteMany).toHaveBeenCalledWith({
      where: {
        profesional_id: "prof-123",
      },
    });
    expect(prismaMock.auth.delete).toHaveBeenCalledWith({
      where: {
        referCode: "prof-123",
      },
    });
    expect(prismaMock.profesionals_listed.deleteMany.mock.invocationCallOrder[0]).toBeLessThan(
      prismaMock.auth.delete.mock.invocationCallOrder[0]
    );
    expect(result).toEqual({ success: true, message: "Usuario eliminado correctamente" });
  });
});