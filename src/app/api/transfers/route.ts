import { createCollectionRoute } from "@/lib/api/crud-route";
import { transferService } from "@/lib/firestore";

const route = createCollectionRoute({
  labels: { singular: "transfer", plural: "transfers" },
  list: (filtered) => transferService.getAll(filtered),
  create: transferService.create,
  requiredFields: {
    present: ["name", "description", "imageUrl"],
    numbers: ["capacity"],
  },
  listQuery: { param: "active" },
});

export const GET = route.GET;
export const POST = route.POST;
