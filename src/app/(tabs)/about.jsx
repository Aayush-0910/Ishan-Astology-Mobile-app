import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Screen from '../../components/Screen';
import Hero from '../../components/Hero';
import ReviewsSection from '../../components/ReviewsSection';
import {
  Button,
  Card,
  Em,
  H1,
  H2,
  H3,
  LineAccent,
  P,
  Section,
  SectionIntro,
  SectionLabel,
} from '../../components/ui';
import { openLink } from '../../utils/openLink';
import { colors, fonts } from '../../theme';

/* ---------------------------------------------------------------------------
 * ⚠️  PLACEHOLDER COPY
 *
 * The sections marked below with `PLACEHOLDER` describe Ishan ji's background
 * in general terms because his actual history was not available when this page
 * was written. Everything else on this page restates claims the app already
 * makes elsewhere (practising since 2020, 1,000+ consultations, the four
 * systems, worldwide clients, Zoom/phone delivery, written PDF reports).
 *
 * Replace the placeholder paragraphs with his real story before publishing —
 * an invented biography on a paid-services page is both misleading to clients
 * and easy to contradict in conversation.
 * ------------------------------------------------------------------------- */

const beginning = {
  label: 'Our Story',
  sanskrit: 'आरम्भ',
  title: 'Prediction should be specific, or it is not prediction.',
  // PLACEHOLDER — replace with how Ishan ji actually came to this practice.
  paragraphs: [
    'Most people who come to astrology have already been told something vague. That things will improve. That a difficult period is passing. That marriage is coming soon. None of it is wrong, and none of it is usable.',
    'Ishan Astrology was built around the opposite instinct: that a chart, read properly, gives a date range rather than a mood. That a reading should tell you which month to act in, which period to be careful through, and what the chart cannot tell you at all.',
  ],
};

const mission = {
  label: 'Our Approach',
  sanskrit: 'पद्धति',
  quote: 'Verify the chart before trusting the prediction.',
  paragraphs: [
    'Every reading begins with the birth chart being checked, not assumed. Where a birth time is uncertain — and it usually is — it is rectified against events that have already happened in your life, using Bhrigu Nadi, before a single prediction is made.',
    'Only then does KP analysis begin: sub-lords, significators and dasha timing, cross-checked against BNN or Numerology where a second reading adds confidence. It is slower than reading a chart at face value. It is also the reason the timing holds.',
  ],
};

const principles = [
  {
    title: 'Timing, not reassurance',
    body: 'Readings resolve to specific windows — which month, which period — rather than a general sense that things will get better.',
  },
  {
    title: 'The chart is verified first',
    body: 'Birth-time rectification through BNN comes before any prediction, so the timing rests on a chart that has been tested against your life.',
  },
  {
    title: 'Cross-checked systems',
    body: 'KP, Bhrigu Nadi and Numerology are used together. Where two systems disagree, you are told so rather than given the more comfortable answer.',
  },
  {
    title: 'Written down, not just spoken',
    body: 'Every consultation is followed by a structured PDF report, so the reasoning and the dates remain with you long after the call ends.',
  },
];

const positioning = {
  label: 'Plainly Said',
  sanskrit: 'स्पष्ट वचन',
  is: [
    'A timing and decision-support practice grounded in KP and Bhrigu Nadi',
    'Honest about which periods look difficult, not only the favourable ones',
    'Clear about the limits of what a chart can indicate',
  ],
  isNot: [
    'Not a promise that any outcome can be guaranteed',
    'Not a substitute for medical, legal or financial advice',
    'Not a practice that will tell you only what you hoped to hear',
  ],
};

function GlyphPanel({ glyph, sanskrit = false, children }) {
  return (
    <View style={styles.panel} accessible={false}>
      <Text style={[styles.panelGlyph, sanskrit && { fontFamily: fonts.sanskrit }]}>{glyph}</Text>
      <Text style={styles.panelCaption}>{children}</Text>
    </View>
  );
}

function PositionCol({ title, items, positive }) {
  return (
    <Card style={[styles.posCol, !positive && styles.posColNot]}>
      <H3>{title}</H3>
      {items.map((item) => (
        <View style={styles.posRow} key={item}>
          <Text style={[styles.posMark, { color: positive ? colors.tealLight : colors.error }]}>
            {positive ? '✓' : '✕'}
          </Text>
          <Text style={styles.posText}>{item}</Text>
        </View>
      ))}
    </Card>
  );
}

export default function AboutScreen() {
  return (
    <Screen>
      <Hero compact>
        <SectionLabel sanskrit="ईशान">The Divine Name</SectionLabel>
        <H1>
          Ishan —{'\n'}
          <Em>Wisdom, Power &amp; Light</Em>
        </H1>
        <Text style={styles.heroQuote}>
          “Ishan — The Supreme Lord, the Divine Guide, the Light that Leads to Truth and
          Enlightenment.”
        </Text>
      </Hero>

      <Section>
        <LineAccent center={false} />
        <SectionLabel sanskrit={beginning.sanskrit}>{beginning.label}</SectionLabel>
        <H2>{beginning.title}</H2>
        {beginning.paragraphs.map((p) => (
          <P key={p.slice(0, 24)}>{p}</P>
        ))}
        <GlyphPanel glyph="ॐ" sanskrit>
          KP Astrology · Bhrigu Nadi{'\n'}Numerology · Horary
        </GlyphPanel>
      </Section>

      <Section alt>
        <LineAccent center={false} />
        <SectionLabel sanskrit={mission.sanskrit}>{mission.label}</SectionLabel>
        <Text style={styles.pullquote}>{mission.quote}</Text>
        {mission.paragraphs.map((p) => (
          <P key={p.slice(0, 24)}>{p}</P>
        ))}
        <Pressable onPress={() => openLink('/?section=process')} accessibilityRole="link">
          <Text style={styles.inlineLink}>See how a consultation works →</Text>
        </Pressable>
        <GlyphPanel glyph="✦">Verify the chart.{'\n'}Then read the timing.</GlyphPanel>
      </Section>

      <Section>
        <SectionIntro label="What Guides the Work" sanskrit="सिद्धान्त" title="Four things that do not change." />
        <View style={{ gap: 14 }}>
          {principles.map((p) => (
            <Card key={p.title}>
              <Text style={styles.principleIco}>✦</Text>
              <H3>{p.title}</H3>
              <P muted style={{ marginBottom: 0 }}>{p.body}</P>
            </Card>
          ))}
        </View>
      </Section>

      <Section alt>
        <SectionIntro
          label={positioning.label}
          sanskrit={positioning.sanskrit}
          title="What this practice is — and is not."
        />
        <View style={{ gap: 14 }}>
          <PositionCol title="What it is" items={positioning.is} positive />
          <PositionCol title="What it is not" items={positioning.isNot} />
        </View>
      </Section>

      {/* Published reviews, if any. The screen already closes with its own CTA,
          so the empty-state invitation is suppressed here. */}
      <ReviewsSection ctaWhenEmpty={false} />

      <Section>
        <Card style={styles.cta}>
          <LineAccent />
          <H2 center>Have a question worth timing?</H2>
          <P center muted>
            Bring one specific question, or your full chart for a complete reading. Either way, you
            will leave with dates rather than impressions.
          </P>
          <View style={styles.ctaButtons}>
            <Button title="Book a Consultation" href="/booking" />
            <Button title="See Consultation Fees" href="/pricing" variant="secondary" />
          </View>
        </Card>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroQuote: {
    fontFamily: fonts.italic,
    color: colors.lightGold,
    fontSize: 21,
    lineHeight: 30,
    borderLeftWidth: 2,
    borderLeftColor: colors.gold,
    paddingLeft: 14,
  },
  panel: {
    marginTop: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 16,
    paddingVertical: 28,
    backgroundColor: 'rgba(10, 32, 56, 0.45)',
  },
  panelGlyph: { color: colors.gold, fontSize: 64, lineHeight: 84, opacity: 0.85 },
  panelCaption: {
    fontFamily: fonts.italic,
    color: colors.lightGold,
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 8,
  },
  pullquote: {
    fontFamily: fonts.italic,
    color: colors.textLight,
    fontSize: 26,
    lineHeight: 34,
    marginBottom: 16,
  },
  inlineLink: {
    fontFamily: fonts.heading,
    color: colors.gold,
    fontSize: 13.5,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  principleIco: { color: colors.gold, fontSize: 18, marginBottom: 8 },
  posCol: { gap: 10 },
  posColNot: { borderColor: 'rgba(229, 138, 123, 0.3)' },
  posRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  posMark: { fontSize: 15, lineHeight: 22, width: 16 },
  posText: { flex: 1, fontFamily: fonts.serif, color: colors.textPrimary, fontSize: 15, lineHeight: 22 },
  cta: { alignItems: 'center', paddingVertical: 30 },
  ctaButtons: { alignSelf: 'stretch', gap: 12, marginTop: 8 },
});
