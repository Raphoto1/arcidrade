import Link from "next/link";
import RichTextPreview from "@/components/ui/RichTextPreview";
import ShareArticleButtons from "@/components/news/ShareArticleButtons";
import { ArticleItem } from "@/types/articles";

interface ArticleCardProps {
  article: ArticleItem;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className='card bg-base-100 shadow-md border border-base-200 overflow-hidden'>
      <figure className='h-56'>
        <img src={article.image} alt={article.title} className='h-full w-full object-cover' />
      </figure>

      <div className='card-body gap-4'>
        <div className='space-y-2'>
          <p className='text-xs uppercase tracking-wider text-gray-500'>
            {new Date(article.publishedAt).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          <h3 className='card-title text-2xl font-oswald text-[var(--main-arci)]'>{article.title}</h3>
          <p className='text-gray-700'>{article.shortText}</p>
          <RichTextPreview content={article.contentHtml} maxHeight='120px' className='text-sm text-gray-700' />
        </div>

        <div className='card-actions flex-col items-start gap-3'>
          <Link href={`/articles/${article.slug}`} className='btn btn-outline border-[var(--main-arci)] text-[var(--main-arci)] hover:bg-[var(--main-arci)] hover:text-white'>
            Ver articulo completo
          </Link>
          <ShareArticleButtons slug={`articles/${article.slug}`} title={article.title} />
        </div>
      </div>
    </article>
  );
}
