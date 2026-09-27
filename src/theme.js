/**
 * Design tokens carried over from the website's CSS custom properties, so the
 * app keeps the same midnight-blue, gold and teal palette.
 */
export const colors = {
  bgPrimary: '#0E2A47',
  bgSecondary: '#14365B',
  bgDeep: '#0A2038',
  surfaceCard: 'rgba(20, 54, 91, 0.55)',
  surfaceCardSubtle: 'rgba(20, 54, 91, 0.45)',
  textPrimary: '#E9E4D6',
  textMuted: 'rgba(233, 228, 214, 0.75)',
  textLight: '#FFFFFF',
  gold: '#C8A046',
  lightGold: '#E3CD9A',
  teal: '#1F6F6B',
  tealLight: '#2E9D98',
  borderGold: 'rgba(200, 160, 70, 0.25)',
  error: '#E58A7B',
  success: '#5BC0A0',
  whatsapp: '#25D366',
};

/**
 * Font family names as registered with expo-font in src/app/_layout.jsx.
 * Keep these keys in sync with the useFonts() map there.
 */
export const fonts = {
  serif: 'Lora_400Regular',
  serifMedium: 'Lora_500Medium',
  serifItalic: 'Lora_400Regular_Italic',
  heading: 'Cinzel_600SemiBold',
  headingRegular: 'Cinzel_400Regular',
  headingBold: 'Cinzel_700Bold',
  italic: 'CormorantGaramond_500Medium_Italic',
  italicRegular: 'CormorantGaramond_400Regular_Italic',
  display: 'CormorantGaramond_600SemiBold',
  sanskrit: 'TiroDevanagariSanskrit_400Regular',
};

export const spacing = {
  gutter: 20,
  section: 44,
};

export const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.3,
  shadowRadius: 18,
  elevation: 6,
};
