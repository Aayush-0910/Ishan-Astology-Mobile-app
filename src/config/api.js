/**
 * Backend API Configuration
 *
 * Base URL and endpoints for the Ishan Astrology FastAPI backend service.
 * Production backend: https://ishan-astrology-backend-j97a.vercel.app
 *
 * Override at build time with EXPO_PUBLIC_API_URL (e.g. in a .env file) to
 * point the app at a local or staging backend.
 */

export const BACKEND_PROD_URL = 'https://ishan-astrology-backend-j97a.vercel.app';

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || BACKEND_PROD_URL
).replace(/\/+$/, '');

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/api/health`,
  SEND_EMAIL: `${API_BASE_URL}/api/send-email`,
};
