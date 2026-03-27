import { beforeEach, describe, expect, it, vi } from "vitest";

const { getProfesionalByReferCodeMock, getServerSessionMock } = vi.hoisted(() => ({
  getProfesionalByReferCodeMock: vi.fn(),
  getServerSessionMock: vi.fn(),
}));

vi.mock("@/controller/userData.controller", () => ({
  getProfesionalByReferCode: getProfesionalByReferCodeMock,
}));

vi.mock("next-auth", () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock("@/utils/authOptions", () => ({
  authOptions: {},
}));

import { GET } from "@/app/api/platform/profesional/[id]/route";

describe("/api/platform/profesional/[id] route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getProfesionalByReferCodeMock.mockResolvedValue({ referCode: "prof-123", email: "prof@example.com" });
  });

  it("responde 401 cuando no hay sesion", async () => {
    getServerSessionMock.mockResolvedValue(null);

    const response = await GET(new Request("http://localhost/api/platform/profesional/prof-123"), {
      params: Promise.resolve({ id: "prof-123" }),
    });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "No autorizado" });
    expect(getProfesionalByReferCodeMock).not.toHaveBeenCalled();
  });

  it("responde 403 cuando un profesional intenta leer otro perfil", async () => {
    getServerSessionMock.mockResolvedValue({
      user: {
        referCode: "prof-own",
        area: "profesional",
      },
    });

    const response = await GET(new Request("http://localhost/api/platform/profesional/prof-123"), {
      params: Promise.resolve({ id: "prof-123" }),
    });

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "No autorizado" });
    expect(getProfesionalByReferCodeMock).not.toHaveBeenCalled();
  });

  it("permite a un profesional leer su propio perfil", async () => {
    getServerSessionMock.mockResolvedValue({
      user: {
        referCode: "prof-123",
        area: "profesional",
      },
    });

    const response = await GET(new Request("http://localhost/api/platform/profesional/prof-123"), {
      params: Promise.resolve({ id: "prof-123" }),
    });

    expect(response.status).toBe(200);
    expect(getProfesionalByReferCodeMock).toHaveBeenCalledWith("prof-123");
  });

  it("permite a usuarios staff autorizados leer perfiles ajenos", async () => {
    getServerSessionMock.mockResolvedValue({
      user: {
        referCode: "admin-1",
        area: "admin",
      },
    });

    const response = await GET(new Request("http://localhost/api/platform/profesional/prof-123"), {
      params: Promise.resolve({ id: "prof-123" }),
    });

    expect(response.status).toBe(200);
    expect(getProfesionalByReferCodeMock).toHaveBeenCalledWith("prof-123");
  });
});