/** @jest-environment node */

import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

describe("middleware", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const requestFor = (pathname: string, authToken?: string) => {
    const request = new NextRequest(`https://example.com${pathname}`);
    if (authToken) request.cookies.set("authToken", authToken);
    return request;
  };

  it.each(["/api/tours", "/api/cloudinary/delete"])(
    "passes API path %s through",
    (pathname) => {
      const response = middleware(requestFor(pathname));
      expect(response.headers.get("x-middleware-next")).toBe("1");
    }
  );

  it("passes login through", () => {
    const response = middleware(requestFor("/login"));
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("redirects unauthenticated admin requests to login with the path", () => {
    const response = middleware(requestFor("/admin/tours"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://example.com/login?redirect=%2Fadmin%2Ftours"
    );
  });

  it("passes authenticated admin requests through", () => {
    const response = middleware(requestFor("/admin/tours", "token"));
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("passes public routes through", () => {
    const response = middleware(requestFor("/tours"));
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});
