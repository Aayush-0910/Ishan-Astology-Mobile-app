import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import ReviewForm from '../components/ReviewForm';
import FeedbackForm from '../components/FeedbackForm';
import { P, Screen } from '../components/ui';
import { tap } from '../utils/haptics';
import { colors, fonts, radius } from '../theme';

const TABS = [
  {
    id: 'review',
    label: 'Review',
    blurb:
      'Share your experience of a consultation. With your permission, your words may be shown to help others decide. You choose whether your full name, initials only, or nothing appears.',
  },
  {
    id: 'feedback',
    label: 'Private feedback',
    blurb: 'Thoughts or suggestions for Ishan ji — only he will read these.',
  },
];

export default function ReviewsScreen() {
  // ?tab=feedback opens the private feedback form directly.
  const { tab } = useLocalSearchParams();
  const [activeId, setActiveId] = useState(TABS.some((t) => t.id === tab) ? String(tab) : 'review');
  const active = TABS.find((t) => t.id === activeId) || TABS[0];

  const select = (id) => {
    tap();
    setActiveId(id);
    router.setParams({ tab: id === 'review' ? undefined : id });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <Screen>
        <View style={styles.segment} accessibilityRole="tablist">
          {TABS.map((t) => {
            const selected = t.id === activeId;
            return (
              <Pressable
                key={t.id}
                onPress={() => select(t.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                style={[styles.seg, selected && styles.segOn]}
              >
                <Text style={[styles.segText, selected && styles.segTextOn]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <P muted>{active.blurb}</P>
        {active.id === 'review' ? <ReviewForm /> : <FeedbackForm />}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: 3,
    marginBottom: 14,
  },
  seg: { flex: 1, borderRadius: 8, paddingVertical: 9, alignItems: 'center' },
  segOn: { backgroundColor: colors.gold },
  segText: { fontFamily: fonts.serifMedium, color: colors.textMuted, fontSize: 14 },
  segTextOn: { color: colors.bgPrimary },
});
