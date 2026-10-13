import axios from "axios";
import type {
  Artwork,
  Exhibition,
  Post,
  BioSection,
  PaginatedResponse,
  ContactFormData,
} from "./types/index";

const api = axios.create({
  baseURL: "/api",
});

// Artworks

export interface ArtworkFilters {
  page?: number;
  pageSize?: number;
  seriesSlug?: string;
  status?: string;
  isFeatured?: boolean;
  search?: string;
}

export function fetchArtworks(
  filters?: ArtworkFilters,
): Promise<PaginatedResponse<Artwork>> {
  return api.get("/artworks", { params: filters }).then((res) => res.data);
}

export function fetchArtwork(slug: string): Promise<Artwork> {
  return api.get(`/artworks/${slug}`).then((res) => res.data);
}

export function fetchSeries(): Promise<Series[]> {
  return api.get("/artworks/series").then((res) => res.data);
}

// Exhibitions

export function fetchExhibitions(): Promise<Exhibition[]> {
  return api.get("/exhibitions").then((res) => res.data);
}

export function fetchCurrentExhibition(): Promise<Exhibition> {
  return api.get("/exhibitions/current").then((res) => res.data);
}

export function fetchExhibition(slug: string): Promise<Exhibition> {
  return api.get(`/exhibitions/${slug}`).then((res) => res.data);
}

// Posts

export function fetchPosts(): Promise<Post[]> {
  return api.get("/posts").then((res) => res.data);
}

export function fetchPost(slug: string): Promise<Post> {
  return api.get(`/posts/${slug}`).then((res) => res.data);
}

// Bio

export function fetchBio(): Promise<BioSection[]> {
  return api.get("/bio").then((res) => res.data);
}

// Contact

export function submitEnquiry(
  data: ContactFormData,
): Promise<{ message: string; id: number }> {
  return api.post("/contact", data).then((res) => res.data);
}
