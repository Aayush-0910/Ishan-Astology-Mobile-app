import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import DateTimeField from '../components/DateTimeField';
import { Choice, Field, Input } from '../components/Form';
import { Button, Card, Icon, P, StickyFooter } from '../components/ui';
import UpiPaymentSheet from '../components/UpiPaymentSheet';
import { PACKAGES, formatINR, packageBySlug } from '../data/services';
import { useAppStore } from '../state/AppStore';
import { makeRef } from '../utils/bookings';
import { tap } from '../utils/haptics';
import { colors, fonts, radius, spacing } from '../theme';

const STEPS = ['Consultation', 'Your details', 'Your question', 'Review & pay'];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

const SERVICE_OPTIONS = PACKAGES.map((p) => ({
  value: p.slug,
  label: p.title,
  detail: p.priceLabel,
}));

function Progress({ step }) {
  return (
    <View style={styles.progress}>
      <View style={styles.bars}>
        {STEPS.map((s, i) => (
          <View key={s} style={[styles.bar, i <= step && styles.barOn]} />
        ))}
      </View>
      <Text style={styles.stepLabel}>
        Step {step + 1} of {STEPS.length} · {STEPS[step]}
      </Text>
    </View>
  );
}

function SummaryRow({ label, value, onEdit }) {
  return (
    <View style={styles.sumRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.sumLabel}>{label}</Text>
        <Text style={styles.sumValue}>{value}</Text>
      </View>
      {onEdit ? (
        <Pressable onPress={onEdit} hitSlop={8} accessibilityRole="button" accessibilityLabel={`Edit ${label}`}>
          <Text style={styles.edit}>Edit</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default function BookScreen() {
  const { service } = useLocalSearchParams();
  const { profile, saveProfile, addBooking } = useAppStore();
  const preset = service && packageBySlug(String(service)) ? String(service) : '';

  const [step, setStep] = useState(preset ? 1 : 0);
  const [slug, setSlug] = useState(preset);
  const [name, setName] = useState(profile?.name ?? '');
  const [dob, setDob] = useState(profile?.dob ?? '');
  const [tob, setTob] = useState(profile?.tob ?? '');
  const [pob, setPob] = useState(profile?.pob ?? '');
  const [remember, setRemember] = useState(true);
  const [question, setQuestion] = useState('');
  const [paying, setPaying] = useState(false);

  const pkg = packageBySlug(slug);
  const needsBirth = pkg?.needsBirthDetails ?? true;

  const stepValid = [
    Boolean(pkg),
    name.trim().length >= 2 &&
      (!needsBirth || (DATE_RE.test(dob) && TIME_RE.test(tob) && pob.trim().length > 1)),
    question.trim().length >= 5,
    true,
  ][step];

  const go = (next) => {
    tap();
    setStep(next);
  };

  const back = () => (step === 0 ? router.back() : go(step - 1));

  const onPaid = (utr) => {
    const booking = {
      id: makeRef(),
      slug,
      createdAt: new Date().toISOString(),
      name: name.trim(),
      dob: needsBirth || dob ? dob : '',
      tob: needsBirth || tob ? tob : '',
      pob: pob.trim(),
      question: question.trim(),
      amount: pkg.price,
      utr,
      whatsappSent: false,
    };
    addBooking(booking);
    if (remember && name.trim()) {
      saveProfile({ name: name.trim(), dob, tob, pob: pob.trim() });
    }
    setPaying(false);
    router.replace(`/bookings/${booking.id}?new=1`);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={10} accessibilityRole="button" accessibilityLabel="Close">
              <Icon name="close" size={26} color={colors.gold} />
            </Pressable>
          ),
        }}
      />
      <Progress step={step} />

      <ScrollView
        contentContainerStyle={{ padding: spacing.gutter, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        {step === 0 && (
          <>
            <Text style={styles.h}>Which consultation?</Text>
            <Choice options={SERVICE_OPTIONS} value={slug} onChange={setSlug} accessibilityLabel="Consultation" />
            {pkg ? (
              <Card style={{ marginTop: 14 }}>
                <Text style={styles.pickTitle}>{pkg.tagline}</Text>
                <Text style={styles.pickMeta}>Delivered in {pkg.turnaround}</Text>
              </Card>
            ) : null}
          </>
        )}

        {step === 1 && (
          <>
            <Text style={styles.h}>{needsBirth ? 'Your birth details' : 'Your name'}</Text>
            {!needsBirth ? (
              <P muted>Horary reads a chart cast on your question, so no birth details are needed.</P>
            ) : (
              <P muted>Exact details give exact timing. They stay private to Ishan Astrology.</P>
            )}
            <Field label="Full name">
              <Input value={name} onChangeText={setName} placeholder="Your full name" autoComplete="name" textContentType="name" />
            </Field>
            {needsBirth ? (
              <>
                <Field label="Date of birth">
                  <DateTimeField mode="date" value={dob} onChange={setDob} placeholder="Select date" />
                </Field>
                <Field label="Time of birth" hint="As exact as possible. Unsure? Give your best estimate and mention it in your question — BNN rectification will verify it.">
                  <DateTimeField mode="time" value={tob} onChange={setTob} placeholder="Select time" />
                </Field>
                <Field label="Place of birth">
                  <Input value={pob} onChangeText={setPob} placeholder="City, State, Country" />
                </Field>
              </>
            ) : null}
            <View style={styles.remember}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rememberTitle}>Save to my profile</Text>
                <Text style={styles.rememberSub}>Fill these in automatically next time</Text>
              </View>
              <Switch
                value={remember}
                onValueChange={setRemember}
                trackColor={{ true: colors.gold, false: 'rgba(233,228,214,0.2)' }}
                thumbColor="#fff"
              />
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.h}>What would you like answered?</Text>
            <P muted>{pkg?.questionHint}</P>
            <Input
              value={question}
              onChangeText={setQuestion}
              placeholder="Type your question…"
              multiline
              numberOfLines={6}
              style={{ minHeight: 160 }}
              autoFocus
            />
          </>
        )}

        {step === 3 && pkg && (
          <>
            <Text style={styles.h}>Review your booking</Text>
            <Card style={{ gap: 14 }}>
              <SummaryRow label="Consultation" value={`${pkg.title} · ${pkg.turnaround}`} onEdit={() => go(0)} />
              <SummaryRow
                label="For"
                value={[name, needsBirth ? `Born ${dob} at ${tob}` : null, needsBirth ? pob : null]
                  .filter(Boolean)
                  .join('\n')}
                onEdit={() => go(1)}
              />
              <SummaryRow label="Question" value={question} onEdit={() => go(2)} />
            </Card>
            <Card style={styles.total}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatINR(pkg.price)}</Text>
            </Card>
            <View style={styles.secure}>
              <Icon name="lock-closed" size={14} color={colors.tealLight} />
              <Text style={styles.secureText}>Paid by UPI directly to Ishan Astrology</Text>
            </View>
          </>
        )}
      </ScrollView>

      <StickyFooter>
        <Button title="Back" variant="secondary" onPress={back} style={{ flex: 0.6 }} />
        {step < 3 ? (
          <Button title="Continue" icon="arrow-forward" onPress={() => go(step + 1)} disabled={!stepValid} style={{ flex: 1 }} />
        ) : (
          <Button title={`Pay ${pkg ? formatINR(pkg.price) : ''}`} icon="lock-closed" onPress={() => setPaying(true)} style={{ flex: 1 }} />
        )}
      </StickyFooter>

      {paying && pkg ? (
        <UpiPaymentSheet
          amount={pkg.price}
          note={pkg.checkoutLabel}
          onClose={() => setPaying(false)}
          onConfirm={onPaid}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  progress: { paddingHorizontal: spacing.gutter, paddingTop: 6, paddingBottom: 10 },
  bars: { flexDirection: 'row', gap: 6 },
  bar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(233,228,214,0.12)' },
  barOn: { backgroundColor: colors.gold },
  stepLabel: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 12.5, marginTop: 8 },
  h: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 21, lineHeight: 28, marginBottom: 12 },
  pickTitle: { fontFamily: fonts.italic, color: colors.lightGold, fontSize: 17 },
  pickMeta: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 13, marginTop: 4 },
  remember: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 14,
    marginTop: 4,
  },
  rememberTitle: { fontFamily: fonts.serifMedium, color: colors.textLight, fontSize: 15 },
  rememberSub: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 12.5, marginTop: 2 },
  sumRow: { flexDirection: 'row', gap: 12 },
  sumLabel: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 12.5, marginBottom: 3 },
  sumValue: { fontFamily: fonts.serif, color: colors.textLight, fontSize: 15, lineHeight: 21 },
  edit: { fontFamily: fonts.serifMedium, color: colors.gold, fontSize: 14 },
  total: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  totalLabel: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 16 },
  totalValue: { fontFamily: fonts.display, color: colors.lightGold, fontSize: 28 },
  secure: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14 },
  secureText: { fontFamily: fonts.serif, color: colors.tealLight, fontSize: 13 },
});
