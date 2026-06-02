"use client";

import Link from "next/link";
import useSWR from "swr";
import ArticleCard from "@/components/articles/ArticleCard";
import BrColors from "@/components/pieces/BrColors";
import { ArticlesListResponse } from "@/types/articles";

const fetcher = async (url: string): Promise<ArticlesListResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("No se pudo cargar articulos");
  }
  return response.json();
};

export default function HomeArticlesPreview() {
  const { data } = useSWR<ArticlesListResponse>("/api/public/articles", fetcher);

  const items = data?.success && Array.isArray(data.payload) ? data.payload.slice(0, 3) : [];
  const hasArticles = items.length > 0;

  if (!hasArticles) {
    return null;
  }

  return (
    <section className='w-full'>
      <BrColors title='Novedades' />
      <div className='mx-auto max-w-7xl p-4 md:p-6'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
          {items.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        <div className='mt-6 flex justify-center'>
          <Link href='/articles' className='btn btn-outline border-(--main-arci) text-(--main-arci) hover:bg-(--main-arci) hover:text-white'>
            Ver todas las novedades
          </Link>
        </div>
      </div>
    </section>
  );
}
