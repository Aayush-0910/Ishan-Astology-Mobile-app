/**
 * Client side of the form email delivery.
 *
 * The app posts to the backend's /api/send-email endpoint, which holds the
 * Mailtrap credential and does the actual sending. No API token, address list
 * or provider detail is present in the bundle — deliberately, because anything
 * shipped inside an app binary can be extracted and reused by anyone.
 */
import { API_ENDPOINTS } from './api';

const ENDPOINT = API_ENDPOINTS.SEND_EMAIL;

/**
 * Send one submission.
 *
 * Resolves on delivery and throws with a message suitable for showing the
 * visitor otherwise. Unlike a fire-and-forget POST to a third party, the
 * endpoint reports the real outcome, so "sent" on screen means sent.
 *
 * @param {'feedback'|'review'} formType  which form, picks the sending address
 * @param {string} subject                email subject line
 * @param {Record<string,string>} fields  becomes the body, one row per entry
 * @param {string} [replyTo]              sender's address, set as Reply-To
 * @param {string} [honeypot]            hidden field; non-empty means a bot
 */
export const sendEmail = async ({ formType, subject, fields, replyTo, honeypot }) => {
  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formType, subject, fields, replyTo, botcheck: honeypot }),
    });
  } catch {
    throw new Error('Could not reach the server. Please check your connection and try again.');
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.success) {
    throw new Error(data.detail || data.message || 'The message could not be sent. Please try again.');
  }

  return data;
};
