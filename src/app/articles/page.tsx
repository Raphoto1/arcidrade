import { notFound } from "next/navigation";
import ArticlesContent from "@/components/articles/ArticlesContent";
import { generatePageMetadata } from "@/config/metadata";
import { getArticlesSectionVisibilityService } from "@/service/Articles.service";

export const metadata = generatePageMetadata(
  "Articulos",
  "Descubre articulos de Arcidrade sobre mercado sanitario, talento medico y estrategias de crecimiento.",
  [
    "articulos salud",
    "mercado hospitalario",
    "talento medico",
    "consultoria sanitaria",
  ],
  undefined,
  "/articles"
);

export default async function Page() {
  const sectionActive = await getArticlesSectionVisibilityService();

  if (!sectionActive) {
    notFound();
  }

  return <ArticlesContent />;
}
