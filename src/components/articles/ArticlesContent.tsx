"use client";

import useSWR from "swr";
import BrColors from "@/components/pieces/BrColors";
import ArticleCard from "@/components/articles/ArticleCard";
import { ArticlesListResponse } from "@/types/articles";

const fetcher = async (url: string): Promise<ArticlesListResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("No se pudo cargar la API de articulos");
  }
  return response.json();
};

export default function ArticlesContent() {
  const { data, error, isLoading } = useSWR<ArticlesListResponse>("/api/public/articles", fetcher);

  const articles = data?.success && Array.isArray(data.payload) ? data.payload : [];

  return (
    <div>
      <BrColors title='Articulos' />
      <section className='max-w-7xl mx-auto p-4 md:p-6'>
        {isLoading && <p className='text-sm text-gray-500 mb-4'>Cargando articulos...</p>}
        {error && <p className='text-sm text-orange-700 mb-4'>No se pudieron cargar los articulos en este momento.</p>}

        {!isLoading && !articles.length && (
          <div className='mb-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600'>
            No hay articulos activos disponibles por ahora.
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
