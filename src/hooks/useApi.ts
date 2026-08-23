"use client";

import { useState, useCallback, useEffect } from "react";
import axios, { AxiosError } from "axios";

function toError(err: unknown): Error {
  return new Error((err as AxiosError).message);
}

interface AsyncAction<A extends unknown[], R> {
  run: (...args: A) => Promise<R>;
  loading: boolean;
  error: Error | null;
}

/** Wraps an async request with the shared loading/error state handling. */
function useAsyncAction<A extends unknown[], R>(
  action: (...args: A) => Promise<R>
): AsyncAction<A, R> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = useCallback(
    async (...args: A) => {
      setLoading(true);
      try {
        const result = await action(...args);
        setError(null);
        return result;
      } catch (err) {
        const requestError = toError(err);
        setError(requestError);
        throw requestError;
      } finally {
        setLoading(false);
      }
    },
    [action]
  );

  return { run, loading, error };
}

interface UseQueryOptions {
  skip?: boolean;
  refetchInterval?: number;
}

interface UseQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Generic hook for fetching data
export function useQuery<T>(
  url: string,
  options?: UseQueryOptions
): UseQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (options?.skip) return;

    setLoading(true);
    try {
      const response = await axios.get<T>(url);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(toError(err));
    } finally {
      setLoading(false);
    }
  }, [url, options?.skip]);

  useEffect(() => {
    fetchData();

    if (options?.refetchInterval) {
      const interval = setInterval(fetchData, options.refetchInterval);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [fetchData, options?.refetchInterval]);

  return { data, loading, error, refetch: fetchData };
}

interface UseMutationResult<T, D = unknown> {
  mutate: (data: D) => Promise<T>;
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Generic hook for mutations
export function useMutation<T, D = unknown>(
  url: string,
  method: "POST" | "PUT" | "DELETE" = "POST"
): UseMutationResult<T, D> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (mutationData: D) => {
      setLoading(true);
      try {
        let response;
        if (method === "DELETE") {
          response = await axios.delete<T>(url);
        } else if (method === "PUT") {
          response = await axios.put<T>(url, mutationData);
        } else {
          response = await axios.post<T>(url, mutationData);
        }
        setData(response.data);
        setError(null);
        return response.data;
      } catch (err) {
        const requestError = toError(err);
        setError(requestError);
        throw requestError;
      } finally {
        setLoading(false);
      }
    },
    [url, method]
  );

  return { mutate, data, loading, error };
}

// Hook for fetching banners
export function useBanners() {
  return useQuery<any[]>("/api/banners");
}

// Hook for fetching tours
export function useTours(onlyActive = true) {
  return useQuery<any[]>(`/api/tours?active=${onlyActive}`);
}

// Hook for fetching transfers
export function useTransfers(onlyActive = true) {
  return useQuery<any[]>(`/api/transfers?active=${onlyActive}`);
}

// Hook for fetching blogs
export function useBlogs(onlyPublished = true) {
  return useQuery<any[]>(`/api/blog?published=${onlyPublished}`);
}

// Hook for fetching FAQs
export function useFAQs() {
  return useQuery<any[]>("/api/faq");
}

// Hook for fetching testimonials
export function useTestimonials() {
  return useQuery<any[]>("/api/testimonials");
}

// Hook for creating items
export function useCreateItem<T>(entityType: string) {
  const action = useCallback(
    async (data: Partial<T>) =>
      (await axios.post(`/api/${entityType}`, data)).data,
    [entityType]
  );
  const { run, loading, error } = useAsyncAction(action);

  return { create: run, loading, error };
}

// Hook for updating items
export function useUpdateItem<T>(entityType: string, id: string) {
  const action = useCallback(
    async (data: Partial<T>) =>
      (await axios.put(`/api/${entityType}/${id}`, data)).data,
    [entityType, id]
  );
  const { run, loading, error } = useAsyncAction(action);

  return { update: run, loading, error };
}

// Hook for deleting items
export function useDeleteItem(entityType: string, id: string) {
  const action = useCallback(
    async () => (await axios.delete(`/api/${entityType}/${id}`)).data,
    [entityType, id]
  );
  const { run, loading, error } = useAsyncAction(action);

  return { deleteItem: run, loading, error };
}
