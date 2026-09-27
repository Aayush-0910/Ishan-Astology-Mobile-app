import React, { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import Svg, { Path, Text as SvgText, TSpan } from 'react-native-svg';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Screen from '../../components/Screen';
import DateTimeField from '../../components/DateTimeField';
import { Choice, ErrorBanner, Field, Input } from '../../components/Form';
import {
  Button,
  Card,
  H2,
  H3,
  P,
  SanskritSub,
  Section,
  SystemTag,
} from '../../components/ui';
import { BOOKING_ORDER, formatINR, packageBySlug } from '../../data/services';
import { UPI_ID, UPI_PAYEE_NAME, whatsappLinkWithText } from '../../config/contact';
import { openLink } from '../../utils/openLink';
import { colors, fonts } from '../../theme';

const SERVICE_OPTIONS = BOOKING_ORDER.map((slug) => {
  const p = packageBySlug(slug);
  return { value: slug, label: p.shortTitle, detail: p.priceLabel };
});

// Brand marks shown above the QR so people recognise which apps will work.
const UPI_APPS = [
  {
    name: 'Google Pay',
    bg: '#ffffff',
    logo: (
      <Svg viewBox="0 0 48 48" width={22} height={22}>
        <Path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.6 2.4 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.2 17.7 9.5 24 9.5z" />
        <Path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9.1h12.4c-.5 2.9-2.1 5.3-4.6 7l7.1 5.5c4.2-3.9 6.6-9.6 6.6-16.4z" />
        <Path fill="#FBBC05" d="M10.5 28.3c-.5-1.4-.8-2.9-.8-4.5s.3-3.1.8-4.5l-7.9-6.1C.9 16.5 0 20.1 0 23.8s.9 7.3 2.6 10.6l7.9-6.1z" />
        <Path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.3-4.5 2.1-8.8 2.1-6.3 0-11.6-3.7-13.5-8.9l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
      </Svg>
    ),
  },
  {
    name: 'PhonePe',
    bg: '#5f259f',
    logo: (
      <Svg viewBox="0 0 24 24" width={20} height={20} fill="#ffffff">
        <Path d="M22.19 8.29c0-.41-.39-.66-.77-.66h-1.94l-4.4-5.08c-.4-.47-1.03-.66-1.63-.5l-1.55.46c-.24.08-.33.37-.14.54l4.77 4.09H7.1c-.39 0-.6.21-.6.6v.92c0 .41.39.66.77.66h1.19v4.09c0 3.07 1.62 4.86 4.35 4.86.85 0 1.58-.1 2.43-.44v2.84c0 .78.63 1.41 1.4 1.41h1.33c.24 0 .46-.21.46-.46V11.36h2.01c.39 0 .6-.21.6-.6zm-6.02 6.11c-.52.25-1.19.35-1.72.35-1.32 0-2-.66-2-2.16V9.62h3.72z" />
      </Svg>
    ),
  },
  {
    name: 'Paytm',
    bg: '#ffffff',
    logo: (
      <Svg viewBox="0 0 64 22" width={34} height={14}>
        <SvgText x="0" y="17" fontWeight="700" fontSize="17">
          <TSpan fill="#20336B">pay</TSpan>
          <TSpan fill="#00BAF2">tm</TSpan>
        </SvgText>
      </Svg>
    ),
  },
  {
    name: 'CRED',
    bg: '#0a0a0a',
    logo: (
      <Svg viewBox="0 0 64 20" width={34} height={12}>
        <SvgText x="32" y="15" textAnchor="middle" fontWeight="700" fontSize="14" letterSpacing="2" fill="#ffffff">
          CRED
        </SvgText>
      </Svg>
    ),
  },
  {
    name: 'WhatsApp',
    bg: '#25D366',
    logo: (
      <Svg viewBox="0 0 24 24" width={20} height={20} fill="#ffffff">
        <Path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
      </Svg>
    ),
  },
];

const QR_SECONDS = 600;

const makeRef = () =>
  'IAP' + Date.now().toString(36).toUpperCase().slice(-6) + Math.floor(10 + Math.random() * 89);

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

export default function BookingScreen() {
  const { service } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const requested = service && packageBySlug(String(service)) ? String(service) : '';

  // Step 1 — consultation details
  const [clientName, setClientName] = useState('');
  const [serviceSlug, setServiceSlug] = useState(requested);
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('');
  const [questions, setQuestions] = useState('');

  // Flow
  const [phase, setPhase] = useState('details'); // 'details' | 'checkout'
  const [modalActive, setModalActive] = useState(false);
  const [payStage, setPayStage] = useState('entry'); // 'entry' | 'success'
  const [paymentRef, setPaymentRef] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(QR_SECONDS);
  const [copied, setCopied] = useState(false);

  // Payment proof — the confirm button unlocks only once a valid UPI transaction
  // reference (UTR) is entered, which only exists after a real payment goes through.
  const [utr, setUtr] = useState('');
  const [utrTouched, setUtrTouched] = useState(false);

  // Deep links such as /booking?service=kp preselect the consultation. The tab
  // stays mounted, so a later link with a different service updates it here.
  const [lastRequested, setLastRequested] = useState(requested);
  if (requested !== lastRequested) {
    setLastRequested(requested);
    if (requested) {
      setServiceSlug(requested);
      setPhase('details');
    }
  }

  // UPI countdown while its QR screen is open
  useEffect(() => {
    if (!modalActive || payStage !== 'entry') return undefined;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [modalActive, payStage]);

  const selected = packageBySlug(serviceSlug) || packageBySlug('horary');
  const total = selected.price;

  const upiUri =
    `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_PAYEE_NAME)}` +
    `&am=${total}&tn=${encodeURIComponent(selected.checkoutLabel)}&cu=INR`;

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  // A UPI reference is always 12 digits. Anything else means no payment was made.
  const isUtrValid = /^\d{12}$/.test(utr);
  const canConfirmPayment = isUtrValid && secondsLeft > 0;

  const isDetailsComplete = Boolean(
    clientName.trim() &&
      serviceSlug &&
      DATE_RE.test(dob) &&
      TIME_RE.test(tob) &&
      pob.trim() &&
      questions.trim()
  );

  const closeModal = () => {
    setModalActive(false);
    setPayStage('entry');
    setUtr('');
    setUtrTouched(false);
    setCopied(false);
  };

  const handleReviewOrder = () => {
    setSecondsLeft(QR_SECONDS);
    setPayStage('entry');
    setModalActive(true);
  };

  const copyUpiId = async () => {
    await Clipboard.setStringAsync(UPI_ID);
    setCopied(true);
  };

  const finalizeSuccess = () => {
    setPaymentRef(makeRef());
    setPayStage('success');
  };

  const sendDetailsOnWhatsApp = () => {
    const message =
      `Namaste Ishan Astrology,\n\nI have completed payment for a consultation. Details:\n` +
      `• Name: ${clientName}\n` +
      `• Service: ${selected.checkoutLabel}\n` +
      `• Date of Birth: ${dob}\n` +
      `• Time of Birth: ${tob}\n` +
      `• Place of Birth: ${pob}\n` +
      `• Questions/Core Concern: ${questions}\n` +
      `• Amount Paid: ${formatINR(total)}\n` +
      `• Payment Method: UPI — ${UPI_ID}\n` +
      `• UPI Transaction ID (UTR): ${utr}\n` +
      `• Booking Reference: ${paymentRef}`;
    openLink(whatsappLinkWithText(message));
    closeModal();
  };

  return (
    <Screen keyboard footer={false}>
      <Section style={{ paddingTop: 28 }}>
        {phase === 'details' ? (
          <>
            <SystemTag>Book a Reading</SystemTag>
            <H2>Schedule Your Consultation</H2>
            <SanskritSub>परामर्श सेवा</SanskritSub>
            <P muted>Please enter your details below. All information is kept strictly confidential.</P>

            <Card style={{ marginTop: 8 }}>
              <Field label="Full Name">
                <Input
                  placeholder="Enter your full name"
                  value={clientName}
                  onChangeText={setClientName}
                  autoComplete="name"
                  textContentType="name"
                />
              </Field>

              <Field label="Consultation Type">
                <Choice
                  options={SERVICE_OPTIONS}
                  value={serviceSlug}
                  onChange={setServiceSlug}
                  accessibilityLabel="Consultation type"
                />
              </Field>

              <Field label="Date of Birth">
                <DateTimeField mode="date" value={dob} onChange={setDob} placeholder="Select date of birth" />
              </Field>

              <Field label="Time of Birth" hint="As exact as possible — it drives the KP sub-lord timing.">
                <DateTimeField mode="time" value={tob} onChange={setTob} placeholder="Select time of birth" />
              </Field>

              <Field label="Place of Birth">
                <Input placeholder="City, State, Country" value={pob} onChangeText={setPob} />
              </Field>

              <Field label="Your Core Concern / Questions">
                <Input
                  placeholder="Briefly describe your career, relationship, health, or personal questions..."
                  value={questions}
                  onChangeText={setQuestions}
                  multiline
                  numberOfLines={4}
                />
              </Field>

              <Button
                title="Continue to Checkout"
                icon="→"
                onPress={() => setPhase('checkout')}
                disabled={!isDetailsComplete}
                accessibilityLabel={
                  isDetailsComplete ? 'Continue to checkout' : 'Fill in every field above to continue'
                }
              />
              <Text style={styles.note}>
                Your birth details stay private and are shared only with Ishan Astrology to prepare
                your reading.
              </Text>
            </Card>
          </>
        ) : (
          <>
            <Pressable onPress={() => setPhase('details')} accessibilityRole="button" hitSlop={8}>
              <Text style={styles.back}>‹ Back</Text>
            </Pressable>
            <H2>Checkout</H2>

            <Card style={styles.block}>
              <View style={styles.cardHead}>
                <H3 style={{ marginBottom: 0 }}>Seeker Information</H3>
                <Pressable onPress={() => setPhase('details')} accessibilityRole="button" hitSlop={8}>
                  <Text style={styles.link}>Edit</Text>
                </Pressable>
              </View>
              <Text style={styles.billingName}>{clientName}</Text>
              <Text style={styles.billingLine}>Born {dob} at {tob}</Text>
              <Text style={styles.billingLine}>{pob}</Text>
              <Text style={styles.billingLine}>{selected.checkoutLabel}</Text>
            </Card>

            <Card style={styles.block}>
              <H3>Order Summary</H3>
              <View style={styles.osRow}>
                <Text style={styles.osText}>{selected.checkoutLabel}</Text>
                <Text style={styles.osText}>{formatINR(total)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.osRow}>
                <Text style={styles.osTotal}>Total (INR)</Text>
                <Text style={styles.osTotal}>{formatINR(total)}</Text>
              </View>
              <Text style={styles.trusted}>🛡 Secure Checkout · UPI</Text>
            </Card>

            <Card style={styles.block}>
              <H3>🔒 Secure Payment</H3>
              <P muted style={{ fontSize: 14.5 }}>
                Pay by UPI with any payment app to complete your purchase.
              </P>
              <Button title="Review Order & Pay" onPress={handleReviewOrder} />
            </Card>
          </>
        )}
      </Section>

      <Modal
        visible={modalActive}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.backdrop}>
          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <Pressable
              onPress={closeModal}
              style={styles.close}
              accessibilityRole="button"
              accessibilityLabel="Close payment"
              hitSlop={10}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>

            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              {payStage === 'success' ? (
                <View style={styles.center}>
                  <View style={styles.check}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                  <Text style={styles.modalTitle}>Payment Successful</Text>
                  <Text style={styles.modalSub}>
                    {formatINR(total)} received · Ref {paymentRef}
                  </Text>
                  <Button
                    title="Send My Details on WhatsApp"
                    icon="→"
                    onPress={sendDetailsOnWhatsApp}
                    style={{ alignSelf: 'stretch' }}
                  />
                  <Text style={styles.note}>
                    Share your birth details and payment reference with Ishan Astrology on WhatsApp
                    to schedule your reading. International client? Wise / PayPal / Card link is
                    provided directly on WhatsApp.
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.modalTitle}>Complete your purchase</Text>
                  <Text style={styles.modalSub}>
                    Almost done! Pay {formatINR(total)} by UPI.
                  </Text>

                  {Platform.OS !== 'web' ? (
                    <Button
                      title="Pay via UPI App"
                      icon="📲"
                      variant="teal"
                      onPress={() => openLink(upiUri)}
                      style={{ marginBottom: 16 }}
                    />
                  ) : null}

                  <View style={styles.appRow}>
                    {UPI_APPS.map((app) => (
                      <View
                        key={app.name}
                        style={[styles.app, { backgroundColor: app.bg }]}
                        accessibilityLabel={app.name}
                      >
                        {app.logo}
                      </View>
                    ))}
                  </View>

                  <View style={styles.qrBox}>
                    <Text style={styles.qrHint}>Or scan from another phone</Text>
                    <View style={styles.qr} accessibilityLabel="UPI QR code">
                      <QRCode value={upiUri} size={184} backgroundColor="#ffffff" color="#0E2A47" />
                    </View>
                    <Pressable onPress={copyUpiId} accessibilityRole="button" style={styles.upiRow}>
                      <Text style={styles.upiText}>
                        <Text style={styles.upiStrong}>UPI ID: </Text>
                        {UPI_ID}
                      </Text>
                      <Text style={styles.copy}>{copied ? 'Copied ✓' : 'Copy'}</Text>
                    </Pressable>
                    <Text style={styles.upiText}>
                      <Text style={styles.upiStrong}>Name: </Text>
                      {UPI_PAYEE_NAME}
                    </Text>
                  </View>

                  {secondsLeft > 0 ? (
                    <Text style={styles.expiry}>
                      Code expires in <Text style={{ fontFamily: fonts.heading }}>{mm}:{ss}</Text>
                    </Text>
                  ) : (
                    <Text style={[styles.expiry, { color: colors.error }]}>
                      QR code expired — close and start again.
                    </Text>
                  )}

                  <Field
                    label="Enter the 12-digit UPI Transaction ID (UTR)"
                    hint="Your UPI app shows this as UTR, Transaction ID or UPI Ref. No. on the payment success screen."
                  >
                    <Input
                      keyboardType="number-pad"
                      autoComplete="off"
                      maxLength={12}
                      placeholder="e.g. 483921750264"
                      value={utr}
                      onChangeText={(t) => setUtr(t.replace(/\D/g, '').slice(0, 12))}
                      onBlur={() => setUtrTouched(true)}
                      editable={secondsLeft > 0}
                    />
                  </Field>
                  {utrTouched && utr.length > 0 && !isUtrValid ? (
                    <ErrorBanner>A UTR is exactly 12 digits — check your payment receipt.</ErrorBanner>
                  ) : null}

                  <Button
                    title="I've Completed the Payment"
                    icon="→"
                    onPress={finalizeSuccess}
                    disabled={!canConfirmPayment}
                  />
                  <Text style={styles.note}>
                    This transaction ID is verified against our bank records before your reading is
                    scheduled.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: {
    fontFamily: fonts.serif,
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 14,
  },
  back: { fontFamily: fonts.heading, color: colors.gold, fontSize: 14, marginBottom: 12 },
  block: { marginTop: 14 },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  link: { fontFamily: fonts.heading, color: colors.gold, fontSize: 13 },
  billingName: { fontFamily: fonts.serifMedium, color: colors.textLight, fontSize: 16, marginBottom: 4 },
  billingLine: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 14, lineHeight: 21 },
  osRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  osText: { fontFamily: fonts.serif, color: colors.textPrimary, fontSize: 14.5, flexShrink: 1 },
  osTotal: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 16 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.borderGold, marginVertical: 14 },
  trusted: { fontFamily: fonts.serif, color: colors.tealLight, fontSize: 13, marginTop: 14, textAlign: 'center' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    maxHeight: '92%',
    backgroundColor: colors.bgSecondary,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderColor: colors.borderGold,
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  close: { position: 'absolute', top: 10, right: 16, zIndex: 2, padding: 4 },
  closeText: { color: colors.textMuted, fontSize: 30, lineHeight: 32 },
  center: { alignItems: 'center' },
  modalTitle: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 21, marginBottom: 6, textAlign: 'center' },
  modalSub: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 14.5, marginBottom: 18, textAlign: 'center' },
  appRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 },
  app: { width: 52, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  qrBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(10, 32, 56, 0.6)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderGold,
    padding: 16,
    gap: 6,
  },
  qrHint: { fontFamily: fonts.italic, color: colors.lightGold, fontSize: 15 },
  qr: { padding: 8, backgroundColor: '#fff', borderRadius: 8, marginVertical: 6 },
  upiRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  upiText: { fontFamily: fonts.serif, color: colors.textPrimary, fontSize: 14 },
  upiStrong: { fontFamily: fonts.serifMedium, color: colors.lightGold },
  copy: { fontFamily: fonts.heading, color: colors.gold, fontSize: 12 },
  expiry: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 14, textAlign: 'center', marginVertical: 14 },
  check: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(91, 192, 160, 0.15)',
    borderWidth: 1.5,
    borderColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  checkText: { color: colors.success, fontSize: 30 },
});
