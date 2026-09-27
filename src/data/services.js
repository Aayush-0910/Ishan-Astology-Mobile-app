/**
 * Bookable consultations and the astrology behind each one. Single source for
 * prices, copy and FAQs across Home, Services, the service screens and the
 * booking flow.
 */
export const PACKAGES = [
  {
    slug: 'horary',
    title: 'Horary (Prashna)',
    sanskrit: 'प्रश्न कुण्डली',
    tagline: 'One sharp question. A Yes / No / When answer.',
    checkoutLabel: 'Horary (Prashna) — Single Query',
    price: 1500,
    priceLabel: '₹1,500',
    unit: 'single query',
    turnaround: '24–48 hours',
    needsBirthDetails: false,
    badge: 'Easy first step',
    features: [
      'For specific, time-bound questions (e.g. visa approval, job offer, deal closure)',
      'No birth details required (uses Horary seed number 1-249)',
      'Direct answer (Yes/No/When) based on KP sub-lord rules',
      'WhatsApp delivery + brief audio summary',
      'Fastest turnaround: 24 to 48 hours',
    ],
    about: [
      "When a birth chart isn't available — or when a question is sharp and time-bound — KP horary casts a chart on the moment of the question itself. A number between 1 and 249 is drawn, and the chart that number describes is read with full KP rigor.",
      'Horary is the practice\'s preferred method for tight, transactional questions: "Should I buy this property this month?", "Will this deal close?", "Where is the missing item?" — questions where a clean yes/no/when is more valuable than a life-wide reading.',
    ],
    goodFor: [
      'Yes/no business questions',
      'Deal closure timing',
      'Lost objects & missing persons',
      'Single-question consultations',
    ],
    questionHint: 'Ask one focused, time-bound question — e.g. "Will my visa be approved before March?"',
  },
  {
    slug: 'kp',
    title: 'Full KP Consultation',
    sanskrit: 'कृष्णमूर्ति पद्धति · भृगु नाडी',
    tagline: 'Your full chart, verified with BNN, timed with KP.',
    checkoutLabel: 'Full KP / BNN Consultation',
    price: 3100,
    priceLabel: '₹3,100',
    unit: 'birth chart',
    turnaround: '3–5 business days',
    needsBirthDetails: true,
    badge: 'Most complete',
    features: [
      'Comprehensive life path analysis (Career, Marriage, Wealth, Travel, Health)',
      'Birth-time verification and rectification via Bhrigu Nadi (BNN)',
      'Exact event timing windows using KP Sub-lord theory',
      '45-minute phone/video consultation',
      'Detailed, structured PDF written report',
      'Turnaround: 3 to 5 business days',
    ],
    about: [
      "Krishnamurti Paddhati is the practice's flagship timing system. It uses sub-lord theory and the Placidus house division to deliver sharper event timing than sign-based predictions allow — narrowing a vague \"soon\" to a specific date range.",
      "Before any prediction, Bhrigu Nadi (BNN) verifies the chart: planetary conjunctions, aspects and Jupiter's transit are used to read past events. If that cold reading lands, the chart and birth time are confirmed — and BNN is used again as a second opinion on the KP timing windows.",
    ],
    goodFor: [
      'Marriage & relationship timing',
      'Career & job change windows',
      'Foreign settlement & visa',
      'Litigation & legal matters',
      'Property & vehicle purchase',
      'Health & longevity periods',
      'Birth-time rectification',
    ],
    questionHint: 'List the areas you want covered — career, marriage, health, travel — and any dates you are weighing.',
  },
  {
    slug: 'numerology',
    title: 'Numerology Analysis',
    sanskrit: 'अंक शास्त्र',
    tagline: 'Names and dates that agree with your chart.',
    checkoutLabel: 'Numerology Name Alignment',
    price: 2100,
    priceLabel: '₹2,100',
    unit: 'name alignment',
    turnaround: '3–4 business days',
    needsBirthDetails: true,
    badge: null,
    features: [
      'Name spelling correction (child, adult, or business name)',
      'Lo Shu grid analysis for lucky dates, numbers, and colors',
      'Cross-checked with your KP natal chart to ensure planetary alignment',
      'Written report with recommended name changes and remedies',
      'Turnaround: 3 to 4 business days',
    ],
    about: [
      'Number-based analysis of name and birth date forms the third independent layer. Used most often for child naming, choosing a business name, picking a wedding date, or deciding when to begin something significant.',
      "Numerology is rarely the only input. It typically arrives after the KP reading — as a clean, independent check on naming and timing decisions, ensuring the numerical signature of a name or date harmonises with the natal chart's recommendations.",
    ],
    goodFor: [
      'Child naming',
      'Business name selection',
      'Wedding date selection',
      'Lucky number analysis',
      'Name correction (numerology)',
      'Vehicle number selection',
    ],
    questionHint: 'Tell us the name(s) or dates you are considering and what they are for.',
  },
  {
    slug: 'yantra',
    title: 'Yantra & Ritual Oils',
    sanskrit: 'यंत्र एवं तेल विधि',
    tagline: 'Remedies prescribed from your chart, not off a shelf.',
    checkoutLabel: 'Yantra & Ritual Oils Package',
    price: 4500,
    priceLabel: '₹4,500',
    unit: 'remedy package',
    turnaround: '5–7 business days',
    needsBirthDetails: true,
    badge: null,
    features: [
      'Custom Yantra prescription based on your current KP dasha periods',
      'Hand-prepared consecrated ritual oils aligned to your goal',
      'Detailed instruction guide on energizing and daily practice',
      'Shipping included within India (International shipping extra)',
      'Turnaround: 5 to 7 business days',
    ],
    about: [
      'Yantras are geometric diagrams, hand-prepared and consecrated to focus intention toward a specific outcome — wealth, protection, relationships. Ritual oils, blended in the same tradition, are used for anointing and everyday practice.',
      "Each item is prescribed only after the underlying chart or numerology signature is read, so what's recommended matches what the chart actually indicates — not a generic remedy.",
    ],
    goodFor: [
      'Personalized yantra prescription',
      'Hand-prepared ritual oils',
      'Protection & prosperity yantras',
      'Relationship harmony oils',
      'Remedies paired with chart timing',
    ],
    questionHint: 'Describe what you want support with (wealth, protection, relationships…) and your shipping city.',
  },
];

export const packageBySlug = (slug) => PACKAGES.find((p) => p.slug === slug);

export const formatINR = (n) =>
  '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });
