import axios, { AxiosError } from "axios";
import { BIGBOOK_BASE_URL, HTTP_TIMEOUT_MS } from "@/lib/constants";
import type { ApiError } from "@/types/api";

const buildApiError = (message: string, status: number): ApiError => {
  const err = new Error(message) as ApiError;
  err.name = "ApiError";
  err.status = status;
  return err;
};

export const api = axios.create({
  baseURL: BIGBOOK_BASE_URL,
  timeout: HTTP_TIMEOUT_MS,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status ?? 0;
    const message =
      error.response?.data?.message ?? error.message ?? "Request failed";
    return Promise.reject(buildApiError(message, status));
  },
);

export const fetcher = <T>(url: string): Promise<T> =>
  api.get<T>(url).then((r) => r.data);
