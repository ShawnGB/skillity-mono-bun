import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/workshops", "routes/workshops.tsx"),
  route("/workshops/:id", "routes/workshops.$id.tsx"),
  route("/api/wishlist/:workshopId", "routes/api.wishlist.$workshopId.tsx"),
  route("/api/reviews/:workshopId", "routes/api.reviews.$workshopId.tsx"),
  route("/api/book/:workshopId", "routes/api.book.$workshopId.tsx"),
] satisfies RouteConfig;
