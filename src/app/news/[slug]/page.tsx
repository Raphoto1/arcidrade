import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BrColors from "@/components/pieces/BrColors";
import RichTextDisplay from "@/components/ui/RichTextDisplay";
import ShareArticleButtons from "@/components/news/ShareArticleButtons";
import BackToNewsButton from "@/components/news/BackToNewsButton";
import { getNewsArticleBySlug, staticNewsArticles } from "@/static/data/newsData";
import { generatePageMetadata, siteConfig } from "@/config/metadata";

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return staticNewsArticles.map((article) => ({ slug: article.slug }));
}

function resolveImageUrl(image: string): string {
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  return `${siteConfig.url}${image.startsWith("/") ? image : `/${image}`}`;
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsArticleBySlug(slug);

  if (!article) {
    return generatePageMetadata("Articulo no encontrado", "El articulo solicitado no existe.");
  }

  const articleUrl = `${siteConfig.url}/news/${article.slug}`;
  const imageUrl = resolveImageUrl(article.image);

  return {
    title: `${article.title} | ${siteConfig.name}`,
    description: article.shortText,
    keywords: [
      ...siteConfig.keywords,
      "novedades",
      "articulos",
      "salud",
      "arcidrade",
    ],
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      type: "article",
      locale: "es_ES",
      url: articleUrl,
      siteName: siteConfig.name,
      title: article.title,
      description: article.shortText,
      publishedTime: new Date(article.publishedAt).toISOString(),
      section: "Novedades",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.shortText,
      images: [imageUrl],
      creator: "@arcidrade",
      site: "@arcidrade",
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = getNewsArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articleUrl = `${siteConfig.url}/news/${article.slug}`;
  const imageUrl = resolveImageUrl(article.image);
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.shortText,
    image: [imageUrl],
    datePublished: new Date(article.publishedAt).toISOString(),
    dateModified: new Date(article.publishedAt).toISOString(),
    mainEntityOfPage: articleUrl,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logos/Logo Arcidrade Full.png`,
      },
    },
  };

  return (
    <div>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }} />
      <BrColors title='Detalle del articulo' />

      <section className='max-w-4xl mx-auto p-4 md:p-6 space-y-6'>
        <BackToNewsButton />

        <article className='bg-base-100 border border-base-200 rounded-2xl overflow-hidden shadow-sm'>
          <img src={article.image} alt={article.title} className='w-full h-72 object-cover' />

          <div className='p-5 md:p-8 space-y-5'>
            <div className='space-y-2'>
              <p className='text-sm text-gray-500'>
                {new Date(article.publishedAt).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <h1 className='font-oswald text-3xl md:text-4xl text-(--main-arci)'>{article.title}</h1>
              <p className='text-lg text-gray-700'>{article.shortText}</p>
            </div>

            <ShareArticleButtons slug={article.slug} title={article.title} />

            <RichTextDisplay content={article.contentHtml} className='text-gray-800 text-base leading-relaxed' />
          </div>
        </article>
      </section>
    </div>
  );
}
