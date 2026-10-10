import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export interface PaginatedResponse<T> {
  results: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface JWTPayload {
  id: number;
  email: string;
}

export interface ListQueryParams {
  page?: string;
  pageSize?: string;
  search?: string;
  seriesSlug?: string;
  status?: string;
  isFeatured?: string;
  type?: string;
}
