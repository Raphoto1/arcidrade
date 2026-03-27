import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  uploadUserMainStudyLinkMock,
  uploadUserMainStudyFileMock,
  deleteUserMainStudyMock,
} = vi.hoisted(() => ({
  uploadUserMainStudyLinkMock: vi.fn(),
  uploadUserMainStudyFileMock: vi.fn(),
  deleteUserMainStudyMock: vi.fn(),
}));

vi.mock("@/controller/userData.controller", () => ({
  deleteCv: vi.fn(),
  updateUserData: vi.fn(),
  uploadUserCv: vi.fn(),
  uploadUserCvLink: vi.fn(),
  uploadUserMainStudyFile: uploadUserMainStudyFileMock,
  uploadUserMainStudyLink: uploadUserMainStudyLinkMock,
  deleteUserMainStudy: deleteUserMainStudyMock,
}));

vi.mock("@vercel/blob", () => ({
  put: vi.fn(),
}));

import { DELETE, POST } from "@/app/api/platform/upload/mainstudy/route";

describe("/api/platform/upload/mainstudy route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    uploadUserMainStudyLinkMock.mockResolvedValue({ ok: true, mode: "link" });
    uploadUserMainStudyFileMock.mockResolvedValue({ ok: true, mode: "file" });
    deleteUserMainStudyMock.mockResolvedValue({ ok: true });
  });

  it("POST usa uploadUserMainStudyLink cuando llega link con isHomologated true", async () => {
    const form = new FormData();
    form.append("link", "https://example.com/title");
    form.append("isHomologated", "true");

    const request = new Request("http://localhost/api/platform/upload/mainstudy", {
      method: "POST",
      body: form,
    });

    const response = await POST(request);
    const body = await response.json();

    expect(uploadUserMainStudyLinkMock).toHaveBeenCalledWith("https://example.com/title", true);
    expect(uploadUserMainStudyFileMock).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true, mode: "link" });
  });

  it("POST usa uploadUserMainStudyFile cuando llega archivo con isHomologated false", async () => {
    const form = new FormData();
    const file = new File(["pdf-content"], "titulo.pdf", { type: "application/pdf" });
    form.append("file", file);
    form.append("isHomologated", "false");

    const request = new Request("http://localhost/api/platform/upload/mainstudy", {
      method: "POST",
      body: form,
    });

    // En entorno de test, el File de request.formData() puede tener constructor distinto
    // al File global. Alineamos temporalmente para validar la rama de archivo real.
    const originalFileCtor = globalThis.File;
    const requestFormData = await request.clone().formData();
    const runtimeFile = requestFormData.get("file");
    if (runtimeFile && typeof runtimeFile === "object" && "constructor" in runtimeFile) {
      globalThis.File = runtimeFile.constructor as typeof File;
    }

    const response = await POST(request);
    const body = await response.json();
    globalThis.File = originalFileCtor;

    expect(uploadUserMainStudyFileMock).toHaveBeenCalledTimes(1);
    const [uploadedFileArg, homologatedArg] = uploadUserMainStudyFileMock.mock.calls[0];
    expect(uploadedFileArg).toBeTruthy();
    expect(homologatedArg).toBe(false);
    expect(uploadUserMainStudyLinkMock).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true, mode: "file" });
  });

  it("POST permite actualizar solo homologacion sin link ni file", async () => {
    const form = new FormData();
    form.append("isHomologated", "true");

    const request = new Request("http://localhost/api/platform/upload/mainstudy", {
      method: "POST",
      body: form,
    });

    const response = await POST(request);
    const body = await response.json();

    expect(uploadUserMainStudyLinkMock).toHaveBeenCalledWith(null, true);
    expect(uploadUserMainStudyFileMock).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true, mode: "link" });
  });

  it("POST responde 400 cuando no llegan file/link/isHomologated", async () => {
    const form = new FormData();

    const request = new Request("http://localhost/api/platform/upload/mainstudy", {
      method: "POST",
      body: form,
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Error al agregar cv" });
  });

  it("POST responde 400 si file no es tipo File", async () => {
    const form = new FormData();
    form.append("file", "not-a-file");

    const request = new Request("http://localhost/api/platform/upload/mainstudy", {
      method: "POST",
      body: form,
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Archivo inválido" });
    expect(uploadUserMainStudyFileMock).not.toHaveBeenCalled();
  });

  it("DELETE invoca deleteUserMainStudy y confirma respuesta", async () => {
    const request = new Request("http://localhost/api/platform/upload/mainstudy", {
      method: "DELETE",
    });

    const response = await DELETE(request);
    const body = await response.json();

    expect(deleteUserMainStudyMock).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(body).toEqual({ message: "deletemainResponse confirm" });
  });
});
