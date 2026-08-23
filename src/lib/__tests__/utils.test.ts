import {
  APIError,
  bannerSchema,
  blogPostSchema,
  buildShareUrl,
  calculateAverageRating,
  chunk,
  faqSchema,
  formatDate,
  formatDatetime,
  formatPrice,
  generateSlug,
  getStarArray,
  isValidUrl,
  omit,
  pick,
  retry,
  slugify,
  sortByOrder,
  testimonialSchema,
  tourSchema,
  transferSchema,
  truncateText,
} from "@/lib/utils";

const normalizeSpaces = (value: string) => value.replace(/\u00a0/g, " ");

describe("formatting utilities", () => {
  it("formats prices using the requested locale", () => {
    expect(normalizeSpaces(formatPrice(1234.5))).toBe("R$ 1.234,50");
    expect(normalizeSpaces(formatPrice(12.5, "en-US"))).toMatch(/^R\$ ?12\.50$/);
  });

  it("formats dates and datetimes", () => {
    const date = new Date(2024, 0, 2, 13, 4);
    expect(normalizeSpaces(formatDate(date))).toContain("2 de janeiro de 2024");
    expect(normalizeSpaces(formatDatetime(date))).toMatch(
      /02\/01\/2024,? 13:04/
    );
  });
});

describe("string and URL utilities", () => {
  it("slugifies text while preserving the implementation's trim behavior", () => {
    expect(slugify("  São Paulo, Brasil!  passeio  legal  ")).toBe(
      "-sao-paulo-brasil-passeio-legal-"
    );
    expect(generateSlug("Passeio de Barco")).toBe("passeio-de-barco");
  });

  it("truncates only text longer than the limit and trims the cut", () => {
    expect(truncateText("exact", 5)).toBe("exact");
    expect(truncateText("hello world", 8)).toBe("hello wo...");
    expect(truncateText("hello   world", 6)).toBe("hello...");
  });

  it("validates URLs and builds share URLs", () => {
    expect(isValidUrl("https://example.com/path")).toBe(true);
    expect(isValidUrl("not a URL")).toBe(false);
    expect(
      buildShareUrl("https://example.com", "/share", {
        message: "Olá mundo",
        source: "test",
      })
    ).toBe(
      "https://example.com/share?message=Ol%C3%A1+mundo&source=test"
    );
  });
});

describe("array, rating, and object utilities", () => {
  it("sorts by order without mutating and treats missing order as zero", () => {
    const items = [{ name: "late", order: 2 }, { name: "default" }, { name: "first", order: 1 }];
    expect(sortByOrder(items)).toEqual([
      { name: "default" },
      { name: "first", order: 1 },
      { name: "late", order: 2 },
    ]);
    expect(items).toEqual([
      { name: "late", order: 2 },
      { name: "default" },
      { name: "first", order: 1 },
    ]);
  });

  it("chunks arrays including empty and oversized arrays", () => {
    expect(chunk([1, 2, 3], 10)).toEqual([[1, 2, 3]]);
    expect(chunk([], 2)).toEqual([]);
  });

  it("creates full-star arrays for fractional ratings", () => {
    expect(getStarArray(3.9)).toEqual([true, true, true, false, false]);
  });

  it("averages ratings with one decimal precision", () => {
    expect(calculateAverageRating([])).toBe(0);
    expect(calculateAverageRating([4, 5, 4])).toBe(4.3);
  });

  it("omits and picks keys without mutating the source", () => {
    const source = { first: 1, second: 2, third: 3 };
    expect(omit(source, ["second"])).toEqual({ first: 1, third: 3 });
    expect(pick(source, ["first", "third"])).toEqual({ first: 1, third: 3 });
    expect(source).toEqual({ first: 1, second: 2, third: 3 });
  });
});

describe("APIError and retry", () => {
  it("exposes the status code and APIError name", () => {
    const error = new APIError(404, "Not found");
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("APIError");
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("Not found");
  });

  it("retries until a later attempt succeeds", async () => {
    const fn = jest
      .fn(() => Promise.resolve("ok"))
      .mockRejectedValueOnce(new Error("temporary"))
      .mockResolvedValue("ok");
    await expect(retry(fn, 3, 0)).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("rethrows the last error after maxRetries", async () => {
    const error = new Error("permanent");
    const fn = jest.fn(() => Promise.reject(error));
    await expect(retry(fn, 2, 0)).rejects.toBe(error);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe("validation schemas", () => {
  const imageUrl = "https://example.com/image.jpg";

  it("accepts and rejects banner payloads at enforced boundaries", () => {
    const valid = {
      title: "Banner",
      imageUrl,
      imageAlt: "Banner image",
      buttonText: "View",
      buttonLink: "https://example.com/tours",
      order: 0,
      active: true,
    };
    expect(bannerSchema.safeParse(valid).success).toBe(true);
    expect(bannerSchema.safeParse({ ...valid, title: "" }).success).toBe(false);
    expect(bannerSchema.safeParse({ ...valid, imageUrl: "invalid" }).success).toBe(false);
    expect(bannerSchema.safeParse({ ...valid, imageAlt: "" }).success).toBe(false);
    expect(bannerSchema.safeParse({ ...valid, buttonText: "" }).success).toBe(false);
    expect(bannerSchema.safeParse({ ...valid, buttonLink: "invalid" }).success).toBe(false);
    expect(bannerSchema.safeParse({ ...valid, order: 1.5 }).success).toBe(false);
    expect(bannerSchema.safeParse({ ...valid, order: -1 }).success).toBe(false);
  });

  it("accepts and rejects tour payloads at enforced boundaries", () => {
    const valid = {
      name: "City tour",
      description: "A city tour",
      mainImageUrl: imageUrl,
      mainImageAlt: "City",
      galleryImages: [{ url: imageUrl, alt: "Gallery", order: 0 }],
      price: 1,
      duration: "2 hours",
      includesItems: [],
      excludesItems: [],
      featured: false,
      active: true,
    };
    expect(tourSchema.safeParse(valid).success).toBe(true);
    expect(tourSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
    expect(tourSchema.safeParse({ ...valid, description: "" }).success).toBe(false);
    expect(tourSchema.safeParse({ ...valid, mainImageUrl: "bad" }).success).toBe(false);
    expect(tourSchema.safeParse({ ...valid, mainImageAlt: "" }).success).toBe(false);
    expect(tourSchema.safeParse({ ...valid, price: 0 }).success).toBe(false);
    expect(tourSchema.safeParse({ ...valid, duration: "" }).success).toBe(false);
    expect(tourSchema.safeParse({ ...valid, galleryImages: [{ ...valid.galleryImages[0], url: "bad" }] }).success).toBe(false);
    expect(tourSchema.safeParse({ ...valid, galleryImages: [{ ...valid.galleryImages[0], alt: 1 }] }).success).toBe(false);
    expect(tourSchema.safeParse({ ...valid, galleryImages: [{ ...valid.galleryImages[0], order: 1.5 }] }).success).toBe(false);
  });

  it("accepts and rejects transfer payloads at enforced boundaries", () => {
    const valid = {
      name: "Airport transfer",
      description: "A comfortable transfer",
      imageUrl,
      imageAlt: "Vehicle",
      price: 1,
      vehicleType: "Van",
      capacity: 1,
      active: true,
    };
    expect(transferSchema.safeParse(valid).success).toBe(true);
    expect(transferSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
    expect(transferSchema.safeParse({ ...valid, description: "" }).success).toBe(false);
    expect(transferSchema.safeParse({ ...valid, price: 0 }).success).toBe(false);
    expect(transferSchema.safeParse({ ...valid, imageAlt: "" }).success).toBe(false);
    expect(transferSchema.safeParse({ ...valid, vehicleType: "" }).success).toBe(false);
    expect(transferSchema.safeParse({ ...valid, capacity: 0 }).success).toBe(false);
    expect(transferSchema.safeParse({ ...valid, imageUrl: "bad" }).success).toBe(false);
  });

  it("accepts and rejects testimonial payloads at text and rating boundaries", () => {
    const valid = {
      clientName: "Ana",
      clientPhoto: imageUrl,
      clientPhotoAlt: "Ana",
      text: "Great experience",
      rating: 5,
      active: true,
    };
    expect(testimonialSchema.safeParse(valid).success).toBe(true);
    expect(testimonialSchema.safeParse({ ...valid, clientName: "" }).success).toBe(false);
    expect(testimonialSchema.safeParse({ ...valid, clientPhoto: "bad" }).success).toBe(false);
    expect(testimonialSchema.safeParse({ ...valid, clientPhotoAlt: "" }).success).toBe(false);
    expect(testimonialSchema.safeParse({ ...valid, text: "Short" }).success).toBe(false);
    expect(testimonialSchema.safeParse({ ...valid, rating: 0 }).success).toBe(false);
    expect(testimonialSchema.safeParse({ ...valid, rating: 1.5 }).success).toBe(false);
    expect(testimonialSchema.safeParse({ ...valid, rating: 6 }).success).toBe(false);
  });

  it("accepts and rejects blog post payloads at text boundaries", () => {
    const valid = {
      title: "A post",
      slug: "a-post",
      summary: "A sufficiently long summary",
      content: "x".repeat(50),
      imageUrl,
      imageAlt: "Post",
      published: false,
    };
    expect(blogPostSchema.safeParse(valid).success).toBe(true);
    expect(blogPostSchema.safeParse({ ...valid, title: "" }).success).toBe(false);
    expect(blogPostSchema.safeParse({ ...valid, slug: "" }).success).toBe(false);
    expect(blogPostSchema.safeParse({ ...valid, summary: "short" }).success).toBe(false);
    expect(blogPostSchema.safeParse({ ...valid, content: "short" }).success).toBe(false);
    expect(blogPostSchema.safeParse({ ...valid, imageUrl: "bad" }).success).toBe(false);
    expect(blogPostSchema.safeParse({ ...valid, imageAlt: "" }).success).toBe(false);
  });

  it("accepts and rejects FAQ payloads at text and order boundaries", () => {
    const valid = {
      question: "Where are you?",
      answer: "We are in Brazil.",
      order: 0,
      active: true,
    };
    expect(faqSchema.safeParse(valid).success).toBe(true);
    expect(faqSchema.safeParse({ ...valid, question: "What" }).success).toBe(false);
    expect(faqSchema.safeParse({ ...valid, answer: "Short" }).success).toBe(false);
    expect(faqSchema.safeParse({ ...valid, order: 1.5 }).success).toBe(false);
    expect(faqSchema.safeParse({ ...valid, order: -1 }).success).toBe(false);
  });
});
