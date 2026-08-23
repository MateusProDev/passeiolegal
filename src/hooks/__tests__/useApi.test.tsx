import { act, renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import {
  useBanners,
  useBlogs,
  useCreateItem,
  useDeleteItem,
  useFAQs,
  useMutation,
  useQuery,
  useTestimonials,
  useTours,
  useTransfers,
  useUpdateItem,
} from "@/hooks/useApi";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useQuery", () => {
  beforeEach(() => jest.clearAllMocks());

  it("loads data successfully and refetches", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: ["first"] } as never)
      .mockResolvedValueOnce({ data: ["second"] } as never);
    const { result } = renderHook(() => useQuery<string[]>("/api/items"));

    await waitFor(() => expect(result.current.data).toEqual(["first"]));
    await act(async () => {
      await result.current.refetch();
    });
    await waitFor(() => expect(result.current.data).toEqual(["second"]));
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });

  it("sets an Error containing the axios message on failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("request failed"));
    const { result } = renderHook(() => useQuery<string[]>("/api/items"));

    await waitFor(() => expect(result.current.error?.message).toBe("request failed"));
    expect(result.current.loading).toBe(false);
  });

  it("skips the initial request when requested", () => {
    const { result } = renderHook(() =>
      useQuery<string[]>("/api/items", { skip: true })
    );
    expect(result.current.data).toBeNull();
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });
});

describe("useMutation", () => {
  beforeEach(() => jest.clearAllMocks());

  it.each([
    ["POST", "post"],
    ["PUT", "put"],
  ] as const)("sends %s payloads", async (method, axiosMethod) => {
    mockedAxios[axiosMethod].mockResolvedValue({ data: { id: "1" } } as never);
    const { result } = renderHook(() =>
      useMutation<{ id: string }, { name: string }>("/api/items", method)
    );

    await act(async () => {
      await expect(result.current.mutate({ name: "item" })).resolves.toEqual({
        id: "1",
      });
    });
    expect(mockedAxios[axiosMethod]).toHaveBeenCalledWith("/api/items", {
      name: "item",
    });
    expect(result.current.data).toEqual({ id: "1" });
  });

  it("sends DELETE without the payload", async () => {
    mockedAxios.delete.mockResolvedValue({ data: { deleted: true } } as never);
    const { result } = renderHook(() =>
      useMutation<{ deleted: boolean }, { ignored: boolean }>(
        "/api/items/1",
        "DELETE"
      )
    );

    await act(async () => {
      await expect(result.current.mutate({ ignored: true })).resolves.toEqual({
        deleted: true,
      });
    });
    expect(mockedAxios.delete).toHaveBeenCalledWith("/api/items/1");
  });

  it("propagates mutation errors and stores an Error", async () => {
    mockedAxios.post.mockRejectedValue(new Error("cannot save"));
    const { result } = renderHook(() => useMutation("/api/items"));

    await act(async () => {
      await expect(result.current.mutate({})).rejects.toThrow("cannot save");
    });
    await waitFor(() => expect(result.current.error?.message).toBe("cannot save"));
  });
});

describe("API query wrappers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue({ data: [] } as never);
  });

  it.each([
    ["banners", useBanners, "/api/banners"],
    ["tours", useTours, "/api/tours?active=true"],
    ["transfers", useTransfers, "/api/transfers?active=true"],
    ["blogs", useBlogs, "/api/blog?published=true"],
    ["FAQs", useFAQs, "/api/faq"],
    ["testimonials", useTestimonials, "/api/testimonials"],
  ] as const)("requests the exact URL for %s", async (_name, hook, url) => {
    renderHook(() => hook());
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledWith(url));
  });

  it("supports false filters for tours, transfers, and blogs", async () => {
    renderHook(() => useTours(false));
    renderHook(() => useTransfers(false));
    renderHook(() => useBlogs(false));
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/tours?active=false");
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/transfers?active=false");
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/blog?published=false");
    });
  });
});

describe("item mutation wrappers", () => {
  beforeEach(() => jest.clearAllMocks());

  it("creates, updates, and deletes items with their exact URLs", async () => {
    mockedAxios.post.mockResolvedValue({ data: { id: "1" } } as never);
    mockedAxios.put.mockResolvedValue({ data: { id: "1" } } as never);
    mockedAxios.delete.mockResolvedValue({ data: { deleted: true } } as never);
    const create = renderHook(() => useCreateItem<{ name: string }>("tours"));
    const update = renderHook(() => useUpdateItem<{ name: string }>("tours", "1"));
    const remove = renderHook(() => useDeleteItem("tours", "1"));

    await act(async () => {
      await expect(create.result.current.create({ name: "tour" })).resolves.toEqual({
        id: "1",
      });
    });
    await act(async () => {
      await expect(update.result.current.update({ name: "new" })).resolves.toEqual({
        id: "1",
      });
    });
    await act(async () => {
      await expect(remove.result.current.deleteItem()).resolves.toEqual({
        deleted: true,
      });
    });
    expect(mockedAxios.post).toHaveBeenCalledWith("/api/tours", { name: "tour" });
    expect(mockedAxios.put).toHaveBeenCalledWith("/api/tours/1", { name: "new" });
    expect(mockedAxios.delete).toHaveBeenCalledWith("/api/tours/1");
  });

  it("propagates errors and stores them for each item mutation", async () => {
    mockedAxios.post.mockRejectedValue(new Error("create failed"));
    mockedAxios.put.mockRejectedValue(new Error("update failed"));
    mockedAxios.delete.mockRejectedValue(new Error("delete failed"));
    const create = renderHook(() => useCreateItem("tours"));
    const update = renderHook(() => useUpdateItem("tours", "1"));
    const remove = renderHook(() => useDeleteItem("tours", "1"));

    await act(async () => {
      await expect(create.result.current.create({})).rejects.toThrow("create failed");
    });
    await act(async () => {
      await expect(update.result.current.update({})).rejects.toThrow("update failed");
    });
    await act(async () => {
      await expect(remove.result.current.deleteItem()).rejects.toThrow("delete failed");
    });
    await waitFor(() => {
      expect(create.result.current.error?.message).toBe("create failed");
      expect(update.result.current.error?.message).toBe("update failed");
      expect(remove.result.current.error?.message).toBe("delete failed");
    });
  });
});
