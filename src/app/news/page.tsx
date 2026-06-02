import React from "react";
import NewsContent from "@/components/news/NewsContent";
import { generatePageMetadata, siteConfig } from "@/config/metadata";
import { getSortedNewsArticles } from "@/static/data/newsData";

export const metadata = generatePageMetadata(
	"Novedades y Articulos",
	"Descubre novedades, analisis y articulos de Arcidrade sobre mercado sanitario, talento medico y estrategias de crecimiento.",
	[
		"novedades salud",
		"articulos sanitarios",
		"mercado hospitalario",
		"talento medico",
		"consultoria sanitaria",
	],
	undefined,
	"/news"
);

export default function Page() {
	const articles = getSortedNewsArticles();
	const collectionStructuredData = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: "Novedades y articulos",
		description:
			"Listado de novedades y articulos de Arcidrade sobre mercado sanitario, talento medico y crecimiento corporativo.",
		url: `${siteConfig.url}/news`,
		mainEntity: {
			"@type": "ItemList",
			itemListElement: articles.map((article, index) => ({
				"@type": "ListItem",
				position: index + 1,
				url: `${siteConfig.url}/news/${article.slug}`,
				name: article.title,
			})),
		},
	};

	return (
		<>
			<script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionStructuredData) }} />
			<NewsContent />
		</>
	);
}
