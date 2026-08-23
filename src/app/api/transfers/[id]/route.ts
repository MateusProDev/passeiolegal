import { createItemRoute } from "@/lib/api/crud-route";
import { transferService } from "@/lib/firestore";

const route = createItemRoute({
  labels: { singular: "transfer", plural: "transfers" },
  read: transferService.getById,
  update: transferService.update,
  remove: transferService.delete,
});

export const GET = route.GET;
export const PUT = route.PUT;
export const DELETE = route.DELETE;
