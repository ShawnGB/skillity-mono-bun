import {
  type RouteConfig,
  route,
  layout,
  index,
} from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('/workshops', 'routes/workshops.tsx'),
  route('/workshops/:id', 'routes/workshops.$id.tsx'),
  route('/workshops/:id/og-image.png', 'routes/workshops.$id.og-image[.]png.tsx'),
  route('/workshops/new', 'routes/workshops.new.tsx'),
  route('/workshops/:id/edit', 'routes/workshops.$id.edit.tsx'),
  route('/login', 'routes/login.tsx'),
  route('/register', 'routes/register.tsx'),
  route('/logout', 'routes/logout.tsx'),
  route('/auth/mollie/return', 'routes/auth.mollie.return.tsx'),
  route('/onboarding', 'routes/onboarding.tsx'),
  route('/onboarding/success', 'routes/onboarding.success.tsx'),
  route('/checkout/:bookingId', 'routes/checkout.$bookingId.tsx'),
  route('/checkout/:bookingId/success', 'routes/checkout.$bookingId.success.tsx'),
  route('/checkout/:bookingId/cancel', 'routes/checkout.$bookingId.cancel.tsx'),
  route('/hosts/:id', 'routes/hosts.$id.tsx'),

  layout('routes/profile.tsx', [
    route('/profile', 'routes/profile._index.tsx'),
    route('/profile/bookings', 'routes/profile.bookings.tsx'),
    route('/profile/saved', 'routes/profile.saved.tsx'),
    route('/profile/workshops', 'routes/profile.workshops.tsx'),
    route('/profile/settings', 'routes/profile.settings.tsx'),
  ]),

  // API resource routes
  route('/api/wishlist/:workshopId', 'routes/api.wishlist.$workshopId.tsx'),
  route('/api/reviews/:workshopId', 'routes/api.reviews.$workshopId.tsx'),
  route('/api/book/:workshopId', 'routes/api.book.$workshopId.tsx'),
  route('/api/become-host', 'routes/api.become-host.tsx'),
  route('/api/workshops', 'routes/api.workshops.tsx'),
  route('/api/workshops/:workshopId', 'routes/api.workshops.$workshopId.tsx'),
  route(
    '/api/workshops/:workshopId/conductors',
    'routes/api.workshops.$workshopId.conductors.tsx',
  ),
  route(
    '/api/workshops/:workshopId/photos',
    'routes/api.workshops.$workshopId.photos.tsx',
  ),
  route('/api/users/lookup', 'routes/api.users.lookup.tsx'),
  route('/api/uploads', 'routes/api.uploads.tsx'),
  route('/api/pexels-suggestions', 'routes/api.pexels-suggestions.tsx'),
  route('/api/profile', 'routes/api.profile.tsx'),
  route('/api/profile/delete', 'routes/api.profile.delete.tsx'),
  route('/api/profile/export', 'routes/api.profile.export.tsx'),
  route(
    '/api/workshops/:workshopId/status',
    'routes/api.workshops.$workshopId.status.tsx',
  ),
  route(
    '/api/bookings/:bookingId/cancel',
    'routes/api.bookings.$bookingId.cancel.tsx',
  ),
  route(
    '/api/bookings/:bookingId/confirm',
    'routes/api.bookings.$bookingId.confirm.tsx',
  ),
  route(
    '/api/bookings/:bookingId/pay',
    'routes/api.bookings.$bookingId.pay.tsx',
  ),
  route(
    '/api/bookings/:bookingId/status',
    'routes/api.bookings.$bookingId.status.tsx',
  ),

  // SEO
  route('/sitemap.xml', 'routes/sitemap[.]xml.tsx'),
  route('/robots.txt', 'routes/robots[.]txt.tsx'),

  // Guides
  route('/guides/kleingewerbe', 'routes/guides.kleingewerbe.tsx'),
  route('/guides/plan-workshop', 'routes/guides.plan-workshop.tsx'),
  route('/guides/find-location', 'routes/guides.find-location.tsx'),

  // Content pages
  route('/about', 'routes/about.tsx'),
  route('/teach', 'routes/teach.tsx'),
  route('/faq', 'routes/faq.tsx'),

  // Legal pages
  route('/agb', 'routes/agb.tsx'),
  route('/datenschutz', 'routes/datenschutz.tsx'),
  route('/impressum', 'routes/impressum.tsx'),
  route('/widerruf', 'routes/widerruf.tsx'),
  route('/guidelines', 'routes/guidelines.tsx'),
] satisfies RouteConfig;
