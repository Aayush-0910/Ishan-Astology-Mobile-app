/**
 * Published client reviews.
 *
 * Empty for now, so the homepage shows only the "Share your experience" call
 * to action and no testimonial cards. Add entries here as real reviews come in
 * through the Reviews tab — the section, the star average and the service filters
 * all appear automatically once this array is not empty.
 *
 * Only add reviews the client agreed to have published, and match the name to
 * the permission they gave on the form (full name / initials only).
 *
 * Fields:
 *   name     — display name. Use "R. M., Pune" style if they asked for initials.
 *   location — city / country, shown under the name.
 *   service  — must match one of SERVICE_FILTERS below, for the filter chips.
 *   rating   — 1 to 5.
 *   date     — 'Month YYYY', shown on the card.
 *   body     — the review text itself.
 *   featured — true puts it in the homepage highlights strip.
 */


export const SERVICE_FILTERS = [
  'All',
  'KP / BNN',
  'Horary',
  'Numerology',
  'Yantra & Oils',
];

export const REVIEWS = [];

/** Average rating across all published reviews, to one decimal place. */
export const averageRating =
  REVIEWS.length > 0
    ? Math.round((REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length) * 10) / 10
    : 0;

export const featuredReviews = REVIEWS.filter((r) => r.featured);
