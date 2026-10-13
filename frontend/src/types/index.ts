export interface Medium {
  id: number;
  name: string;
}

export interface Series {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
}

export type ArtworkStatus = "AVAILABLE" | "SOLD" | "NOT_FOR_SALE" | "RESERVED";

export interface Artwork {
  id: number;
  title: string;
  slug: string;
  year: number;
  image_url: string;
  thumbnail_url: string | null;
  width_cm: string | null; // PostgreSQL DECIMAL comes back as string
  height_cm: string | null;
  description: string | null;
  status: ArtworkStatus;
  price: string | null; // PostgreSQL DECIMAL comes back as string
  is_featured: boolean;
  medium: Medium | null;
  series: Series | null;
  created_at: string;
  updated_at: string;
}

export interface Exhibition {
  id: number;
  title: string;
  slug: string;
  type: "SOLO" | "GROUP" | "FAIR" | "RESIDENCY";
  venue_name: string;
  venue_city: string;
  venue_country: string;
  venue_website: string | null;
  description: string | null;
  image_url: string | null;
  start_date: string;
  end_date: string;
  is_featured: boolean;
  is_upcoming: boolean; // Computed by the backend
  is_currently_on: boolean; // Computed by the backend
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  body?: string; // Only returned on the detail route
  excerpt: string | null;
  cover_image: string | null;
  type: "NEWS" | "PRESS" | "TEXT";
  status: "DRAFT" | "PUBLISHED";
  published_at: string | null;
  tags: Tag[];
  created_at: string;
}

export interface BioSection {
  id: number;
  category:
    | "EDUCATION"
    | "SOLO_EXHIBITION"
    | "GROUP_EXHIBITION"
    | "AWARD"
    | "RESIDENCY"
    | "COLLECTION"
    | "PRESS";
  year: string | null;
  description: string;
  display_order: number;
}

// Paginated response — matches what /api/artworks returns
export interface PaginatedResponse<T> {
  results: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Contact form data — matches the backend's expected request body
export interface ContactFormData {
  name: string;
  email: string;
  type: "GENERAL" | "PURCHASE" | "COMMISSION" | "PRESS" | "COLLABORATION";
  subject: string;
  message: string;
  artworkId?: number;
}
