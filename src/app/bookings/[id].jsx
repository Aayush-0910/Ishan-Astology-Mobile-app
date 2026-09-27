import React from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Button,
  Card,
  EmptyState,
  Icon,
  ListGroup,
  ListRow,
  Pill,
  Screen,
} from '../../components/ui';
import { packageBySlug, formatINR } from '../../data/services';
import { PHONES } from '../../config/contact';
import { useAppStore } from '../../state/AppStore';
import { bookingStatus, bookingWhatsAppLink, formatDate } from '../../utils/bookings';
import { openLink } from '../../utils/openLink';
import { colors, fonts } from '../../theme';

function Detail({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function BookingDetailScreen() {
  const { id, new: isNew } = useLocalSearchParams();
  const { bookings, updateBooking, removeBooking } = useAppStore();
  const b = bookings.find((x) => x.id === id);

  if (!b) {
    return (
      <Screen>
        <EmptyState icon="calendar-outline" title="Booking not found" />
      </Screen>
    );
  }

  const pkg = packageBySlug(b.slug);
  const status = bookingStatus(b);

  const sendOnWhatsApp = () => {
    openLink(bookingWhatsAppLink(b));
    updateBooking(b.id, { whatsappSent: true });
  };

  const confirmDelete = () => {
    const doDelete = () => {
      removeBooking(b.id);
      router.back();
    };
    if (Platform.OS === 'web') {
      doDelete();
      return;
    }
    Alert.alert(
      'Remove this booking?',
      'It is only removed from this phone. Your payment and any messages already sent are not affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: doDelete },
      ]
    );
  };

  return (
    <Screen
      footer={
        !b.whatsappSent ? (
          <Button
            title="Send details on WhatsApp"
            icon="logo-whatsapp"
            variant="whatsapp"
            onPress={sendOnWhatsApp}
            style={{ flex: 1 }}
          />
        ) : null
      }
    >
      {isNew ? (
        <View style={styles.success}>
          <View style={styles.successIcon}>
            <Icon name="checkmark" size={34} color={colors.success} />
          </View>
          <Text style={styles.successTitle}>Payment submitted</Text>
          <Text style={styles.successBody}>
            One last step: send your details to Ishan ji on WhatsApp so your reading can be scheduled.
          </Text>
        </View>
      ) : null}

      <Card>
        <View style={styles.head}>
          <Pill tone={status.tone} icon={status.icon}>
            {status.label}
          </Pill>
          <Text style={styles.date}>{formatDate(b.createdAt)}</Text>
        </View>
        <Text style={styles.title}>{pkg?.title ?? b.slug}</Text>
        <Text style={styles.sub}>Delivered in {pkg?.turnaround}</Text>

        <View style={styles.divider} />
        <Detail label="Name" value={b.name} />
        <Detail label="Date of birth" value={b.dob} />
        <Detail label="Time of birth" value={b.tob} />
        <Detail label="Place of birth" value={b.pob} />
        <Detail label="Question" value={b.question} />

        <View style={styles.divider} />
        <Detail label="Amount paid" value={formatINR(b.amount)} />
        <Detail label="UPI reference (UTR)" value={b.utr} />
        <Detail label="Booking reference" value={b.id} />
      </Card>

      <ListGroup title="Next steps">
        {b.whatsappSent ? (
          <ListRow icon="logo-whatsapp" iconColor={colors.whatsapp} title="Send details again" onPress={sendOnWhatsApp} />
        ) : null}
        <ListRow icon="call-outline" title="Call Ishan Astrology" subtitle={PHONES[0].label} href={PHONES[0].href} />
        <ListRow icon="star-outline" title="Review this consultation" onPress={() => router.push('/reviews')} />
      </ListGroup>

      <ListGroup style={{ marginTop: 20 }}>
        <ListRow icon="trash-outline" title="Remove from this phone" destructive chevron={false} onPress={confirmDelete} />
      </ListGroup>
    </Screen>
  );
}

const styles = StyleSheet.create({
  success: { alignItems: 'center', paddingVertical: 12, marginBottom: 12 },
  successIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(91,192,160,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 21 },
  successBody: {
    fontFamily: fonts.serif,
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 8,
  },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 12.5 },
  title: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 19, marginTop: 12 },
  sub: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 13.5, marginTop: 3 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.separator, marginVertical: 14 },
  detail: { marginBottom: 10 },
  detailLabel: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 12.5 },
  detailValue: { fontFamily: fonts.serif, color: colors.textLight, fontSize: 15, lineHeight: 21, marginTop: 2 },
});
