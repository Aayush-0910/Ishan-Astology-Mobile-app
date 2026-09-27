import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Card, EmptyState, Icon, Pill, Screen } from '../../components/ui';
import { packageBySlug, formatINR } from '../../data/services';
import { useAppStore } from '../../state/AppStore';
import { bookingStatus, formatDate } from '../../utils/bookings';
import { colors, fonts } from '../../theme';

export default function BookingsScreen() {
  const { ready, bookings } = useAppStore();

  if (ready && bookings.length === 0) {
    return (
      <Screen>
        <EmptyState
          icon="calendar-outline"
          title="No consultations yet"
          body="When you book a reading it appears here, with its payment reference and status."
          action={<Button title="Book a reading" icon="add" onPress={() => router.push('/book')} />}
        />
      </Screen>
    );
  }

  return (
    <Screen
      footer={<Button title="New booking" icon="add" onPress={() => router.push('/book')} style={{ flex: 1 }} />}
    >
      <View style={{ gap: 12 }}>
        {bookings.map((b) => {
          const pkg = packageBySlug(b.slug);
          const status = bookingStatus(b);
          return (
            <Card key={b.id} onPress={() => router.push(`/bookings/${b.id}`)} accessibilityLabel={`${pkg?.title}, ${status.label}`}>
              <View style={styles.top}>
                <Pill tone={status.tone} icon={status.icon}>
                  {status.label}
                </Pill>
                <Text style={styles.date}>{formatDate(b.createdAt)}</Text>
              </View>
              <View style={styles.mid}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{pkg?.title ?? b.slug}</Text>
                  <Text style={styles.question} numberOfLines={2}>
                    {b.question}
                  </Text>
                </View>
                <Icon name="chevron-forward" size={18} color={colors.textMuted} />
              </View>
              <View style={styles.bottom}>
                <Text style={styles.meta}>Ref {b.id}</Text>
                <Text style={styles.amount}>{formatINR(b.amount)}</Text>
              </View>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 12.5 },
  mid: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  title: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 16 },
  question: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 13.5, lineHeight: 19, marginTop: 4 },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
  meta: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 12.5 },
  amount: { fontFamily: fonts.serifMedium, color: colors.lightGold, fontSize: 14 },
});
