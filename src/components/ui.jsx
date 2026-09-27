import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '../theme';
import { openLink } from '../utils/openLink';

/** Small gold caps label with an optional Devanagari suffix: "Services  सेवाएँ". */
export function SectionLabel({ children, sanskrit, center = false }) {
  return (
    <Text style={[styles.sectionLabel, center && styles.center]}>
      {children}
      {sanskrit ? <Text style={styles.sectionLabelSanskrit}>{`  ${sanskrit}`}</Text> : null}
    </Text>
  );
}

/** Italic gold emphasis inside a heading, the app's version of <em>. */
export function Em({ children, style }) {
  return <Text style={[styles.em, style]}>{children}</Text>;
}

export function H1({ children, style, center = false }) {
  return <Text style={[styles.h1, center && styles.center, style]}>{children}</Text>;
}

export function H2({ children, style, center = false }) {
  return <Text style={[styles.h2, center && styles.center, style]}>{children}</Text>;
}

export function H3({ children, style }) {
  return <Text style={[styles.h3, style]}>{children}</Text>;
}

export function P({ children, style, muted = false, center = false }) {
  return (
    <Text style={[styles.p, muted && styles.muted, center && styles.center, style]}>
      {children}
    </Text>
  );
}

export function SanskritSub({ children, center = false }) {
  return <Text style={[styles.sanskritSub, center && styles.center]}>{children}</Text>;
}

/** Pill tag above a system heading. tone: 'gold' (default) | 'teal'. */
export function SystemTag({ children, tone = 'gold' }) {
  const teal = tone === 'teal';
  return (
    <View style={[styles.tag, teal && styles.tagTeal]}>
      <Text style={[styles.tagText, teal && styles.tagTextTeal]}>{children}</Text>
    </View>
  );
}

export function LineAccent({ center = true }) {
  return <View style={[styles.lineAccent, center && { alignSelf: 'center' }]} />;
}

export function FeatureList({ items }) {
  return (
    <View style={styles.featureList}>
      {items.map((item) => (
        <View style={styles.featureRow} key={item}>
          <Text style={styles.featureStar}>✦</Text>
          <Text style={styles.featureText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

/** Page section with the site's alternating background bands. */
export function Section({ children, alt = false, style, onLayout }) {
  return (
    <View style={[styles.section, alt && styles.sectionAlt, style]} onLayout={onLayout}>
      {children}
    </View>
  );
}

/** Centered intro block used above grids: accent line, label, heading, blurb. */
export function SectionIntro({ label, sanskrit, title, children }) {
  return (
    <View style={styles.intro}>
      <LineAccent />
      <SectionLabel sanskrit={sanskrit} center>
        {label}
      </SectionLabel>
      <H2 center>{title}</H2>
      {children ? <P center muted style={{ marginTop: 12 }}>{children}</P> : null}
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/**
 * Button that either runs onPress or follows href (in-app path or external URL).
 * variant: 'primary' (gold fill) | 'secondary' (gold outline) | 'teal'.
 */
export function Button({
  title,
  onPress,
  href,
  variant = 'primary',
  icon,
  disabled = false,
  loading = false,
  style,
  accessibilityLabel,
}) {
  const handlePress = () => {
    if (disabled || loading) return;
    if (onPress) onPress();
    else if (href) openLink(href);
  };

  const textStyle = [
    styles.btnText,
    variant === 'primary' ? styles.btnTextPrimary : styles.btnTextSecondary,
  ];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={({ pressed }) => [
        styles.btn,
        variant === 'primary' && styles.btnPrimary,
        variant === 'secondary' && styles.btnSecondary,
        variant === 'teal' && styles.btnTeal,
        pressed && { opacity: 0.8 },
        (disabled || loading) && styles.btnDisabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.bgPrimary : colors.gold} />
      ) : (
        <Text style={textStyle}>
          {title}
          {icon ? `  ${icon}` : ''}
        </Text>
      )}
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  sectionLabel: {
    fontFamily: fonts.heading,
    color: colors.gold,
    fontSize: 12,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  sectionLabelSanskrit: {
    fontFamily: fonts.sanskrit,
    color: colors.lightGold,
    letterSpacing: 0,
    textTransform: 'none',
    fontSize: 14,
  },
  em: {
    fontFamily: fonts.italic,
    color: colors.lightGold,
  },
  h1: {
    fontFamily: fonts.heading,
    color: colors.textLight,
    fontSize: 34,
    lineHeight: 42,
    marginBottom: 16,
  },
  h2: {
    fontFamily: fonts.heading,
    color: colors.textLight,
    fontSize: 26,
    lineHeight: 33,
    marginBottom: 10,
  },
  h3: {
    fontFamily: fonts.heading,
    color: colors.textLight,
    fontSize: 17,
    lineHeight: 23,
    marginBottom: 8,
  },
  p: {
    fontFamily: fonts.serif,
    color: colors.textPrimary,
    fontSize: 15.5,
    lineHeight: 25,
    marginBottom: 14,
  },
  muted: { color: colors.textMuted },
  sanskritSub: {
    fontFamily: fonts.sanskrit,
    color: colors.gold,
    fontSize: 17,
    marginBottom: 18,
    opacity: 0.9,
  },
  tag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: 'rgba(200,160,70,0.1)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 16,
  },
  tagTeal: {
    borderColor: colors.tealLight,
    backgroundColor: 'rgba(31,111,107,0.2)',
  },
  tagText: {
    fontFamily: fonts.heading,
    color: colors.gold,
    fontSize: 10.5,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  tagTextTeal: { color: colors.tealLight },
  lineAccent: {
    width: 56,
    height: 1.5,
    backgroundColor: colors.gold,
    marginBottom: 18,
    opacity: 0.8,
  },
  featureList: { marginTop: 6, gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  featureStar: { color: colors.gold, fontSize: 13, lineHeight: 22 },
  featureText: {
    flex: 1,
    fontFamily: fonts.serif,
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing.section,
  },
  sectionAlt: {
    backgroundColor: 'rgba(20, 54, 91, 0.5)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderGold,
  },
  intro: { alignItems: 'center', marginBottom: 26 },
  card: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 14,
    padding: 20,
  },
  btn: {
    minHeight: 50,
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  btnPrimary: { backgroundColor: colors.gold, borderColor: colors.gold },
  btnSecondary: { backgroundColor: 'transparent', borderColor: colors.gold },
  btnTeal: { backgroundColor: 'rgba(31, 111, 107, 0.25)', borderColor: colors.tealLight },
  btnDisabled: { opacity: 0.45 },
  btnText: {
    fontFamily: fonts.heading,
    fontSize: 13.5,
    letterSpacing: 1,
    textAlign: 'center',
  },
  btnTextPrimary: { color: colors.bgPrimary },
  btnTextSecondary: { color: colors.lightGold },
});
