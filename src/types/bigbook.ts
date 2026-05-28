import { z } from "zod";
import {
  DEFAULT_PAGE_SIZE,
  MAX_PUBLISH_YEAR,
  MIN_PUBLISH_YEAR,
} from "@/lib/constants";

// Subset of BigBook genres we surface in the UI.
export const GENRES = [
  "fantasy",
  "science_fiction",
  "mystery",
  "romance",
  "thriller",
  "historical",
  "biography",
  "young_adult",
] as const;

export type Genre = (typeof GENRES)[number];

export const authorSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const bookSchema = z.object({
  id: z.number(),
  title: z.string(),
  image: z.string().nullable().optional(),
  publish_year: z.number().nullable().optional(),
  genres: z.array(z.string()).optional(),
  authors: z.array(authorSchema).default([]),
  // BigBook returns rating as { average: number } | null; flatten to number | null
  // so downstream consumers (BookCard) keep working unchanged.
  rating: z
    .object({ average: z.number() })
    .nullable()
    .optional()
    .transform((r) => r?.average ?? null),
});

export const bookSearchResponseSchema = z.object({
  available: z.number(),
  number: z.number(),
  offset: z.number(),
  // BigBook wraps each book in a single-element array; flatten so downstream
  // sees a plain Book[].
  books: z.array(z.array(bookSchema)).transform((arr) => arr.flat()),
});

export type Author = z.infer<typeof authorSchema>;
export type Book = z.infer<typeof bookSchema>;
export type BookSearchResponse = z.infer<typeof bookSearchResponseSchema>;

export const SORT_KEYS = ["rating", "publish-date"] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export const SORT_DIRECTIONS = ["ASC", "DESC"] as const;
export type SortDirection = (typeof SORT_DIRECTIONS)[number];

// Form-driven filters the user can edit. Offset is excluded — pagination
// drives it separately.
export interface SearchFilters {
  query: string;
  earliestPublishYear: number; // bounded by MIN/MAX_PUBLISH_YEAR
  latestPublishYear: number;
  minRating: number; // 0..1
  maxRating: number; // 0..1
  genres: Genre[];
  authors: string; // comma-separated names or ids
  sort: SortKey | null;
  sortDirection: SortDirection;
  groupResults: boolean;
  pageSize: number; // mapped to BigBook's `number` param (1..100)
}

// What the URL builder receives — filters plus the pagination offset.
export interface SearchParams extends SearchFilters {
  offset: number;
}

// Single source of truth for "no filters applied" state. The store seeds its
// initial state from this, and the generic query builder uses it to decide
// which fields to send (skip = equal to default).
export const INITIAL_FILTERS: SearchFilters = {
  query: "",
  earliestPublishYear: MIN_PUBLISH_YEAR,
  latestPublishYear: MAX_PUBLISH_YEAR,
  minRating: 0,
  maxRating: 1,
  genres: [],
  authors: "",
  sort: null,
  sortDirection: "DESC",
  groupResults: false,
  pageSize: DEFAULT_PAGE_SIZE,
};

export interface BookCardProps {
  book: Book;
}

export interface BookSearchFormProps {
  initialValues: SearchFilters;
  onSubmit: (values: SearchFilters) => void;
  isSubmitting: boolean;
}
