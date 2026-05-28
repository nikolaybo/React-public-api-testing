import { INITIAL_FILTERS, type SearchParams } from "@/types/bigbook";
import { buildQuery } from "./queryBuilder";

// Endpoint config — only what's specific to BigBook lives here:
//   - the path,
//   - keys that always go on the wire (even at default values),
//   - the camelCase → wire-key renames the generic kebab-case rule can't infer.
// The list of filterable params is NOT enumerated here — the builder derives
// it by diffing the input against `defaults`.
const BIGBOOK_DEFAULTS: SearchParams = { ...INITIAL_FILTERS, offset: 0 };

export const buildSearchBooksKey = (params: SearchParams): string =>
  `/search-books?${buildQuery(params, BIGBOOK_DEFAULTS, {
    keyMap: { pageSize: "number" },
    alwaysSend: {
      query: true,
      pageSize: true,
      offset: true,
      // BigBook needs the direction whenever sort is set, even if it's the
      // default "DESC".
      sortDirection: (p) => p.sort !== null,
    },
    transforms: {
      // Drop pure-whitespace authors so they don't masquerade as "non-default".
      authors: (v: string) => v.trim(),
    },
  })}`;

export const buildBookKey = (id: number): string => `/${id}`;
