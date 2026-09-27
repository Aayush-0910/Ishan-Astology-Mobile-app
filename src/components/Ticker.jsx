import React, { useEffect, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

/**
 * One endlessly scrolling row of pills. The item set is rendered twice side by
 * side and the row slides by exactly one set's width, so the loop is seamless.
 *
 * @param {Array<{tag: string, label: string, sanskrit?: boolean}>} items
 * @param {boolean} [reverse=false]  scroll right-to-left instead of left-to-right
 */
function TickerRow({ items, reverse = false, duration = 26000 }) {
  const [setWidth, setSetWidth] = useState(0);
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!setWidth) return undefined;
    progress.setValue(0);
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );
    loop.start();
    return () => loop.stop();
  }, [setWidth, duration, progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: reverse ? [0, -setWidth] : [-setWidth, 0],
  });

  const renderSet = (copy) => (
    <View
      style={styles.set}
      key={copy}
      onLayout={copy === 0 ? (e) => setSetWidth(e.nativeEvent.layout.width) : undefined}
    >
      {items.map((it) => (
        <View style={styles.item} key={`${copy}-${it.label}`}>
          <Text style={it.sanskrit ? styles.tagSanskrit : styles.tag}>{it.tag}</Text>
          <Text style={styles.label}>{it.label}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.rowClip}>
      <Animated.View style={[styles.track, { transform: [{ translateX }] }]}>
        {renderSet(0)}
        {renderSet(1)}
      </Animated.View>
    </View>
  );
}

const ROMAN = [
  { tag: 'I', label: 'KP Astrology' },
  { tag: 'II', label: 'Bhrigu Nadi (BNN)' },
  { tag: 'III', label: 'Numerology' },
  { tag: 'IV', label: 'Horary (Prashna)' },
  { tag: 'V', label: 'Yantra & Oils' },
];

const SANSKRIT = [
  { tag: 'कृष्णमूर्ति पद्धति', label: 'KP System', sanskrit: true },
  { tag: 'भृगु नाडी', label: 'Bhrigu Nadi', sanskrit: true },
  { tag: 'अंक शास्त्र', label: 'Numerology', sanskrit: true },
  { tag: 'प्रश्न कुण्डली', label: 'Horary', sanskrit: true },
  { tag: 'यंत्र एवं तेल विधि', label: 'Yantras & Oils', sanskrit: true },
];

export default function SystemsTicker() {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Disciplined Systems of Practice</Text>
      <TickerRow items={ROMAN} />
      <TickerRow items={SANSKRIT} reverse duration={32000} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 28,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderGold,
    backgroundColor: 'rgba(10, 32, 56, 0.6)',
    gap: 12,
  },
  heading: {
    fontFamily: fonts.heading,
    color: colors.gold,
    fontSize: 12,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 6,
  },
  rowClip: { overflow: 'hidden' },
  track: { flexDirection: 'row' },
  set: { flexDirection: 'row' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: colors.surfaceCardSubtle,
  },
  tag: { fontFamily: fonts.heading, color: colors.gold, fontSize: 12 },
  tagSanskrit: { fontFamily: fonts.sanskrit, color: colors.gold, fontSize: 14 },
  label: { fontFamily: fonts.serif, color: colors.textPrimary, fontSize: 14 },
});
