import { createItemRoute } from "@/lib/api/crud-route";
import { bannerService } from "@/lib/firestore";

const route = createItemRoute({
  labels: { singular: "banner", plural: "banners" },
  read: bannerService.getById,
  update: bannerService.update,
  remove: bannerService.delete,
});

export const GET = route.GET;
export const PUT = route.PUT;
export const DELETE = route.DELETE;
