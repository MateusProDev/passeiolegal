import { createItemRoute } from "@/lib/api/crud-route";
import { tourService } from "@/lib/firestore";

const route = createItemRoute({
  labels: { singular: "tour", plural: "tours" },
  read: tourService.getById,
  update: tourService.update,
  remove: tourService.delete,
});

export const GET = route.GET;
export const PUT = route.PUT;
export const DELETE = route.DELETE;
