import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Card, Icon, ListGroup, ListRow, P, Pill, Screen } from '../../components/ui';
import ServiceArt from '../../components/ServiceArt';
import { PACKAGES } from '../../data/services';
import { colors, fonts, radius } from '../../theme';

export default function ServicesScreen() {
  return (
    <Screen>
      <P muted>
        KP for timing, Bhrigu Nadi for verification, Numerology for naming. Pick the consultation
        that fits your question.
      </P>

      <View style={{ gap: 12 }}>
        {PACKAGES.map((pkg) => (
          <Card
            key={pkg.slug}
            onPress={() => router.push(`/service/${pkg.slug}`)}
            accessibilityLabel={`${pkg.title}, ${pkg.priceLabel}`}
            style={styles.card}
          >
            <View style={styles.art}>
              <ServiceArt slug={pkg.slug} size={76} />
            </View>
            <View style={{ flex: 1 }}>
              {pkg.badge ? (
                <View style={{ marginBottom: 6 }}>
                  <Pill tone={pkg.slug === 'horary' ? 'teal' : 'gold'}>{pkg.badge}</Pill>
                </View>
              ) : null}
              <Text style={styles.title}>{pkg.title}</Text>
              <Text style={styles.tagline} numberOfLines={2}>
                {pkg.tagline}
              </Text>
              <View style={styles.meta}>
                <Text style={styles.price}>{pkg.priceLabel}</Text>
                <View style={styles.time}>
                  <Icon name="time-outline" size={13} color={colors.textMuted} />
                  <Text style={styles.timeText}>{pkg.turnaround}</Text>
                </View>
              </View>
            </View>
            <Icon name="chevron-forward" size={18} color={colors.textMuted} />
          </Card>
        ))}
      </View>

      <ListGroup title="Not sure which one?">
        <ListRow
          icon="chatbubbles-outline"
          title="Ask the assistant"
          subtitle="Describe your question and get pointed to the right reading"
          onPress={() => router.navigate('/chat')}
        />
        <ListRow icon="help-circle-outline" title="Help & FAQ" onPress={() => router.push('/faq')} />
      </ListGroup>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12 },
  art: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
    backgroundColor: colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 15.5 },
  tagline: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 13, lineHeight: 18, marginTop: 3 },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  price: { fontFamily: fonts.display, color: colors.lightGold, fontSize: 20 },
  time: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 12 },
});
