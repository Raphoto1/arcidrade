import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  getServerSessionMock,
  getArticlesCountServiceMock,
  getArticlesSectionVisibilityServiceMock,
  upsertArticlesSectionVisibilityServiceMock,
} = vi.hoisted(() => ({
  getServerSessionMock: vi.fn(),
  getArticlesCountServiceMock: vi.fn(),
  getArticlesSectionVisibilityServiceMock: vi.fn(),
  upsertArticlesSectionVisibilityServiceMock: vi.fn(),
}));

vi.mock("next-auth", () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock("@/utils/authOptions", () => ({
  authOptions: {},
}));

vi.mock("@/service/Articles.service", () => ({
  getArticlesCountService: getArticlesCountServiceMock,
  getArticlesSectionVisibilityService: getArticlesSectionVisibilityServiceMock,
  upsertArticlesSectionVisibilityService: upsertArticlesSectionVisibilityServiceMock,
}));

import { GET, PATCH } from "@/app/api/platform/victor/articles/section/route";

describe("/api/platform/victor/articles/section route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getArticlesSectionVisibilityServiceMock.mockResolvedValue(false);
    getArticlesCountServiceMock.mockResolvedValue(0);
    upsertArticlesSectionVisibilityServiceMock.mockResolvedValue({
      sectionKey: "articles",
      isActive: true,
    });
  });

  it("PATCH responde 409 si intentan activar sin articulos", async () => {
    getServerSessionMock.mockResolvedValue({ user: { area: "victor" } });

    const request = new Request("http://localhost/api/platform/victor/articles/section", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: true }),
    });

    const response = await PATCH(request as any);
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body).toEqual({ error: "No puedes activar la seccion sin articulos cargados" });
    expect(upsertArticlesSectionVisibilityServiceMock).not.toHaveBeenCalled();
  });

  it("PATCH permite activar si hay articulos", async () => {
    getServerSessionMock.mockResolvedValue({ user: { area: "victor" } });
    getArticlesCountServiceMock.mockResolvedValue(3);

    const request = new Request("http://localhost/api/platform/victor/articles/section", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: true }),
    });

    const response = await PATCH(request as any);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(upsertArticlesSectionVisibilityServiceMock).toHaveBeenCalledWith(true);
    expect(body).toEqual({
      success: true,
      payload: {
        sectionKey: "articles",
        isActive: true,
      },
    });
  });

  it("GET responde 200 con estado de seccion para Victor", async () => {
    getServerSessionMock.mockResolvedValue({ user: { area: "victor" } });
    getArticlesSectionVisibilityServiceMock.mockResolvedValue(true);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      success: true,
      payload: {
        sectionKey: "articles",
        isActive: true,
      },
    });
  });

  it("GET responde 200 con estado de seccion para Colab", async () => {
    getServerSessionMock.mockResolvedValue({ user: { area: "colab" } });
    getArticlesSectionVisibilityServiceMock.mockResolvedValue(false);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      success: true,
      payload: {
        sectionKey: "articles",
        isActive: false,
      },
    });
  });
});
