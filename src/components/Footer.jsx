import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '../theme';
import { openLink } from '../utils/openLink';
import { EMAIL, PHONES, SOCIAL, WHATSAPP_LINK } from '../config/contact';

const COLUMNS = [
  {
    title: 'Practice',
    links: [
      { label: 'About Ishan', href: '/about' },
      { label: 'Services', href: '/' },
      { label: 'Consultation Fees', href: '/pricing' },
      { label: 'Book a Reading', href: '/booking' },
      { label: 'Reviews & Feedback', href: '/reviews' },
    ],
  },
  {
    title: 'Systems',
    links: [
      { label: 'KP Astrology', href: '/?section=kp' },
      { label: 'BNN', href: '/?section=bnn' },
      { label: 'Numerology', href: '/?section=numerology' },
      { label: 'Horary', href: '/?section=horary' },
      { label: 'Yantra & Oils', href: '/?section=yantra' },
    ],
  },
  {
    title: 'Contact',
    links: [
      ...PHONES,
      { label: 'WhatsApp', href: WHATSAPP_LINK },
      { label: EMAIL, href: `mailto:${EMAIL}` },
    ],
  },
  { title: 'Social', links: SOCIAL },
];

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.brand}>Ishan Astrology</Text>
      <Text style={styles.tagline}>Precision astrology, since 2020</Text>
      <Text style={styles.desc}>
        KP-based consultations for marriage, career, health and major life decisions. Available
        worldwide.
      </Text>

      <View style={styles.grid}>
        {COLUMNS.map((col) => (
          <View style={styles.col} key={col.title}>
            <Text style={styles.colTitle}>{col.title}</Text>
            {col.links.map((l) => (
              <Pressable
                key={l.label}
                onPress={() => openLink(l.href)}
                accessibilityRole="link"
                hitSlop={4}
              >
                {({ pressed }) => (
                  <Text style={[styles.link, pressed && { color: colors.lightGold }]}>
                    {l.label}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.bottom}>
        <Text style={styles.blessing}>
          <Text style={styles.om}>ॐ</Text> BE BLESSED BY THE DIVINE
        </Text>
        <Text style={styles.copy}>
          © {new Date().getFullYear()} Ishan Astrology. All readings are for guidance purposes
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: colors.bgDeep,
    borderTopWidth: 1,
    borderTopColor: colors.borderGold,
    paddingHorizontal: spacing.gutter,
    paddingTop: 40,
    paddingBottom: 28,
    marginTop: 12,
  },
  brand: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 20, marginBottom: 6 },
  tagline: { fontFamily: fonts.italic, color: colors.gold, fontSize: 17, marginBottom: 8 },
  desc: {
    fontFamily: fonts.serif,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 24 },
  col: { width: '50%', paddingRight: 12, gap: 8 },
  colTitle: {
    fontFamily: fonts.heading,
    color: colors.gold,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  link: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  bottom: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderGold,
    marginTop: 30,
    paddingTop: 20,
    alignItems: 'center',
    gap: 8,
  },
  blessing: {
    fontFamily: fonts.heading,
    color: colors.lightGold,
    fontSize: 12,
    letterSpacing: 2.5,
  },
  om: { fontFamily: fonts.sanskrit, color: colors.gold, fontSize: 16 },
  copy: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 12, textAlign: 'center' },
});
