import useSWR from "swr";
import { ZodError } from "zod";
import { buildSearchBooksKey } from "@/api/bigbook.api";
import { fetcher } from "@/api/axiosInstance";
import { MIN_QUERY_LENGTH } from "@/lib/constants";
import { useReportsFilters } from "@/store/reportsFilters.store";
import {
  bookSearchResponseSchema,
  type BookSearchResponse,
} from "@/types/bigbook";

export function useBookSearch() {
  const filters = useReportsFilters((s) => s.filters);
  const offset = useReportsFilters((s) => s.offset);

  // null key → SWR skips the request entirely (idiomatic conditional fetch).
  // Gate on MIN_QUERY_LENGTH because BigBook 500s on shorter queries.
  const key =
    filters.query.trim().length >= MIN_QUERY_LENGTH
      ? buildSearchBooksKey({ ...filters, offset })
      : null;

  const { data, error, isLoading, mutate } = useSWR<BookSearchResponse>(
    key,
    async (url: string) => {
      const raw = await fetcher<unknown>(url);
      try {
        return bookSearchResponseSchema.parse(raw);
      } catch (err) {
        if (err instanceof ZodError) {
          // Keep the detailed issues in the console for debugging; show
          // users a clean message instead of the raw issues array.
          console.error(
            "BigBook response failed schema validation",
            err.issues,
          );
          throw new Error("Server returned an unexpected response shape");
        }
        throw err;
      }
    },
  );

  return {
    books: data?.books ?? [],
    total: data?.available ?? 0,
    pageSize: filters.pageSize,
    offset,
    isLoading,
    error: error as Error | undefined,
    refresh: mutate,
  };
}
