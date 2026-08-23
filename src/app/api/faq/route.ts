import { createCollectionRoute } from "@/lib/api/crud-route";
import { faqService } from "@/lib/firestore";

const route = createCollectionRoute({
  labels: { singular: "FAQ item", plural: "FAQ items" },
  list: (filtered) => faqService.getAll(filtered),
  create: faqService.create,
  requiredFields: { present: ["question", "answer"] },
});

export const GET = route.GET;
export const POST = route.POST;
