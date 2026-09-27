/**
 * Consultation packages — the single source for prices, shared by the Pricing
 * and Book screens so the two can never quote different fees.
 */
export const PACKAGES = [
  {
    slug: 'horary',
    title: 'Horary (Prashna)',
    shortTitle: 'Horary (Prashna)',
    checkoutLabel: 'Horary (Prashna) — Single Query',
    price: 1500,
    priceLabel: '₹1,500',
    unit: 'single query',
    badge: '⚡ EASY FIRST STEP · 24-48 HR DELIVERY',
    features: [
      'For specific, time-bound questions (e.g. visa approval, job offer, deal closure)',
      'No birth details required (uses Horary seed number 1-249)',
      'Direct answer (Yes/No/When) based on KP sub-lord rules',
      'WhatsApp delivery + brief audio summary',
      'Fastest turnaround: 24 to 48 hours',
    ],
    cta: 'Select Horary (₹1,500)',
  },
  {
    slug: 'kp',
    title: 'Full KP Consultation',
    shortTitle: 'KP / BNN Consultation',
    checkoutLabel: 'Full KP / BNN Consultation',
    price: 3100,
    priceLabel: '₹3,100',
    unit: 'birth chart',
    badge: null,
    featured: true,
    features: [
      'Comprehensive life path analysis (Career, Marriage, Wealth, Travel, Health)',
      'Birth-time verification and rectification via Bhrigu Nadi (BNN)',
      'Exact event timing windows using KP Sub-lord theory',
      '45-minute phone/video consultation',
      'Detailed, structured PDF written report',
      'Turnaround: 3 to 5 business days',
    ],
    cta: 'Book Full Reading',
  },
  {
    slug: 'numerology',
    title: 'Numerology Analysis',
    shortTitle: 'Numerology Alignment',
    checkoutLabel: 'Numerology Name Alignment',
    price: 2100,
    priceLabel: '₹2,100',
    unit: 'name alignment',
    badge: null,
    features: [
      'Name spelling correction (child, adult, or business name)',
      'Lo Shu grid analysis for lucky dates, numbers, and colors',
      'Cross-checked with your KP natal chart to ensure planetary alignment',
      'Written report with recommended name changes and remedies',
      'Turnaround: 3 to 4 business days',
    ],
    cta: 'Select Numerology',
  },
  {
    slug: 'yantra',
    title: 'Yantra & Ritual Oils',
    shortTitle: 'Yantra & Ritual Oils',
    checkoutLabel: 'Yantra & Ritual Oils Package',
    price: 4500,
    priceLabel: '₹4,500',
    unit: 'remedy package',
    badge: null,
    features: [
      'Custom Yantra prescription based on your current KP dasha periods',
      'Hand-prepared consecrated ritual oils aligned to your goal',
      'Detailed instruction guide on energizing and daily practice',
      'Shipping included within India (International shipping extra)',
      'Turnaround: 5 to 7 business days',
    ],
    cta: 'Request Remedy',
  },
];

/** Order the booking form lists services in (cheapest first, as on the website). */
export const BOOKING_ORDER = ['horary', 'numerology', 'kp', 'yantra'];

export const packageBySlug = (slug) => PACKAGES.find((p) => p.slug === slug);

export const formatINR = (n) =>
  '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });
