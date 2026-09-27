import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

const LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very good',
  5: 'Excellent',
};

/**
 * Renders a 1–5 star rating. The stars are decorative; the accessible label
 * carries the actual value so screen readers don't announce five glyphs.
 */
export function StarRating({ rating, size = 16 }) {
  const value = Math.max(0, Math.min(5, Number(rating) || 0));
  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={[styles.star, { fontSize: size }, i <= value && styles.lit]}>
          ★
        </Text>
      ))}
    </View>
  );
}

/** Interactive 1–5 star picker. Each star is its own labelled button. */
export function StarInput({ value, onChange }) {
  return (
    <View style={styles.inputWrap}>
      <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel="Your rating">
        {[1, 2, 3, 4, 5].map((i) => (
          <Pressable
            key={i}
            onPress={() => onChange(i)}
            hitSlop={6}
            accessibilityRole="radio"
            accessibilityState={{ checked: value === i }}
            accessibilityLabel={`${i} star${i > 1 ? 's' : ''} — ${LABELS[i]}`}
          >
            <Text style={[styles.star, styles.inputStar, i <= value && styles.lit]}>★</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.inputLabel}>{value ? LABELS[value] : 'Tap to rate'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 3 },
  star: { color: 'rgba(200,160,70,0.28)' },
  lit: { color: colors.gold },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  inputStar: { fontSize: 32, paddingHorizontal: 2 },
  inputLabel: { fontFamily: fonts.italic, color: colors.lightGold, fontSize: 17 },
});
