import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radius, spacing } from '../theme';
import { openLink } from '../utils/openLink';
import { tap } from '../utils/haptics';

export function Icon({ name, size = 20, color = colors.gold, style }) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}

/* ─────────────────────────── Layout ─────────────────────────── */

/**
 * Scrolling screen body. `footer` renders a sticky action bar pinned above the
 * home indicator (e.g. a "Book" button), outside the scroll area.
 */
export function Screen({ children, footer, scrollRef, contentStyle, refreshControl }) {
  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.screenContent, contentStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        {children}
      </ScrollView>
      {footer ? <StickyFooter>{footer}</StickyFooter> : null}
    </View>
  );
}

export function StickyFooter({ children }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>{children}</View>
  );
}

/** Section title row with an optional trailing action ("See all"). */
export function SectionHeader({ title, action, onAction, style }) {
  return (
    <View style={[styles.sectionHeader, style]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable
          onPress={() => {
            tap();
            onAction?.();
          }}
          hitSlop={8}
          accessibilityRole="button"
        >
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Card({ children, style, onPress, accessibilityLabel }) {
  if (!onPress) return <View style={[styles.card, style]}>{children}</View>;
  return (
    <Pressable
      onPress={() => {
        tap();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.card, style, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

/** Grouped list (iOS settings style): rows separated by hairlines. */
export function ListGroup({ title, children, style }) {
  const rows = React.Children.toArray(children).filter(Boolean);
  return (
    <View style={style}>
      {title ? <Text style={styles.groupTitle}>{title}</Text> : null}
      <View style={styles.group}>
        {rows.map((row, i) => (
          <View key={i}>
            {i > 0 ? <View style={styles.rowSep} /> : null}
            {row}
          </View>
        ))}
      </View>
    </View>
  );
}

/** Tappable list row: leading icon, title, optional subtitle/value, chevron. */
export function ListRow({ icon, iconColor, title, subtitle, value, onPress, href, destructive, chevron = true }) {
  const handle = () => {
    tap();
    if (onPress) onPress();
    else if (href) openLink(href);
  };
  return (
    <Pressable
      onPress={handle}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surfaceRaised }]}
    >
      {icon ? (
        <View style={styles.rowIcon}>
          <Icon name={icon} size={19} color={destructive ? colors.error : iconColor || colors.gold} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, destructive && { color: colors.error }]}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      {chevron ? <Icon name="chevron-forward" size={18} color={colors.textMuted} /> : null}
    </Pressable>
  );
}

/* ─────────────────────────── Text ─────────────────────────── */

export function Title({ children, style }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function P({ children, style, muted = false }) {
  return <Text style={[styles.p, muted && styles.muted, style]}>{children}</Text>;
}

export function Em({ children, style }) {
  return <Text style={[styles.em, style]}>{children}</Text>;
}

export function Sanskrit({ children, style }) {
  return <Text style={[styles.sanskrit, style]}>{children}</Text>;
}

export function Pill({ children, tone = 'gold', icon }) {
  const toneStyle = {
    gold: { bg: 'rgba(200,160,70,0.14)', fg: colors.lightGold },
    teal: { bg: 'rgba(46,157,152,0.18)', fg: colors.tealLight },
    amber: { bg: 'rgba(224,168,74,0.16)', fg: colors.amber },
    muted: { bg: 'rgba(233,228,214,0.08)', fg: colors.textMuted },
    light: { bg: 'rgba(255,255,255,0.18)', fg: '#ffffff' },
  }[tone];
  return (
    <View style={[styles.pill, { backgroundColor: toneStyle.bg }]}>
      {icon ? <Icon name={icon} size={12} color={toneStyle.fg} /> : null}
      <Text style={[styles.pillText, { color: toneStyle.fg }]}>{children}</Text>
    </View>
  );
}

export function Bullets({ items, icon = 'checkmark-circle', iconColor = colors.tealLight }) {
  return (
    <View style={{ gap: 10 }}>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <Icon name={icon} size={18} color={iconColor} style={{ marginTop: 2 }} />
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

/* ─────────────────────────── Buttons ─────────────────────────── */

/**
 * variant: 'primary' (gold fill) | 'secondary' (outline) | 'ghost' | 'whatsapp'
 * Runs onPress, or follows href (in-app path or external URL).
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
    tap();
    if (onPress) onPress();
    else if (href) openLink(href);
  };

  const fg = {
    primary: colors.bgPrimary,
    secondary: colors.lightGold,
    ghost: colors.gold,
    whatsapp: '#ffffff',
  }[variant];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={({ pressed }) => [
        styles.btn,
        styles[`btn_${variant}`],
        pressed && styles.pressed,
        (disabled || loading) && styles.btnDisabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon ? <Icon name={icon} size={18} color={fg} /> : null}
          <Text style={[styles.btnText, { color: fg }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

/** Round icon tile with a caption — used for quick actions. */
export function ActionTile({ icon, label, onPress, tint = colors.gold }) {
  return (
    <Pressable
      onPress={() => {
        tap();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      <View style={[styles.tileIcon, { backgroundColor: `${tint}22` }]}>
        <Icon name={icon} size={22} color={tint} />
      </View>
      <Text style={styles.tileLabel} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

export function EmptyState({ icon, title, body, action }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Icon name={icon} size={34} color={colors.gold} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {body ? <Text style={styles.emptyBody}>{body}</Text> : null}
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgPrimary },
  screenContent: { padding: spacing.gutter, paddingBottom: 40 },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: spacing.gutter,
    paddingTop: 12,
    backgroundColor: colors.bgDeep,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderGold,
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.985 }] },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.section,
    marginBottom: 12,
  },
  sectionTitle: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 17, letterSpacing: 0.5 },
  sectionAction: { fontFamily: fonts.serifMedium, color: colors.gold, fontSize: 14 },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderGold,
    padding: 16,
  },

  groupTitle: {
    fontFamily: fonts.headingRegular,
    color: colors.textMuted,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 24,
  },
  group: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderGold,
  },
  rowSep: { height: StyleSheet.hairlineWidth, backgroundColor: colors.separator, marginLeft: 56 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 13, minHeight: 52 },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(200,160,70,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { fontFamily: fonts.serifMedium, color: colors.textLight, fontSize: 15.5 },
  rowSubtitle: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 13, marginTop: 2 },
  rowValue: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 14 },

  title: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 24, lineHeight: 31, marginBottom: 6 },
  p: { fontFamily: fonts.serif, color: colors.textPrimary, fontSize: 15, lineHeight: 23, marginBottom: 12 },
  muted: { color: colors.textMuted },
  em: { fontFamily: fonts.italic, color: colors.lightGold },
  sanskrit: { fontFamily: fonts.sanskrit, color: colors.gold, fontSize: 15 },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  pillText: { fontFamily: fonts.serifMedium, fontSize: 11.5 },

  bulletRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  bulletText: { flex: 1, fontFamily: fonts.serif, color: colors.textPrimary, fontSize: 15, lineHeight: 22 },

  btn: {
    flexDirection: 'row',
    gap: 8,
    minHeight: 50,
    borderRadius: radius.md,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  btn_primary: { backgroundColor: colors.gold },
  btn_secondary: { borderColor: colors.gold },
  btn_ghost: { backgroundColor: 'rgba(200,160,70,0.1)' },
  btn_whatsapp: { backgroundColor: '#1FA855' },
  btnDisabled: { opacity: 0.4 },
  btnText: { fontFamily: fonts.heading, fontSize: 14, letterSpacing: 0.6 },

  tile: { flex: 1, alignItems: 'center', gap: 8 },
  tileIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  tileLabel: { fontFamily: fonts.serifMedium, color: colors.textPrimary, fontSize: 12.5 },

  empty: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24, gap: 10 },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(200,160,70,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  emptyTitle: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 19, textAlign: 'center' },
  emptyBody: {
    fontFamily: fonts.serif,
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 12,
  },
});
