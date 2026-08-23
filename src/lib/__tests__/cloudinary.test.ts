import {
  batchUploadImages,
  deleteImageFromCloudinary,
  getOptimizedImageUrl,
  uploadImageToCloudinary,
} from "@/lib/cloudinary";

describe("Cloudinary helpers", () => {
  const fetchMock = jest.fn();
  const file = new File(["image"], "photo.jpg", { type: "image/jpeg" });
  const responseFor = (data: unknown, ok = true) => ({
    ok,
    json: async () => data,
  });

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as typeof fetch;
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("uploads an image with the default folder", async () => {
    const response = {
      public_id: "photo",
      secure_url: "https://res.cloudinary.com/test/photo.jpg",
    };
    fetchMock.mockResolvedValue(responseFor(response));

    await expect(uploadImageToCloudinary(file)).resolves.toEqual(response);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.cloudinary.com/v1_1/test-cloud/image/upload",
      expect.objectContaining({ method: "POST" })
    );
    const body = fetchMock.mock.calls[0][1]?.body as FormData;
    expect(body.get("file")).toBe(file);
    expect(body.get("upload_preset")).toBe("test-preset");
    expect(body.get("folder")).toBe("passeio-legal");
  });

  it("uploads an image to passeio-legal/<folder>", async () => {
    fetchMock.mockResolvedValue(responseFor({ public_id: "photo" }));

    await uploadImageToCloudinary(file, "tours");
    const body = fetchMock.mock.calls[0][1]?.body as FormData;
    expect(body.get("folder")).toBe("passeio-legal/tours");
  });

  it("throws when an image upload fails", async () => {
    fetchMock.mockResolvedValue(responseFor("failed", false));
    await expect(uploadImageToCloudinary(file)).rejects.toThrow("Upload failed");
  });

  it("deletes an image through the API route", async () => {
    const response = { result: "ok" };
    fetchMock.mockResolvedValue(responseFor(response));

    await expect(deleteImageFromCloudinary("folder/photo")).resolves.toEqual(
      response
    );
    expect(fetchMock).toHaveBeenCalledWith("/api/cloudinary/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId: "folder/photo" }),
    });
  });

  it("throws when deletion fails", async () => {
    fetchMock.mockResolvedValue(responseFor("failed", false));
    await expect(deleteImageFromCloudinary("photo")).rejects.toThrow(
      "Delete failed"
    );
  });

  it("builds optimized URLs with no options and each option", () => {
    expect(getOptimizedImageUrl("photo")).toBe(
      "https://res.cloudinary.com/test-cloud/image/fetch/photo"
    );
    expect(
      getOptimizedImageUrl("photo", {
        width: 100,
        height: 200,
        crop: "fill",
        quality: "auto",
      })
    ).toBe(
      "https://res.cloudinary.com/test-cloud/image/fetch?w=100&h=200&c=fill&q=auto/photo"
    );
  });

  it("uploads all files in a batch and rejects if one upload fails", async () => {
    fetchMock
      .mockResolvedValueOnce(
        responseFor({ public_id: "one" })
      )
      .mockResolvedValueOnce(
        responseFor({ public_id: "two" })
      );
    await expect(batchUploadImages([file, file], "gallery")).resolves.toEqual([
      { public_id: "one" },
      { public_id: "two" },
    ]);

    fetchMock.mockReset();
    fetchMock
      .mockResolvedValueOnce(
        responseFor({ public_id: "one" })
      )
      .mockResolvedValueOnce(responseFor("failed", false));
    await expect(batchUploadImages([file, file])).rejects.toThrow("Upload failed");
  });
});
