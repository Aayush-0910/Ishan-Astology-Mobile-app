# Ishan Astrology — Mobile App

Native Android and iOS app for Ishan Astrology (KP, Bhrigu Nadi, Numerology, Horary,
Yantra & Oils), built with [Expo](https://expo.dev) SDK 57, React Native and Expo Router.

## What's in the app

**Tabs**

| Tab | What it does |
| --- | --- |
| **Home** | Personal greeting, one-tap Horary question, quick actions (Book, Ask, WhatsApp, Call), status of your latest consultation, service carousel, how it works, recent case studies. |
| **Services** | The four consultations with price and turnaround. Each opens its own screen with a sticky **Book now** bar. |
| **Ask** | Consultation assistant. Recommends the right reading from your question, skips birth questions if your profile is saved, and ends with **Book** or **Continue on WhatsApp**. |
| **Bookings** | Every consultation booked on this phone, with payment reference and status. |
| **Profile** | Saved birth details, contact (WhatsApp, call, email), reviews and feedback, about, FAQ, social links. |

**Booking flow** (`/book`): a 4-step flow — consultation → your details → your question → review & pay.
- Birth details are prefilled from your profile and can be saved back to it. Horary skips them.
- Payment is by UPI in a bottom sheet: open your UPI app directly, or scan the on-device QR from another phone. Confirming needs the 12-digit UPI transaction reference (UTR).
- The booking is saved on the phone. Its detail screen sends everything to Ishan ji on WhatsApp in one tap.

Profile and bookings are stored only on the device (AsyncStorage). Reviews and feedback are
emailed through the backend.

## Run it

```bash
npm install
npx expo start      # scan the QR with the Expo Go app on your phone
```

Everything used is included in Expo Go, so no custom build is needed to try it.

| Variable | Default | Purpose |
| --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | `https://ishan-astrology-backend-j97a.vercel.app` | Backend that emails reviews and feedback (`/api/send-email`). |

## Build for the Play Store / App Store

```bash
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform android   # .aab for Google Play
npx eas-cli@latest build --platform ios       # needs an Apple Developer account
```

App ID: `com.ishanastrology.app` (set in `app.json`; it cannot change after the first store upload).

**Before publishing**
- Replace the placeholder Expo icons in `assets/` with the Ishan Astrology artwork.
- Replace the placeholder biography in `src/data/content.js` (`ABOUT.story`).

## Project layout

```
src/
  app/                    Expo Router routes
    (tabs)/               Home, Services, Ask, Bookings, Profile
    book.jsx              booking flow
    service/[slug].jsx    consultation details
    bookings/[id].jsx     one booking: status, details, WhatsApp hand-off
    profile-edit.jsx, reviews.jsx, about.jsx, faq.jsx
  components/             UI kit (ui.jsx), forms, UPI payment sheet, chart diagrams
  state/AppStore.jsx      profile + bookings, persisted on device
  data/                   consultations & prices, content, published reviews
  config/                 backend URL, email client, contact details
  theme.js                colours, fonts, radii
```

## Scripts

- `npm start` — Expo dev server (`npm run android` / `npm run ios` open a device directly)
- `npm run lint` — ESLint (`eslint-config-expo`)
