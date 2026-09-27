import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Screen from '../../components/Screen';
import Hero from '../../components/Hero';
import ReviewsSection from '../../components/ReviewsSection';
import {
  Button,
  Card,
  Em,
  FeatureList,
  H1,
  H2,
  H3,
  P,
  Section,
  SectionIntro,
  SectionLabel,
} from '../../components/ui';
import { PACKAGES } from '../../data/services';
import { useSectionScroll } from '../../hooks/useSectionScroll';
import { colors, fonts } from '../../theme';

const FAQS = [
  {
    q: "What if I don't know my exact birth time?",
    a: 'If your birth time is off by a few minutes or hours, we perform birth-time rectification using past events from your life via Bhrigu Nadi (BNN) before starting the timing analysis. If the birth time is completely unknown, we recommend a Horary consultation.',
  },
  {
    q: 'How do international clients pay and book?',
    a: 'We welcome clients worldwide (USA, UK, Canada, UAE, Australia, Europe). International payments are accepted seamlessly via Wise, PayPal, Stripe, or International Credit/Debit Cards in USD, EUR, GBP, or AED. Simply select your currency during WhatsApp booking.',
  },
  {
    q: 'What time zones do you accommodate for live sessions?',
    a: 'Live consultations over Zoom or Phone are scheduled flexibly across IST (India), EST/PST (North America), GMT (UK/Europe), and GST (Dubai/Gulf) time zones.',
  },
  {
    q: 'How do we connect for the consultation?',
    a: 'Full consultations are held over Zoom, Google Meet, or phone call. Once you book, we will coordinate a mutual time via WhatsApp. Written reports are sent as high-quality PDF files via email and WhatsApp.',
  },
  {
    q: 'Can I ask multiple questions in Horary?',
    a: 'Horary is strictly designed for a single, focused, time-bound question (e.g., "Will I clear this exam next month?"). For multiple questions or general life timing, we recommend the Full KP Consultation package.',
  },
];

function PackageCard({ pkg }) {
  const highlighted = Boolean(pkg.badge) || pkg.featured;
  return (
    <Card style={[styles.card, pkg.badge && styles.easyStep, pkg.featured && styles.featured]}>
      {pkg.badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{pkg.badge}</Text>
        </View>
      ) : null}
      <H3 style={styles.title}>{pkg.title}</H3>
      <Text style={styles.price}>
        {pkg.priceLabel} <Text style={styles.unit}>/ {pkg.unit}</Text>
      </Text>
      <View style={styles.divider} />
      <FeatureList items={pkg.features} />
      <Button
        title={pkg.cta}
        href={`/booking?service=${pkg.slug}`}
        variant={highlighted ? 'primary' : 'secondary'}
        style={{ marginTop: 22 }}
      />
    </Card>
  );
}

export default function PricingScreen() {
  const { scrollRef, register } = useSectionScroll();

  return (
    <Screen scrollRef={scrollRef}>
      <Hero compact>
        <SectionLabel sanskrit="शुल्क">Pricing</SectionLabel>
        <H1>
          Consultation{'\n'}
          <Em>Packages &amp; Fees</Em>
        </H1>
        <P muted>
          Transparent pricing for structured readings. Select a consultation system below that fits
          your question, or ask on WhatsApp for a custom package recommendation.
        </P>
      </Hero>

      {/* Cards are direct children of the scroll content so ?section=<slug> can find them. */}
      {PACKAGES.map((pkg) => (
        <View key={pkg.slug} style={styles.cardWrap} onLayout={register(pkg.slug)}>
          <PackageCard pkg={pkg} />
        </View>
      ))}

      <Section alt style={{ marginTop: 28 }}>
        <SectionIntro label="Frequently Asked" sanskrit="प्रश्नोत्तरी" title="Common Queries" />
        {FAQS.map((item) => (
          <View key={item.q} style={styles.faq}>
            <H3>{item.q}</H3>
            <P muted style={{ fontSize: 15 }}>{item.a}</P>
          </View>
        ))}
      </Section>

      {/* Published reviews, if any — the screen closes with its own CTA */}
      <ReviewsSection ctaWhenEmpty={false} />

      <Section>
        <Card style={styles.cta}>
          <H2 center>Ready to seek guidance?</H2>
          <P center muted>Reach out to us on WhatsApp to clarify details or schedule a call.</P>
          <View style={styles.ctaButtons}>
            <Button title="Book Consultation" href="/booking" />
            <Button title="Back to Services" href="/" variant="secondary" />
          </View>
        </Card>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardWrap: { paddingHorizontal: 20, marginTop: 16 },
  card: { paddingTop: 24 },
  easyStep: { borderColor: colors.tealLight, backgroundColor: 'rgba(31, 111, 107, 0.18)' },
  featured: { borderColor: colors.gold, borderWidth: 1.5 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.teal,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 14,
  },
  badgeText: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 10, letterSpacing: 1 },
  title: { fontSize: 20 },
  price: { fontFamily: fonts.display, color: colors.lightGold, fontSize: 36, marginTop: 2 },
  unit: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 14 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.borderGold, marginVertical: 16 },
  faq: { marginBottom: 18 },
  cta: { alignItems: 'center', paddingVertical: 30 },
  ctaButtons: { alignSelf: 'stretch', gap: 12, marginTop: 8 },
});
