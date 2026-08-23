import { createCollectionRoute } from "@/lib/api/crud-route";
import { tourService } from "@/lib/firestore";

const route = createCollectionRoute({
  labels: { singular: "tour", plural: "tours" },
  list: (filtered) => tourService.getAll(filtered),
  create: tourService.create,
  requiredFields: { present: ["name", "description", "mainImageUrl"] },
  listQuery: { param: "active" },
});

export const GET = route.GET;
export const POST = route.POST;
