import { create } from "zustand";
import { INITIAL_FILTERS } from "@/types/bigbook";
import type { ReportsFiltersState } from "@/types/reportsFilters";

// Re-export so existing import paths keep working.
export { INITIAL_FILTERS };

export const useReportsFilters = create<ReportsFiltersState>((set) => ({
  filters: INITIAL_FILTERS,
  offset: 0,
  // Applying filters resets pagination so the user lands on page 1.
  applyFilters: (filters) => set({ filters, offset: 0 }),
  setOffset: (offset) => set({ offset }),
  reset: () => set({ filters: INITIAL_FILTERS, offset: 0 }),
}));
