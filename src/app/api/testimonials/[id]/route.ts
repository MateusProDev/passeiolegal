import { createItemRoute } from "@/lib/api/crud-route";
import { testimonialService } from "@/lib/firestore";

const route = createItemRoute({
  labels: { singular: "testimonial", plural: "testimonials" },
  read: testimonialService.getById,
  update: testimonialService.update,
  remove: testimonialService.delete,
});

export const PUT = route.PUT;
export const DELETE = route.DELETE;
