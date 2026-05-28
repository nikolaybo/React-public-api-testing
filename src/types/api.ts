// HTTP/transport-layer error shape produced by the axios response interceptor
// in `src/api/axiosInstance.ts`. Carries the upstream status code alongside
// the standard Error fields so UI/error-boundary code can branch on it.
export interface ApiError extends Error {
  status: number;
}
