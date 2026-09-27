import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionTile, Button, Card, Icon, Pill, SectionHeader } from '../../components/ui';
import ServiceArt from '../../components/ServiceArt';
import { StarRating } from '../../components/Stars';
import { PACKAGES, packageBySlug } from '../../data/services';
import { CASES, PROCESS } from '../../data/content';
import { REVIEWS } from '../../data/reviews';
import { PHONES, WHATSAPP_LINK } from '../../config/contact';
import { firstName, useAppStore } from '../../state/AppStore';
import { bookingStatus, formatDate } from '../../utils/bookings';
import { openLink } from '../../utils/openLink';
import { tap } from '../../utils/haptics';
import { colors, fonts, radius, spacing } from '../../theme';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function LatestBooking({ booking }) {
  const pkg = packageBySlug(booking.slug);
  const status = bookingStatus(booking);
  return (
    <Card onPress={() => router.push(`/bookings/${booking.id}`)} style={styles.latest}>
      <View style={styles.latestTop}>
        <Text style={styles.latestLabel}>Your consultation</Text>
        <Pill tone={status.tone} icon={status.icon}>
          {status.label}
        </Pill>
      </View>
      <Text style={styles.latestTitle}>{pkg?.title}</Text>
      <Text style={styles.latestMeta}>
        {formatDate(booking.createdAt)} · Ref {booking.id}
      </Text>
    </Card>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { profile, bookings } = useAppStore();
  const name = firstName(profile);
  const latest = bookings[0];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pad}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.hello}>
              {greeting()}
              {name ? `, ${name}` : ''} 🙏
            </Text>
            <Text style={styles.brand}>Ishan Astrology</Text>
          </View>
          <Pressable
            onPress={() => {
              tap();
              router.navigate('/profile');
            }}
            style={styles.avatar}
            accessibilityRole="button"
            accessibilityLabel="Profile"
          >
            <Text style={styles.avatarText}>{name ? name[0].toUpperCase() : 'ॐ'}</Text>
          </Pressable>
        </View>

        {/* Quick-question hero */}
        <View style={styles.hero}>
          <Pill tone="light" icon="flash">
            Answer in 24–48 hours
          </Pill>
          <Text style={styles.heroTitle}>Have one question on your mind?</Text>
          <Text style={styles.heroBody}>
            KP Horary gives a clear Yes / No / When — no birth time needed.
          </Text>
          <Button
            title="Ask for ₹1,500"
            icon="arrow-forward"
            onPress={() => router.push('/book?service=horary')}
            style={{ alignSelf: 'flex-start', marginTop: 14 }}
          />
        </View>

        <View style={styles.actions}>
          <ActionTile icon="calendar" label="Book" onPress={() => router.push('/book')} />
          <ActionTile icon="chatbubbles" label="Ask" onPress={() => router.navigate('/chat')} />
          <ActionTile icon="logo-whatsapp" label="WhatsApp" tint={colors.whatsapp} onPress={() => openLink(WHATSAPP_LINK)} />
          <ActionTile icon="call" label="Call" tint={colors.tealLight} onPress={() => openLink(PHONES[0].href)} />
        </View>

        {latest ? <LatestBooking booking={latest} /> : null}

        <SectionHeader title="Consultations" action="See all" onAction={() => router.navigate('/services')} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
        snapToInterval={232}
        decelerationRate="fast"
      >
        {PACKAGES.map((pkg) => (
          <Card
            key={pkg.slug}
            style={styles.serviceCard}
            onPress={() => router.push(`/service/${pkg.slug}`)}
            accessibilityLabel={`${pkg.title}, ${pkg.priceLabel}`}
          >
            <View style={styles.serviceArt}>
              <ServiceArt slug={pkg.slug} size={120} />
            </View>
            <Text style={styles.serviceTitle} numberOfLines={1}>
              {pkg.title}
            </Text>
            <Text style={styles.serviceTagline} numberOfLines={2}>
              {pkg.tagline}
            </Text>
            <View style={styles.serviceFoot}>
              <Text style={styles.servicePrice}>{pkg.priceLabel}</Text>
              <Text style={styles.serviceTime}>{pkg.turnaround}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>

      <View style={styles.pad}>
        <SectionHeader title="How it works" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
        {PROCESS.map((step, i) => (
          <Card key={step.title} style={styles.stepCard}>
            <View style={styles.stepTop}>
              <Icon name={step.icon} size={22} />
              <Text style={styles.stepNum}>0{i + 1}</Text>
            </View>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepBody}>{step.body}</Text>
          </Card>
        ))}
      </ScrollView>

      <View style={styles.pad}>
        <View style={styles.stats}>
          {[
            ['2020', 'Practising since'],
            ['1,000+', 'Consultations'],
            ['Worldwide', 'Clients'],
          ].map(([big, small]) => (
            <View key={small} style={styles.stat}>
              <Text style={styles.statBig}>{big}</Text>
              <Text style={styles.statSmall}>{small}</Text>
            </View>
          ))}
        </View>

        <SectionHeader title="From recent consultations" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
        {CASES.map((c) => (
          <Card key={c.title} style={styles.caseCard}>
            <Icon name="sparkles" size={16} />
            <Text style={styles.caseTitle}>{c.title}</Text>
            <Text style={styles.caseBody} numberOfLines={6}>
              {c.body}
            </Text>
          </Card>
        ))}
      </ScrollView>

      {REVIEWS.length > 0 ? (
        <>
          <View style={styles.pad}>
            <SectionHeader title="What seekers say" action="Write one" onAction={() => router.push('/reviews')} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
            {REVIEWS.map((r) => (
              <Card key={`${r.name}-${r.date}`} style={styles.caseCard}>
                <StarRating rating={r.rating} />
                <Text style={styles.caseBody} numberOfLines={6}>
                  “{r.body}”
                </Text>
                <Text style={styles.reviewName}>{r.name}</Text>
              </Card>
            ))}
          </ScrollView>
        </>
      ) : (
        <View style={styles.pad}>
          <Card onPress={() => router.push('/reviews')} style={styles.reviewInvite}>
            <Icon name="star" size={22} />
            <View style={{ flex: 1 }}>
              <Text style={styles.inviteTitle}>Had a consultation?</Text>
              <Text style={styles.inviteBody}>Share how it went — it helps others decide.</Text>
            </View>
            <Icon name="chevron-forward" size={18} color={colors.textMuted} />
          </Card>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: spacing.gutter },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  hello: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 15 },
  brand: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 25, marginTop: 2 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  avatarText: { fontFamily: fonts.sanskrit, color: colors.gold, fontSize: 20 },

  hero: {
    backgroundColor: colors.teal,
    borderRadius: radius.lg,
    padding: 20,
    overflow: 'hidden',
  },
  heroTitle: { fontFamily: fonts.heading, color: '#fff', fontSize: 21, lineHeight: 28, marginTop: 12 },
  heroBody: { fontFamily: fonts.serif, color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 22, marginTop: 6 },

  actions: { flexDirection: 'row', marginTop: 22, marginBottom: 4 },

  latest: { marginTop: 20 },
  latestTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  latestLabel: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 13 },
  latestTitle: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 17, marginTop: 8 },
  latestMeta: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 13, marginTop: 4 },

  carousel: { paddingHorizontal: spacing.gutter, gap: 12 },
  serviceCard: { width: 220, padding: 14 },
  serviceArt: {
    height: 128,
    borderRadius: radius.md,
    backgroundColor: colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceTitle: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 15 },
  serviceTagline: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 13, lineHeight: 18, marginTop: 4, minHeight: 36 },
  serviceFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 10 },
  servicePrice: { fontFamily: fonts.display, color: colors.lightGold, fontSize: 22 },
  serviceTime: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 12 },

  stepCard: { width: 200 },
  stepTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  stepNum: { fontFamily: fonts.display, color: 'rgba(200,160,70,0.5)', fontSize: 22 },
  stepTitle: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 14.5, marginBottom: 6 },
  stepBody: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 13, lineHeight: 19 },

  stats: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: 16,
    marginTop: spacing.section,
  },
  stat: { flex: 1, alignItems: 'center' },
  statBig: { fontFamily: fonts.display, color: colors.lightGold, fontSize: 21 },
  statSmall: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 12, marginTop: 2 },

  caseCard: { width: 250, gap: 6 },
  caseTitle: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 14.5 },
  caseBody: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  reviewName: { fontFamily: fonts.serifMedium, color: colors.lightGold, fontSize: 13 },

  reviewInvite: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: spacing.section },
  inviteTitle: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 15 },
  inviteBody: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 13, marginTop: 2 },
});
