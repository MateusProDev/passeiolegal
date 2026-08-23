import { createItemRoute } from "@/lib/api/crud-route";
import { blogService } from "@/lib/firestore";

const route = createItemRoute({
  labels: { singular: "blog post", plural: "blog posts" },
  read: blogService.getById,
  update: blogService.update,
  remove: blogService.delete,
});

export const PUT = route.PUT;
export const DELETE = route.DELETE;
