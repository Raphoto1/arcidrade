import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  getServerSessionMock,
  createUserSpecialityServiceMock,
  createUserCertificationServiceMock,
  updateUserCertificationServiceMock,
  getMainStudyServiceMock,
  updateUserSpecializationServiceMock,
  updateProfesionalMainStudyDaoMock,
  deleteFileServiceMock,
  uploadFileServiceMock,
} = vi.hoisted(() => ({
  getServerSessionMock: vi.fn(),
  createUserSpecialityServiceMock: vi.fn(),
  createUserCertificationServiceMock: vi.fn(),
  updateUserCertificationServiceMock: vi.fn(),
  getMainStudyServiceMock: vi.fn(),
  updateUserSpecializationServiceMock: vi.fn(),
  updateProfesionalMainStudyDaoMock: vi.fn(),
  deleteFileServiceMock: vi.fn(),
  uploadFileServiceMock: vi.fn(),
}));

vi.mock("next-auth", () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock("@/utils/authOptions", () => ({
  authOptions: {},
}));

vi.mock("@/service/userData.service", () => ({
  createUserDataService: vi.fn(),
  createUserDataMainStudy: vi.fn(),
  getUserDataService: vi.fn(),
  getMainStudyService: getMainStudyServiceMock,
  updateUserDataService: vi.fn(),
  updateUserMainStudyService: vi.fn(),
  createUserSpecialityService: createUserSpecialityServiceMock,
  getUserSpecialitiesService: vi.fn(),
  deleteUserSpecialityService: vi.fn(),
  getSpecialityService: vi.fn(),
  updateUserSpecializationService: updateUserSpecializationServiceMock,
  makeFavoriteSpecialityService: vi.fn(),
  getUserCertificationsService: vi.fn(),
  createUserCertificationService: createUserCertificationServiceMock,
  getCertificationByIdService: vi.fn(),
  updateUserCertificationService: updateUserCertificationServiceMock,
  deleteUserCertificationService: vi.fn(),
  getUserExperiencesService: vi.fn(),
  createUserExperienceService: vi.fn(),
  getUserExperienceByIdService: vi.fn(),
  deleteUserExperienceService: vi.fn(),
  updateUserExperienceService: vi.fn(),
  getUserFullByIdService: vi.fn(),
  getAllProfesionalsService: vi.fn(),
  getAllProfesionalsPaginatedService: vi.fn(),
}));

vi.mock("@/service/File.service", () => ({
  deleteFileService: deleteFileServiceMock,
  uploadFileService: uploadFileServiceMock,
}));

vi.mock("@/dao/dao", () => ({
  updateProfesionalAuthStatusDao: vi.fn(),
  updateProfesionalMainStudyDao: updateProfesionalMainStudyDaoMock,
}));

vi.mock("@/service/institutionData.service", () => ({
  getInstitutionDataByUserIdService: vi.fn(),
  updateInstitutionCertificationService: vi.fn(),
  updateInstitutionDataService: vi.fn(),
}));

vi.mock("@/controller/institutionData.controller", () => ({
  getInstitutionCertification: vi.fn(),
  updateInstitutionCertification: vi.fn(),
}));

vi.mock("@/service/colab.service", () => ({
  getColabDataService: vi.fn(),
  updateColabDataService: vi.fn(),
}));

import {
  createSpeciality,
  createUserCertification,
  updateCertification,
  uploadUserMainStudyFile,
  uploadUserMainStudyLink,
  updateSpecialization,
} from "@/controller/userData.controller";

describe("userData controller - homologation create/update flows", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getServerSessionMock.mockResolvedValue({
      user: {
        id: "user-123",
        area: "profesional",
      },
    });

    createUserSpecialityServiceMock.mockResolvedValue({ id: 1 });
    createUserCertificationServiceMock.mockResolvedValue({ id: 2 });
    updateUserCertificationServiceMock.mockResolvedValue({ id: 2, updated: true });
    updateUserSpecializationServiceMock.mockResolvedValue({ id: 5, updated: true });
    getMainStudyServiceMock.mockResolvedValue({ id: 99, link: null, file: null });
    updateProfesionalMainStudyDaoMock.mockResolvedValue({ id: 99, updated: true });
    deleteFileServiceMock.mockResolvedValue(undefined);
    uploadFileServiceMock.mockResolvedValue({ url: "https://blob/new-main-study.pdf" });
  });

  it("crea especialidad incluyendo isHomologated y normaliza endDate vacia", async () => {
    await createSpeciality({
      titleInstitution: "Hospital Demo",
      title: "Cardiologia",
      title_category: "Master",
      titleStatus: "finalizado",
      country: "ES",
      subArea: "doctor",
      startDate: "2024-01-10",
      endDate: "",
      isHomologated: true,
    });

    expect(createUserSpecialityServiceMock).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "user-123",
        institution: "Hospital Demo",
        isHomologated: true,
        end_date: null,
        sub_area: "doctor",
      })
    );

    const callArg = createUserSpecialityServiceMock.mock.calls[0][0];
    expect(callArg.start_date).toBeInstanceOf(Date);
  });

  it("crea certificacion incluyendo isHomologated y endDate nula", async () => {
    await createUserCertification({
      title: "ACLS",
      titleStatus: "finalizado",
      startDate: "2023-02-01",
      endDate: "",
      country: "CL",
      titleInstitution: "AHA",
      description: "Curso avanzado",
      isHomologated: true,
    });

    expect(createUserCertificationServiceMock).toHaveBeenCalledWith(
      "user-123",
      expect.objectContaining({
        title: "ACLS",
        isHomologated: true,
        end_date: null,
      })
    );

    const certPack = createUserCertificationServiceMock.mock.calls[0][1];
    expect(certPack.start_date).toBeInstanceOf(Date);
  });

  it("actualiza certificacion normalizando fechas vacias e isHomologated false", async () => {
    await updateCertification(77, {
      titleInstitution: "Uni Demo",
      title: "Soporte Vital",
      titleStatus: "en curso",
      country: "AR",
      startDate: "",
      endDate: "",
      description: "Actualizado",
      isHomologated: "",
    });

    expect(updateUserCertificationServiceMock).toHaveBeenCalledWith(
      77,
      expect.objectContaining({
        institution: "Uni Demo",
        title: "Soporte Vital",
        start_date: null,
        end_date: null,
        isHomologated: false,
      })
    );
  });

  it("actualiza especialidad via updateSpecialization sin perder payload", async () => {
    const payload = {
      title: "Neonatologia",
      isHomologated: true,
      sub_area: "nurse",
    };

    await updateSpecialization(5, payload);

    expect(updateUserSpecializationServiceMock).toHaveBeenCalledWith(5, payload);
  });

  it("permite actualizar solo isHomologated en main study sin link ni file", async () => {
    getMainStudyServiceMock.mockResolvedValue({ id: 99, link: "https://old-link.com", file: null });

    await uploadUserMainStudyLink(null, true);

    expect(updateProfesionalMainStudyDaoMock).toHaveBeenCalledWith(
      { isHomologated: true },
      "user-123"
    );
    expect(deleteFileServiceMock).not.toHaveBeenCalled();
  });

  it("sube archivo de main study y conserva isHomologated al reemplazar link", async () => {
    getMainStudyServiceMock.mockResolvedValue({ id: 99, link: "https://old-link.com", file: null });
    const file = new File(["pdf-content"], "main-study.pdf", { type: "application/pdf" });

    await uploadUserMainStudyFile(file, true);

    expect(uploadFileServiceMock).toHaveBeenCalledWith(file, "mainStudy", "user-123");
    expect(updateProfesionalMainStudyDaoMock).toHaveBeenCalledWith(
      {
        link: null,
        file: "https://blob/new-main-study.pdf",
        isHomologated: true,
      },
      "user-123"
    );
  });
});
