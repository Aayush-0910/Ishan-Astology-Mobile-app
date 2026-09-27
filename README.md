# Ishan Astrology — Mobile App

React Native app for Ishan Astrology (KP, Bhrigu Nadi, Numerology, Horary, Yantra & Oils),
built with [Expo](https://expo.dev) SDK 57 and Expo Router. It runs on **Android**, **iOS** and
the **web** from one codebase — the web build replaces the previous Vite website.

## Screens

| Tab / route | What it does |
| --- | --- |
| **Services** `/` | The five systems with their chart diagrams, the moving systems ticker, the consultation process, case studies and reviews. `/?section=kp` (also `bnn`, `numerology`, `horary`, `yantra`, `process`, `cases`, `reviews`) scrolls to a section. |
| **About** `/about` | Practice story, approach, principles, "what this is / is not". |
| **Pricing** `/pricing` | Package cards and FAQ. `/pricing?section=horary` jumps to a package. |
| **Book** `/booking` | Birth details form → checkout → UPI payment sheet (QR generated on-device, "Pay via UPI App" intent, 12-digit UTR check) → hand-off to WhatsApp with all details prefilled. `/booking?service=kp` preselects a package. |
| **Reviews** `/reviews` | Review and private-feedback forms, sent by email through the backend. `/reviews?tab=feedback` opens the feedback form. |
| **Chat** `/chat` | Consultation assistant (floating mandala button): scripted intake that ends in a prefilled WhatsApp message. |

## Getting started

```bash
npm install
npx expo start          # then press a (Android), i (iOS) or w (web), or scan the QR with Expo Go
```

The app uses `@react-native-community/datetimepicker` and `react-native-svg`, both included in
Expo Go, so no custom development build is needed to try it.

### Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | `https://ishan-astrology-backend-j97a.vercel.app` | Backend that sends review/feedback emails (`/api/send-email`). |

Put overrides in a `.env` file (git-ignored).

## Building for the stores

Builds are made in the cloud with [EAS](https://docs.expo.dev/build/introduction/):

```bash
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform android   # .aab for Google Play
npx eas-cli@latest build --platform ios       # needs an Apple Developer account
```

Bundle identifier / package name: `com.ishanastrology.app` (change in `app.json` before the first
store upload if you want a different one).

**Before publishing:** replace the placeholder Expo icons in `assets/` (`icon.png`,
`android-icon-*.png`, `splash-icon.png`, `favicon.png`) with the Ishan Astrology artwork, and
replace the placeholder biography on the About screen (see the comment in
`src/app/(tabs)/about.jsx`).

## Web deployment (Vercel)

`vercel.json` builds the web version with `npx expo export --platform web` and serves `dist/`
as a single-page app, keeping the `/api/*` proxy to the backend.

## Project layout

```
src/
  app/                 Expo Router routes
    _layout.jsx        fonts, theme, root stack (tabs + chat modal)
    chat.jsx           consultation assistant
    (tabs)/            Services, About, Pricing, Book, Reviews
  components/          shared UI (typography, buttons, forms, SVG diagrams, ticker, footer…)
  config/              backend URL, email client, contact details
  data/                packages/prices, published reviews
  hooks/               useSectionScroll (in-page anchors)
  theme.js             colours and fonts carried over from the website
```

## Scripts

- `npm start` — Expo dev server
- `npm run android` / `npm run ios` / `npm run web`
- `npm run export:web` — static web build into `dist/`
- `npm run lint` — ESLint (`eslint-config-expo`)
