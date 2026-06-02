export interface ArticleItem {
  id: number;
  slug: string;
  title: string;
  shortText: string;
  image: string;
  contentHtml: string;
  publishedAt: string;
  isActive: boolean;
}

export interface ArticlesListResponse {
  success: boolean;
  payload: ArticleItem[];
}

export interface ArticleDetailResponse {
  success: boolean;
  payload: ArticleItem | null;
}

export interface SectionVisibilityResponse {
  success: boolean;
  payload: {
    sectionKey: string;
    isActive: boolean;
  };
}
