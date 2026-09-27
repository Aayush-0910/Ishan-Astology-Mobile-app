import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import {
  Bullets,
  Button,
  Card,
  EmptyState,
  Icon,
  P,
  Pill,
  Sanskrit,
  Screen,
  SectionHeader,
} from '../../components/ui';
import ServiceArt from '../../components/ServiceArt';
import { packageBySlug } from '../../data/services';
import { colors, fonts, radius } from '../../theme';

export default function ServiceScreen() {
  const { slug } = useLocalSearchParams();
  const pkg = packageBySlug(String(slug));
  const { width } = useWindowDimensions();

  if (!pkg) {
    return (
      <Screen>
        <EmptyState
          icon="alert-circle-outline"
          title="Service not found"
          action={<Button title="See all services" onPress={() => router.navigate('/services')} />}
        />
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <>
          <View style={styles.footPrice}>
            <Text style={styles.footAmount}>{pkg.priceLabel}</Text>
            <Text style={styles.footUnit}>{pkg.unit}</Text>
          </View>
          <Button
            title="Book now"
            icon="arrow-forward"
            onPress={() => router.push(`/book?service=${pkg.slug}`)}
            style={{ flex: 1 }}
          />
        </>
      }
    >
      <Stack.Screen options={{ title: pkg.title }} />

      <View style={styles.art}>
        <ServiceArt slug={pkg.slug} size={Math.min(width - 64, 260)} />
      </View>

      <Sanskrit>{pkg.sanskrit}</Sanskrit>
      <Text style={styles.title}>{pkg.title}</Text>
      <Text style={styles.tagline}>{pkg.tagline}</Text>

      <View style={styles.chips}>
        <Pill tone="gold" icon="pricetag">
          {pkg.priceLabel}
        </Pill>
        <Pill tone="teal" icon="time">
          {pkg.turnaround}
        </Pill>
        <Pill tone="muted" icon={pkg.needsBirthDetails ? 'calendar' : 'help-circle'}>
          {pkg.needsBirthDetails ? 'Needs birth details' : 'No birth time needed'}
        </Pill>
      </View>

      <SectionHeader title="What you get" />
      <Card>
        <Bullets items={pkg.features} />
      </Card>

      <SectionHeader title="How it works" />
      {pkg.about.map((p) => (
        <P key={p.slice(0, 24)}>{p}</P>
      ))}

      <SectionHeader title="Good for" />
      <View style={styles.goodFor}>
        {pkg.goodFor.map((g) => (
          <View key={g} style={styles.goodChip}>
            <Icon name="sparkles" size={12} />
            <Text style={styles.goodText}>{g}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  art: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgDeep,
    borderRadius: radius.lg,
    paddingVertical: 16,
    marginBottom: 18,
  },
  title: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 25, lineHeight: 32, marginTop: 4 },
  tagline: { fontFamily: fonts.italic, color: colors.lightGold, fontSize: 18, lineHeight: 24, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  goodFor: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  goodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  goodText: { fontFamily: fonts.serif, color: colors.textPrimary, fontSize: 13.5 },
  footPrice: { justifyContent: 'center', paddingRight: 6 },
  footAmount: { fontFamily: fonts.display, color: colors.lightGold, fontSize: 22 },
  footUnit: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 12 },
});
