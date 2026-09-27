import React, { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorBanner, Field, Input } from './Form';
import { Button, Icon } from './ui';
import { UPI_APPS } from './UpiLogos';
import { UPI_ID, UPI_PAYEE_NAME } from '../config/contact';
import { formatINR } from '../data/services';
import { openLink } from '../utils/openLink';
import { success, tap } from '../utils/haptics';
import { colors, fonts, radius } from '../theme';

const QR_SECONDS = 600;

/**
 * Bottom sheet that takes a UPI payment: opens the phone's UPI app directly,
 * shows a QR for paying from another device, and unlocks confirmation only
 * once a 12-digit UPI transaction reference (UTR) is entered — which only
 * exists after a real payment has gone through.
 *
 * Mount it only while it should be open (`{open && <UpiPaymentSheet … />}`),
 * so each opening starts with a fresh timer and an empty UTR field.
 *
 * @param {number} amount           rupees
 * @param {string} note             shown in the payer's UPI app
 * @param {() => void} onClose
 * @param {(utr: string) => void} onConfirm
 */
export default function UpiPaymentSheet({ amount, note, onClose, onConfirm }) {
  const insets = useSafeAreaInsets();
  const [secondsLeft, setSecondsLeft] = useState(QR_SECONDS);
  const [utr, setUtr] = useState('');
  const [utrTouched, setUtrTouched] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
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
  }, []);

  const upiUri =
    `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_PAYEE_NAME)}` +
    `&am=${amount}&tn=${encodeURIComponent(note)}&cu=INR`;

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  // A UPI reference is always 12 digits. Anything else means no payment was made.
  const isUtrValid = /^\d{12}$/.test(utr);
  const canConfirm = isUtrValid && secondsLeft > 0;

  const copyUpiId = async () => {
    tap();
    await Clipboard.setStringAsync(UPI_ID);
    setCopied(true);
  };

  const confirm = () => {
    success();
    onConfirm(utr);
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close payment" />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.grabber} />
          <View style={styles.head}>
            <Text style={styles.title}>Pay {formatINR(amount)}</Text>
            <Pressable onPress={onClose} hitSlop={10} accessibilityRole="button" accessibilityLabel="Close">
              <Icon name="close-circle" size={28} color={colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.step}>1 · Pay with any UPI app</Text>
            {Platform.OS !== 'web' ? (
              <Button
                title="Open UPI app"
                icon="phone-portrait-outline"
                onPress={() => openLink(upiUri)}
                style={{ marginBottom: 12 }}
              />
            ) : null}
            <View style={styles.appRow}>
              {UPI_APPS.map((app) => (
                <View key={app.name} style={[styles.app, { backgroundColor: app.bg }]} accessibilityLabel={app.name}>
                  {app.logo}
                </View>
              ))}
            </View>

            <View style={styles.qrBox}>
              <Text style={styles.qrHint}>Or scan from another phone</Text>
              <View style={styles.qr} accessibilityLabel="UPI QR code">
                <QRCode value={upiUri} size={170} backgroundColor="#ffffff" color="#0E2A47" />
              </View>
              <Pressable onPress={copyUpiId} style={styles.upiRow} accessibilityRole="button">
                <Text style={styles.upiText}>{UPI_ID}</Text>
                <Icon name={copied ? 'checkmark' : 'copy-outline'} size={16} color={colors.gold} />
              </Pressable>
              <Text style={styles.upiName}>{UPI_PAYEE_NAME}</Text>
              {secondsLeft > 0 ? (
                <Text style={styles.expiry}>Code expires in {mm}:{ss}</Text>
              ) : (
                <Text style={[styles.expiry, { color: colors.error }]}>Code expired — close and try again.</Text>
              )}
            </View>

            <Text style={[styles.step, { marginTop: 20 }]}>2 · Enter your UPI reference</Text>
            <Field hint="Shown as UTR, Transaction ID or UPI Ref. No. on your app's payment success screen.">
              <Input
                keyboardType="number-pad"
                autoComplete="off"
                maxLength={12}
                placeholder="12-digit UTR, e.g. 483921750264"
                value={utr}
                onChangeText={(t) => setUtr(t.replace(/\D/g, '').slice(0, 12))}
                onBlur={() => setUtrTouched(true)}
                editable={secondsLeft > 0}
              />
            </Field>
            {utrTouched && utr.length > 0 && !isUtrValid ? (
              <ErrorBanner>A UTR is exactly 12 digits — check your payment receipt.</ErrorBanner>
            ) : null}

            <Button title="I've paid — confirm booking" onPress={confirm} disabled={!canConfirm} />
            <Text style={styles.note}>
              Your transaction ID is checked against our bank records before your reading is scheduled.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: {
    maxHeight: '94%',
    backgroundColor: colors.bgSecondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(233,228,214,0.25)',
    marginBottom: 10,
  },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  title: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 21 },
  step: { fontFamily: fonts.heading, color: colors.lightGold, fontSize: 13, letterSpacing: 0.8, marginBottom: 10 },
  appRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  app: { width: 54, height: 36, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  qrBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 14,
    gap: 4,
  },
  qrHint: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 13 },
  qr: { padding: 8, backgroundColor: '#fff', borderRadius: 10, marginVertical: 8 },
  upiRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  upiText: { fontFamily: fonts.serifMedium, color: colors.textLight, fontSize: 15 },
  upiName: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 13 },
  expiry: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 13, marginTop: 6 },
  note: {
    fontFamily: fonts.serif,
    color: colors.textMuted,
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 6,
  },
});
