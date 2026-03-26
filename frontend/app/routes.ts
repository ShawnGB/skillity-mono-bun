import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/workshops", "routes/workshops.tsx"),
  route("/api/wishlist/:workshopId", "routes/api.wishlist.$workshopId.tsx"),
] satisfies RouteConfig;
