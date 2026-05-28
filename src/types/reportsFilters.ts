import type { SearchFilters } from "@/types/bigbook";

// Zustand store shape for the Reports page filter/pagination UI state.
// Lives next to other domain types so the store file only contains behavior.
export interface ReportsFiltersState {
  filters: SearchFilters;
  offset: number;
  applyFilters: (filters: SearchFilters) => void;
  setOffset: (offset: number) => void;
  reset: () => void;
}
