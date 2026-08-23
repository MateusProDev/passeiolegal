import { createCollectionRoute } from "@/lib/api/crud-route";
import { testimonialService } from "@/lib/firestore";

const route = createCollectionRoute({
  labels: { singular: "testimonial", plural: "testimonials" },
  list: (filtered) => testimonialService.getAll(filtered),
  create: testimonialService.create,
  requiredFields: {
    present: ["clientName", "clientPhoto", "text"],
    numbers: ["rating"],
  },
});

export const GET = route.GET;
export const POST = route.POST;
