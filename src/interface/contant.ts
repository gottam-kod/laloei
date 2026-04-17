export interface Contant {
  id: string;
  org_id: string;
  type: 'ARTICLE' | 'PROMO';
  code: string;
  title: string;
  title_th: string;
  title_en: string;
  description: string;
  description_th: string;
  description_en: string;
  content: string;
  content_th: string;
  content_en: string;
  is_active: boolean;
  sort: number;
  slug?: string | null;
  summary?: string | null;
  view_count: number;
  published_at: string; // ISO date string
  expired_at?: string | null; // ISO date string
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  created_by: string; // user ID
  updated_by?: string | null; // user ID
}