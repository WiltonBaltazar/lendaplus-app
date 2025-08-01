export interface Episode {
  title: string;
  cover_image: string;
  description?: string;
  duration?: string;
  published_at?: string;
  slug: string;
  audio_file: string;
  guest?: string;
  release_date?: string;
  podcast?: string
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev?: string | null;
  next?: string | null;
}

export interface EpisodeResponse {
  data: Episode[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export interface Plan {
    id: number;
    name: string;
    slug: string;
    description: string;
    formatted_price?: string;
    price: number;
    duration_days: number;
    bg_color: string;
    text_color: string;
};

export interface PlanCardProps {
  plan: Plan;
  className?: string;
}