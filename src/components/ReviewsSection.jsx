import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { REVIEWS, SERVICE_FILTERS, averageRating } from '../data/reviews';
import { StarRating } from './Stars';
import { Button, Card, H2, LineAccent, P, Section, SectionIntro, SectionLabel } from './ui';

function ReviewCard({ review }) {
  const { name, location, service, rating, date, body } = review;
  return (
    <Card style={styles.card}>
      <Text style={styles.quoteMark} accessible={false}>“</Text>
      <StarRating rating={rating} />
      <Text style={styles.body}>{body}</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.sub}>
        {location}
        {location && service ? ' · ' : ''}
        {service}
      </Text>
      {date ? <Text style={styles.date}>{date}</Text> : null}
    </Card>
  );
}

/**
 * Published client reviews, or — while there are none — an invitation to
 * leave one.
 *
 * @param {boolean} [ctaWhenEmpty=true]  With no published reviews, show the
 *   "share your experience" call to action. Pass false on screens that already
 *   end in their own CTA, so two gold blocks do not stack.
 */
export default function ReviewsSection({ ctaWhenEmpty = true, onLayout }) {
  const [filter, setFilter] = useState('All');

  if (REVIEWS.length === 0) {
    if (!ctaWhenEmpty) return null;
    return (
      <Section onLayout={onLayout}>
        <Card style={styles.cta}>
          <LineAccent />
          <SectionLabel sanskrit="प्रतिक्रिया" center>
            Your Experience
          </SectionLabel>
          <H2 center>Had a consultation with Ishan ji?</H2>
          <P center muted>
            Your words help others decide whether this is the right guidance for them. Share how
            your reading went — it takes a minute.
          </P>
          <View style={styles.btnGroup}>
            <Button title="Share Your Experience" href="/reviews" />
            <Button title="Send Private Feedback" href="/reviews?tab=feedback" variant="secondary" />
          </View>
        </Card>
      </Section>
    );
  }

  const visible = filter === 'All' ? REVIEWS : REVIEWS.filter((r) => r.service === filter);

  // Only offer a filter chip if at least one review would survive it.
  const activeFilters = SERVICE_FILTERS.filter(
    (f) => f === 'All' || REVIEWS.some((r) => r.service === f)
  );

  return (
    <Section alt onLayout={onLayout}>
      <SectionIntro label="What Seekers Say" sanskrit="प्रतिक्रिया" title="In their own words." />

      <View style={styles.summary}>
        <StarRating rating={Math.round(averageRating)} size={22} />
        <Text style={styles.average}>{averageRating.toFixed(1)}</Text>
        <Text style={styles.count}>
          from {REVIEWS.length} {REVIEWS.length === 1 ? 'review' : 'reviews'}
        </Text>
      </View>

      {activeFilters.length > 2 && (
        <View style={styles.filters}>
          {activeFilters.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === f }}
              style={[styles.filter, filter === f && styles.filterSelected]}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextSelected]}>{f}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={{ gap: 16 }}>
        {visible.map((r) => (
          <ReviewCard review={r} key={`${r.name}-${r.date}`} />
        ))}
      </View>

      <View style={styles.bottomCta}>
        <P center muted>Had a consultation with Ishan ji?</P>
        <Button title="Share Your Experience" icon="→" href="/reviews" />
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  cta: { alignItems: 'center', paddingVertical: 30 },
  btnGroup: { alignSelf: 'stretch', gap: 12, marginTop: 8 },
  card: { paddingTop: 26 },
  quoteMark: {
    position: 'absolute',
    top: -6,
    right: 16,
    fontFamily: fonts.display,
    fontSize: 64,
    color: 'rgba(200,160,70,0.25)',
  },
  body: {
    fontFamily: fonts.italicRegular,
    color: colors.textPrimary,
    fontSize: 18,
    lineHeight: 26,
    marginVertical: 12,
  },
  name: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 14 },
  sub: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 13, marginTop: 2 },
  date: { fontFamily: fonts.serif, color: colors.gold, fontSize: 12, marginTop: 4 },
  summary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 },
  average: { fontFamily: fonts.display, color: colors.textLight, fontSize: 26 },
  count: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 14 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 20 },
  filter: {
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  filterSelected: { backgroundColor: colors.gold, borderColor: colors.gold },
  filterText: { fontFamily: fonts.serif, color: colors.textPrimary, fontSize: 13 },
  filterTextSelected: { color: colors.bgPrimary },
  bottomCta: { alignItems: 'center', marginTop: 28 },
});
