import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Screen from '../../components/Screen';
import Hero from '../../components/Hero';
import SystemsTicker from '../../components/Ticker';
import ReviewsSection from '../../components/ReviewsSection';
import {
  BnnArc,
  HoraryWheel,
  KpChart,
  LoShuGrid,
  YantraStar,
} from '../../components/Illustrations';
import {
  Button,
  Card,
  Em,
  FeatureList,
  H1,
  H2,
  H3,
  P,
  SanskritSub,
  Section,
  SectionIntro,
  SectionLabel,
  SystemTag,
} from '../../components/ui';
import { useSectionScroll } from '../../hooks/useSectionScroll';
import { colors, fonts } from '../../theme';

const trustBadge =
  'Precision KP & BNN Astrology since 2020 · 1,000+ Verified Consultations Delivered';

const SYSTEMS = [
  {
    id: 'kp',
    tag: 'Flagship System · I',
    tone: 'gold',
    title: 'KP Astrology —',
    em: 'precision down to the sub lord.',
    sanskrit: 'कृष्णमूर्ति पद्धति',
    numeral: 'I',
    Art: KpChart,
    paragraphs: [
      "Krishnamurti Paddhati is the practice's flagship timing system. It uses sub-lord theory and the Placidus house division to deliver sharper event timing than sign-based predictions allow.",
      'Every KP reading begins from one principle: a planet\'s promise is judged by the sub lord of the cusp it occupies. From there, ruling planets, dasha periods and transit windows are tested in sequence — narrowing a vague "soon" to a specific date range.',
      'This is the primary system used for marriage timing, career change, litigation windows, foreign settlement, and any question where when matters as much as whether.',
    ],
    features: [
      'Marriage & relationship timing',
      'Career & job change windows',
      'Foreign settlement & visa',
      'Litigation & legal matters',
      'Property & vehicle purchase',
      'Health & longevity periods',
    ],
  },
  {
    id: 'bnn',
    tag: 'System · II',
    tone: 'teal',
    title: 'BNN —',
    em: 'verification before prediction.',
    sanskrit: 'भृगु नाडी',
    numeral: 'II',
    Art: BnnArc,
    alt: true,
    paragraphs: [
      "Bhrigu Nadi reading is the practice's verification layer. A chart's accuracy is established by reading verifiable past events — only then is the chart trusted for future prediction.",
      "The technique relies on planetary conjunctions, aspects and Jupiter's transit to read past life events directly from the natal chart — without relying on the client's input. If a BNN cold reading of past events lands accurately, the chart and birth time are confirmed before any forward-looking reading is offered.",
      "This is also used as a second-opinion layer — checking whether a KP timing window agrees with the chart's BNN signal before a final reading is shared.",
    ],
    features: [
      'Birth-time rectification',
      'Past-event verification',
      'Independent cross-check',
      'Family chart patterns',
    ],
  },
  {
    id: 'numerology',
    tag: 'System · III',
    tone: 'teal',
    title: 'Numerology —',
    em: 'names, dates, decisions.',
    sanskrit: 'अंक शास्त्र',
    numeral: 'III',
    Art: LoShuGrid,
    paragraphs: [
      'Number-based analysis of name and birth date forms the third independent layer. Used most often for child naming, choosing a business name, picking a wedding date, or deciding when to begin something significant.',
      "Numerology is rarely the only input. It typically arrives after the KP reading — as a clean, independent check on naming and timing decisions, ensuring the numerical signature of a name or date harmonises with the natal chart's recommendations.",
    ],
    features: [
      'Child naming',
      'Business name selection',
      'Wedding date selection',
      'Lucky number analysis',
      'Name correction (numerology)',
      'Vehicle number selection',
    ],
  },
  {
    id: 'horary',
    tag: 'KP Horary · IV',
    tone: 'gold',
    title: 'Horary —',
    em: 'a chart cast on the question itself.',
    sanskrit: 'प्रश्न कुण्डली',
    numeral: 'IV',
    Art: HoraryWheel,
    alt: true,
    paragraphs: [
      "When a birth chart isn't available — or when a question is sharp and time-bound — KP horary casts a chart on the moment of the question itself. A number between 1 and 249 is drawn, and the chart that number describes is read with full KP rigor.",
      'Horary is the practice\'s preferred method for tight, transactional questions: "Should I buy this property this month?", "Will this deal close?", "Where is the missing item?" — questions where a clean yes/no/when is more valuable than a life-wide reading.',
    ],
    features: [
      'Yes/no business questions',
      'Deal closure timing',
      'Lost objects & missing persons',
      'Single-question consultations',
    ],
  },
  {
    id: 'yantra',
    tag: 'Specialty · V',
    tone: 'teal',
    title: 'Yantra & Magic Oils —',
    em: 'sacred tools for energetic support.',
    sanskrit: 'यंत्र एवं तेल विधि',
    numeral: 'V',
    Art: YantraStar,
    paragraphs: [
      "Certified training in yantra activation and ritual oil preparation adds a practical, energetic layer alongside chart readings — recommended when a client's situation calls for tangible support in addition to timing guidance.",
      'Yantras are geometric diagrams, hand-prepared and consecrated to focus intention toward a specific outcome — wealth, protection, relationships. Ritual oils, blended in the same tradition, are used for anointing and everyday practice.',
      "Each item is prescribed only after the underlying chart or numerology signature is read, so what's recommended matches what the chart actually indicates — not a generic remedy.",
    ],
    features: [
      'Personalized yantra prescription',
      'Hand-prepared ritual oils',
      'Protection & prosperity yantras',
      'Relationship harmony oils',
      'Remedies paired with chart timing',
      'Consecration guidance',
    ],
  },
];

const PROCESS = [
  {
    num: '01',
    title: 'Birth details shared',
    body: "Full birth date, exact time, and place of birth. Plus the specific question you'd like answered.",
  },
  {
    num: '02',
    title: 'Chart prepared & verified',
    body: 'The chart is cast and — where birth time is uncertain — verified using BNN before any prediction.',
  },
  {
    num: '03',
    title: 'KP analysis & cross-check',
    body: 'Sub-lords, significators and dasha timing are read. Findings are checked against BNN or Numerology where useful.',
  },
  {
    num: '04',
    title: 'Consultation & written report',
    body: 'The reading is delivered by WhatsApp, phone or video call — followed by a structured written report.',
  },
];

const CASES = [
  { title: 'Marriage Timing', body: 'KP analysis isolated a single nakshatra activating the 7th house, narrowing the marriage window to a specific high-priority date range rather than a vague "soon."' },
  { title: 'Business Decision Horary', body: 'A horary chart for a business purchase identified a tight 2-day window as most favorable for the transaction, ahead of a major commitment.' },
  { title: 'Career & Wealth', body: 'A full natal analysis mapped house strength and dasha timing for wealth and health, giving a clear sequence of favorable and cautious periods ahead.' },
  { title: 'Travel Timing', body: 'House strength and transit analysis pinpointed a favorable window for a planned overseas trip, avoiding a period flagged for delays.' },
  { title: 'Visa & PR', body: 'KP significators for foreign settlement houses were checked against dasha timing to identify the most likely period for visa approval.' },
  { title: 'Medical Astrology', body: '6th and 8th house significators combined with current dasha were read to flag a health period needing caution, alongside a recovery window.' },
  { title: 'Child Birth', body: "5th house promise and timing analysis were used to identify a favorable period for conception, sequenced against the couple's running dashas." },
  { title: 'Education', body: '4th and 9th house strength guided the choice between two academic paths, with dasha timing showing which year favored a clean start.' },
  { title: 'Property', body: '4th house and Mars/Saturn significators were analyzed to time a property purchase around a period of stable, supportive dasha.' },
  { title: 'Longevity', body: '8th house and marakasthana analysis for an elder family member identified vulnerable periods, helping the family plan care and precautions in advance.' },
  { title: 'Vehicle Purchase', body: '4th house and significator timing identified a favorable window for buying a vehicle, avoiding a period flagged for loss or expense.' },
  { title: 'Missing Objects', body: 'Horary analysis of significator houses and ruling planets was used to indicate the likely direction and timeframe for recovery.' },
];

function SystemSection({ system, onLayout }) {
  const { width } = useWindowDimensions();
  const artSize = Math.min(width - 80, 320);
  const { Art } = system;

  return (
    <Section alt={system.alt} onLayout={onLayout}>
      <SystemTag tone={system.tone}>{system.tag}</SystemTag>
      <H2>
        {system.title}
        {'\n'}
        <Em>{system.em}</Em>
      </H2>
      <SanskritSub>{system.sanskrit}</SanskritSub>
      {system.paragraphs.map((p) => (
        <P key={p.slice(0, 24)}>{p}</P>
      ))}
      <FeatureList items={system.features} />

      <View style={styles.artFrame}>
        <Text style={styles.artNumeral}>{system.numeral}</Text>
        <Art size={artSize} />
      </View>
    </Section>
  );
}

export default function ServicesScreen() {
  const { scrollRef, register } = useSectionScroll();

  return (
    <Screen scrollRef={scrollRef}>
      <Hero>
        <SectionLabel sanskrit="सेवाएँ">Services</SectionLabel>
        <H1>
          Three systems.{'\n'}
          <Em>One disciplined practice.</Em>
        </H1>
        <P muted>
          KP for timing. BNN for verification. Numerology for naming and decision support. Each
          system independent — used together only when the chart calls for it.
        </P>

        <View style={styles.trustBadge}>
          <Text style={styles.trustText}>
            <Text style={{ color: colors.gold }}>✦ </Text>
            {trustBadge}
          </Text>
        </View>

        <View style={styles.heroActions}>
          <Button title="Book a Consultation" icon="→" href="/booking" />
          <Button title="Quick Horary (₹1,500)" icon="⚡" href="/pricing?section=horary" variant="secondary" />
        </View>
      </Hero>

      <SystemsTicker />

      {SYSTEMS.map((s) => (
        <SystemSection key={s.id} system={s} onLayout={register(s.id)} />
      ))}

      <Section onLayout={register('process')}>
        <SectionIntro
          label="How a Consultation Works"
          sanskrit="प्रक्रिया"
          title="From question to written report."
        />
        <View style={styles.stack}>
          {PROCESS.map((step) => (
            <Card key={step.num}>
              <Text style={styles.processNum}>{step.num}</Text>
              <H3>{step.title}</H3>
              <P muted style={{ marginBottom: 0 }}>{step.body}</P>
            </Card>
          ))}
        </View>
      </Section>

      <Section alt onLayout={register('cases')}>
        <SectionIntro
          label="From Recent Consultations"
          sanskrit="अनुभव"
          title="What the chart actually predicted."
        >
          Twelve anonymised case threads — each showing how chart mechanics translated into a
          specific timing or decision.
        </SectionIntro>
        <View style={styles.stack}>
          {CASES.map((c) => (
            <Card key={c.title}>
              <Text style={styles.caseStar}>✦</Text>
              <H3>{c.title}</H3>
              <P muted style={{ marginBottom: 0 }}>{c.body}</P>
            </Card>
          ))}
        </View>
      </Section>

      <ReviewsSection onLayout={register('reviews')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  trustBadge: {
    borderWidth: 1,
    borderColor: colors.borderGold,
    backgroundColor: 'rgba(200,160,70,0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 4,
  },
  trustText: { fontFamily: fonts.serif, color: colors.lightGold, fontSize: 13.5, lineHeight: 20 },
  heroActions: { gap: 12, marginTop: 24 },
  artFrame: {
    marginTop: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 16,
    backgroundColor: 'rgba(10, 32, 56, 0.45)',
  },
  artNumeral: {
    position: 'absolute',
    top: 8,
    right: 14,
    fontFamily: fonts.display,
    color: 'rgba(200,160,70,0.35)',
    fontSize: 30,
  },
  stack: { gap: 14 },
  processNum: { fontFamily: fonts.display, color: colors.gold, fontSize: 34, marginBottom: 4 },
  caseStar: { color: colors.gold, fontSize: 16, marginBottom: 8 },
});
