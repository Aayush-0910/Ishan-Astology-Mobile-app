import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Screen from '../../components/Screen';
import ReviewForm from '../../components/ReviewForm';
import FeedbackForm from '../../components/FeedbackForm';
import { H1, P, SanskritSub, Section, SystemTag } from '../../components/ui';
import { colors, fonts } from '../../theme';

const TABS = [
  {
    id: 'review',
    label: 'Leave a Review',
    sanskrit: 'प्रतिक्रिया',
    blurb:
      'Share your experience of a consultation. With your permission, your words may appear in the app and on the website to help others decide.',
    privacy:
      'Every review is read before anything is published. You choose whether your full name, initials only, or nothing at all appears.',
  },
  {
    id: 'feedback',
    label: 'Feedback',
    sanskrit: 'निवेदन',
    blurb: 'Please share your thoughts or suggestions here.',
    privacy: 'please provide your valuable feedback.',
  },
];

export default function ReviewsScreen() {
  // ?tab=feedback deep-links the private tab, so other screens can point at either.
  const { tab } = useLocalSearchParams();
  const requested = TABS.some((t) => t.id === tab) ? String(tab) : 'review';
  const [activeId, setActiveId] = useState(requested);

  // The screen stays mounted as a tab, so follow later deep links too.
  const [lastRequested, setLastRequested] = useState(requested);
  if (requested !== lastRequested) {
    setLastRequested(requested);
    setActiveId(requested);
  }

  const active = TABS.find((t) => t.id === activeId) || TABS[0];

  const selectTab = (id) => {
    setActiveId(id);
    router.setParams({ tab: id === 'review' ? undefined : id });
  };

  return (
    <Screen keyboard footer={false}>
      <Section style={{ paddingTop: 28 }}>
        <SystemTag>Your Voice</SystemTag>
        <H1>Reviews &amp; Feedback</H1>
        <SanskritSub>{active.sanskrit}</SanskritSub>

        <View style={styles.tabs} accessibilityRole="tablist">
          {TABS.map((t) => {
            const selected = activeId === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => selectTab(t.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                style={[styles.tab, selected && styles.tabSelected]}
              >
                <Text style={[styles.tabText, selected && styles.tabTextSelected]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <P muted>{active.blurb}</P>
        <Text style={styles.privacy}>{active.privacy}</Text>

        {active.id === 'review' ? <ReviewForm /> : <FeedbackForm />}
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 999,
    padding: 4,
    marginBottom: 18,
  },
  tab: { flex: 1, borderRadius: 999, paddingVertical: 10, alignItems: 'center' },
  tabSelected: { backgroundColor: colors.gold },
  tabText: { fontFamily: fonts.heading, color: colors.lightGold, fontSize: 12.5, letterSpacing: 0.8 },
  tabTextSelected: { color: colors.bgPrimary },
  privacy: {
    fontFamily: fonts.italic,
    color: colors.lightGold,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 18,
  },
});
