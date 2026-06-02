export interface NewsArticle {
  id: number;
  slug: string;
  title: string;
  shortText: string;
  image: string;
  contentHtml: string;
  publishedAt: string;
}

export interface NewsListResponse {
  success: boolean;
  payload: NewsArticle[];
}

export interface NewsDetailResponse {
  success: boolean;
  payload: NewsArticle | null;
}
