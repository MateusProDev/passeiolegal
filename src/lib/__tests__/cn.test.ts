import { cn } from "@/lib/cn";

describe("cn", () => {
  it("combines conditional classes and resolves Tailwind conflicts", () => {
    expect(cn("p-2", false && "hidden", "text-red-500")).toBe(
      "p-2 text-red-500"
    );
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});
