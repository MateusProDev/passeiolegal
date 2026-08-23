import { createCollectionRoute } from "@/lib/api/crud-route";
import { blogService } from "@/lib/firestore";

const route = createCollectionRoute({
  labels: { singular: "blog post", plural: "blog posts" },
  list: (filtered) => blogService.getAll(filtered),
  create: blogService.create,
  requiredFields: {
    present: ["title", "slug", "summary", "content", "imageUrl"],
  },
  listQuery: { param: "published", defaultWhenAbsent: true },
});

export const GET = route.GET;
export const POST = route.POST;
