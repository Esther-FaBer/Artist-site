export interface Medium {
  id: number;
  name: string;
}

export interface Series {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
}

export interface Artwork {
  id: number;
  title: string;
  slug: string;
  year: number | null;
  image_url: string | null;
  thumbnail_url: string | null;
  dimensions: string | null;
  description: string | null;
  medium: Medium | null;
  series: Series | null;
}

export interface Exhibition {
  id: number;
  title: string;
  slug: string;
  exhibition_type: "SOLO" | "GROUP" | "FAIR" | "RESIDENCY";
  venue: string | null;
  city: string | null;
  country: string | null;
  venue_website: string | null;
  description: string | null;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
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
  body?: string; // only returned on the detail route
  excerpt: string | null;
  cover_image: string | null;
  type: "NEWS" | "PRESS" | "TEXT";
  status: "DRAFT" | "PUBLISHED";
  published_at: string | null;
  author: string | null;
  source_url: string | null;
  tags: Tag[];
}

export interface BioSection {
  id: number;
  heading: string | null;
  body: string;
  section_type: "BIO" | "CV";
  display_order: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  enquiry_type: "GENERAL" | "PURCHASE" | "COMMISSION" | "PRESS";
  message: string;
}
