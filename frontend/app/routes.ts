import { type RouteConfig, route, layout } from "@react-router/dev/routes";

export default [
  route("/workshops", "routes/workshops.tsx"),
  route("/workshops/:id", "routes/workshops.$id.tsx"),
  route("/workshops/new", "routes/workshops.new.tsx"),
  route("/workshops/:id/edit", "routes/workshops.$id.edit.tsx"),
  route("/login", "routes/login.tsx"),
  route("/register", "routes/register.tsx"),
  route("/logout", "routes/logout.tsx"),
  route("/onboarding", "routes/onboarding.tsx"),
  route("/checkout/:bookingId", "routes/checkout.$bookingId.tsx"),
  route("/hosts/:id", "routes/hosts.$id.tsx"),

  layout("routes/profile.tsx", [
    route("/profile", "routes/profile._index.tsx"),
    route("/profile/bookings", "routes/profile.bookings.tsx"),
    route("/profile/saved", "routes/profile.saved.tsx"),
    route("/profile/workshops", "routes/profile.workshops.tsx"),
    route("/profile/settings", "routes/profile.settings.tsx"),
  ]),

  // API resource routes
  route("/api/wishlist/:workshopId", "routes/api.wishlist.$workshopId.tsx"),
  route("/api/reviews/:workshopId", "routes/api.reviews.$workshopId.tsx"),
  route("/api/book/:workshopId", "routes/api.book.$workshopId.tsx"),
  route("/api/become-host", "routes/api.become-host.tsx"),
  route("/api/workshops", "routes/api.workshops.tsx"),
  route("/api/workshops/:workshopId", "routes/api.workshops.$workshopId.tsx"),
  route("/api/profile", "routes/api.profile.tsx"),
  route("/api/profile/delete", "routes/api.profile.delete.tsx"),
  route("/api/profile/export", "routes/api.profile.export.tsx"),
  route("/api/workshops/:workshopId/status", "routes/api.workshops.$workshopId.status.tsx"),
  route("/api/bookings/:bookingId/cancel", "routes/api.bookings.$bookingId.cancel.tsx"),
  route("/api/bookings/:bookingId/confirm", "routes/api.bookings.$bookingId.confirm.tsx"),
] satisfies RouteConfig;
