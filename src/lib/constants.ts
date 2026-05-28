// API base URLs, timeouts, etc.

// Proxied path — Vite dev server (or production proxy) injects the BigBook
// API key as `x-api-key`. The browser never sees the real upstream URL or key.
export const BIGBOOK_BASE_URL = "/api/bigbook";

export const HTTP_TIMEOUT_MS = 10_000;

export const DEFAULT_PAGE_SIZE = 10;

// BigBook's free plan rejects very short queries with HTTP 500.
// Gate the fetch on this minimum length.
export const MIN_QUERY_LENGTH = 2;

// Publish-year range bounds for the year RangeSlider. Values at these
// extremes are treated as "unset" by the URL builder.
export const MIN_PUBLISH_YEAR = 1900;
export const MAX_PUBLISH_YEAR = new Date().getFullYear();
