/**
 * Contact details and outbound links, kept in one place so the booking flow,
 * the chat assistant and the footer never disagree.
 */
export const WHATSAPP_NUMBER = '918076599325';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export const PHONES = [
  { label: '+91 80765 99325', href: 'tel:+918076599325' },
  { label: '+91 79828 99199', href: 'tel:+917982899199' },
];

export const EMAIL = 'info@ishanastrology.com';

export const SOCIAL = [
  { label: 'YouTube', href: 'https://www.youtube.com/@IshanAstrology' },
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61579781661434' },
  { label: 'Instagram', href: 'https://www.instagram.com/ishan_astro' },
];

export const UPI_ID = '8076599325@ptaxis';
export const UPI_PAYEE_NAME = 'Ishan Astrology';

export const whatsappLinkWithText = (text) =>
  `${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`;
