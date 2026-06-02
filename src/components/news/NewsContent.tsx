"use client";

import useSWR from "swr";
import BrColors from "@/components/pieces/BrColors";
import NewsCard from "@/components/news/NewsCard";
import { staticNewsArticles } from "@/static/data/newsData";
import { NewsListResponse } from "@/types/news";

const fetcher = async (url: string): Promise<NewsListResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("No se pudo cargar la API de novedades");
  }
  return response.json();
};

export default function NewsContent() {
  const { data, error, isLoading } = useSWR<NewsListResponse>("/api/public/news", fetcher);

  const hasApiData = Boolean(data?.success && Array.isArray(data.payload) && data.payload.length > 0);
  const articles = hasApiData ? data!.payload : staticNewsArticles;

  return (
    <div>
      <BrColors title='Novedades y articulos' />
      <section className='max-w-7xl mx-auto p-4 md:p-6'>
        {isLoading && <p className='text-sm text-gray-500 mb-4'>Cargando novedades...</p>}
        {error && <p className='text-sm text-orange-700 mb-4'>No se pudo cargar la API en este momento. Mostrando contenido local.</p>}

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
