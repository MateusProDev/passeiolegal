import { createItemRoute } from "@/lib/api/crud-route";
import { faqService } from "@/lib/firestore";

const route = createItemRoute({
  labels: { singular: "FAQ item", plural: "FAQ items" },
  read: faqService.getById,
  update: faqService.update,
  remove: faqService.delete,
});

export const PUT = route.PUT;
export const DELETE = route.DELETE;
