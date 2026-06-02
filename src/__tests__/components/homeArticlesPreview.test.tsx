import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const { useSWRMock } = vi.hoisted(() => ({
  useSWRMock: vi.fn(),
}));

vi.mock("swr", () => ({
  default: useSWRMock,
}));

vi.mock("@/components/pieces/BrColors", () => ({
  default: ({ title }: { title: string }) => <div data-testid='br-colors'>{title}</div>,
}));

vi.mock("@/components/articles/ArticleCard", () => ({
  default: ({ article }: { article: { title: string } }) => (
    <article data-testid='article-card'>{article.title}</article>
  ),
}));

import HomeArticlesPreview from "@/components/home/HomeArticlesPreview";

describe("HomeArticlesPreview", () => {
  it("renderiza solo los primeros 3 articulos cuando hay datos", () => {
    useSWRMock.mockReturnValue({
      data: {
        success: true,
        payload: [
          { id: 1, title: "A", slug: "a", shortText: "", image: "", contentHtml: "", publishedAt: "2026-01-01", isActive: true },
          { id: 2, title: "B", slug: "b", shortText: "", image: "", contentHtml: "", publishedAt: "2026-01-02", isActive: true },
          { id: 3, title: "C", slug: "c", shortText: "", image: "", contentHtml: "", publishedAt: "2026-01-03", isActive: true },
          { id: 4, title: "D", slug: "d", shortText: "", image: "", contentHtml: "", publishedAt: "2026-01-04", isActive: true },
        ],
      },
    });

    render(<HomeArticlesPreview />);

    const cards = screen.getAllByTestId("article-card");
    expect(cards).toHaveLength(3);
    expect(screen.getByText("Novedades")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver todas las novedades" })).toHaveAttribute("href", "/articles");
  });

  it("no renderiza bloque si no hay articulos", () => {
    useSWRMock.mockReturnValue({
      data: {
        success: true,
        payload: [],
      },
    });

    const { container } = render(<HomeArticlesPreview />);
    expect(container.firstChild).toBeNull();
  });
});
