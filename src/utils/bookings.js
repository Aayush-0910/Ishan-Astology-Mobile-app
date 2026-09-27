import { packageBySlug, formatINR } from '../data/services';
import { UPI_ID, whatsappLinkWithText } from '../config/contact';

export const makeRef = () =>
  'IAP' + Date.now().toString(36).toUpperCase().slice(-6) + Math.floor(10 + Math.random() * 89);

/** Where a booking stands, from the client's side of the process. */
export function bookingStatus(b) {
  if (!b.whatsappSent) {
    return { label: 'Send your details', tone: 'amber', icon: 'alert-circle' };
  }
  return { label: 'Awaiting confirmation', tone: 'teal', icon: 'time' };
}

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

/** The WhatsApp message that hands a paid booking over to Ishan Astrology. */
export function bookingWhatsAppLink(b) {
  const pkg = packageBySlug(b.slug);
  const lines = [
    'Namaste Ishan Astrology,',
    '',
    'I have completed payment for a consultation. Details:',
    `• Name: ${b.name}`,
    `• Service: ${pkg?.checkoutLabel ?? b.slug}`,
  ];
  if (b.dob) lines.push(`• Date of Birth: ${b.dob}`);
  if (b.tob) lines.push(`• Time of Birth: ${b.tob}`);
  if (b.pob) lines.push(`• Place of Birth: ${b.pob}`);
  lines.push(
    `• Questions/Core Concern: ${b.question}`,
    `• Amount Paid: ${formatINR(b.amount)}`,
    `• Payment Method: UPI — ${UPI_ID}`,
    `• UPI Transaction ID (UTR): ${b.utr}`,
    `• Booking Reference: ${b.id}`
  );
  return whatsappLinkWithText(lines.join('\n'));
}
