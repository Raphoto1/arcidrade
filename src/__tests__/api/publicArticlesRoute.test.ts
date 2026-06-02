import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  getArticlesSectionVisibilityServiceMock,
  getPublicArticlesServiceMock,
} = vi.hoisted(() => ({
  getArticlesSectionVisibilityServiceMock: vi.fn(),
  getPublicArticlesServiceMock: vi.fn(),
}));

vi.mock("@/service/Articles.service", () => ({
  getArticlesSectionVisibilityService: getArticlesSectionVisibilityServiceMock,
  getPublicArticlesService: getPublicArticlesServiceMock,
}));

import { GET } from "@/app/api/public/articles/route";

describe("/api/public/articles route", () => {
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("devuelve payload vacio cuando la seccion esta inactiva", async () => {
    getArticlesSectionVisibilityServiceMock.mockResolvedValue(false);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true, payload: [] });
    expect(getPublicArticlesServiceMock).not.toHaveBeenCalled();
  });

  it("devuelve articulos activos cuando la seccion esta activa", async () => {
    const articles = [
      {
        id: 1,
        slug: "test-1",
        title: "Test 1",
        shortText: "Resumen",
        image: "https://images.pexels.com/photos/3183198/pexels-photo-3183198.jpeg",
        contentHtml: "<p>Contenido</p>",
        publishedAt: "2026-06-02",
        isActive: true,
      },
    ];

    getArticlesSectionVisibilityServiceMock.mockResolvedValue(true);
    getPublicArticlesServiceMock.mockResolvedValue(articles);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(getPublicArticlesServiceMock).toHaveBeenCalledTimes(1);
    expect(body).toEqual({ success: true, payload: articles });
  });

  it("devuelve 500 si hay error interno", async () => {
    getArticlesSectionVisibilityServiceMock.mockRejectedValue(new Error("DB down"));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "Error interno del servidor" });
  });
});
