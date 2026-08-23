import { createCollectionRoute } from "@/lib/api/crud-route";
import { bannerService } from "@/lib/firestore";

const route = createCollectionRoute({
  labels: { singular: "banner", plural: "banners" },
  list: (filtered) => bannerService.getAll(filtered),
  create: bannerService.create,
  requiredFields: { present: ["title", "imageUrl", "buttonText", "buttonLink"] },
});

export const GET = route.GET;
export const POST = route.POST;
