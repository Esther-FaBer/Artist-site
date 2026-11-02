import axios from "axios";
import type {
  Artwork,
  Exhibition,
  Post,
  BioSection,
  Series,
  PaginatedResponse,
  ContactFormData,
} from "./types/index";

const api = axios.create({
  baseURL: "/api",
});

// Works (etchings + studies)

export interface workFilters {
  page?: number;
  limit?: number;
  seriesSlug?: string;
  search?: string;
}

export function fetchArtworks(
  filters?: workFilters,
): Promise<PaginatedResponse<Artwork>> {
  return api.get("/works", { params: filters }).then((res) => res.data);
}

export function fetchSeries(): Promise<Series[]> {
  return api.get("/works/series").then((res) => res.data);
}

// Exhibitions

export function fetchExhibitions(): Promise<Exhibition[]> {
  return api.get("/exhibitions").then((res) => res.data);
}

// Posts / News

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
