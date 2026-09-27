import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts } from '../theme';
import { Button, Card } from './ui';

/** Labelled form row with an optional validation message underneath. */
export function Field({ label, error, children, hint }) {
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {children}
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export function Input({ style, multiline, ...props }) {
  return (
    <TextInput
      placeholderTextColor="rgba(233, 228, 214, 0.4)"
      selectionColor={colors.gold}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      style={[styles.input, multiline && styles.multiline, style]}
      {...props}
    />
  );
}

/**
 * Single-choice list — replaces <select> and radio groups from the web forms.
 * layout: 'chips' wraps compact pills; 'list' stacks full-width radio rows.
 */
export function Choice({ options, value, onChange, layout = 'list', accessibilityLabel }) {
  const chips = layout === 'chips';
  return (
    <View
      style={chips ? styles.chips : styles.list}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
    >
      {options.map((opt) => {
        const o = typeof opt === 'string' ? { value: opt, label: opt } : opt;
        const selected = value === o.value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            style={[
              chips ? styles.chip : styles.row,
              selected && (chips ? styles.chipSelected : styles.rowSelected),
            ]}
          >
            {!chips && (
              <View style={[styles.radio, selected && styles.radioOn]}>
                {selected ? <View style={styles.radioDot} /> : null}
              </View>
            )}
            <Text
              style={[
                chips ? styles.chipText : styles.rowText,
                selected && chips && styles.chipTextSelected,
              ]}
            >
              {o.label}
            </Text>
            {o.detail ? <Text style={styles.rowDetail}>{o.detail}</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

export function ErrorBanner({ children }) {
  if (!children) return null;
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.bannerText}>{children}</Text>
    </View>
  );
}

/** Post-submit confirmation card with a button to start over. */
export function SuccessNotice({ title, children, actionLabel, onAction }) {
  return (
    <Card style={styles.success}>
      <View style={styles.successIco}>
        <Text style={styles.successIcoText}>✓</Text>
      </View>
      <Text style={styles.successTitle}>{title}</Text>
      <Text style={styles.successBody}>{children}</Text>
      <Button title={actionLabel} onPress={onAction} style={{ alignSelf: 'stretch' }} />
    </Card>
  );
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const styles = StyleSheet.create({
  field: { marginBottom: 18 },
  label: {
    fontFamily: fonts.heading,
    color: colors.lightGold,
    fontSize: 12.5,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  hint: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 12.5, marginTop: 6, lineHeight: 18 },
  error: { fontFamily: fonts.serif, color: colors.error, fontSize: 13, marginTop: 6 },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 10,
    backgroundColor: 'rgba(10, 32, 56, 0.65)',
    color: colors.textLight,
    fontFamily: fonts.serif,
    fontSize: 15.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  multiline: { minHeight: 110 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: 'rgba(10, 32, 56, 0.5)',
  },
  chipSelected: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText: { fontFamily: fonts.serif, color: colors.textPrimary, fontSize: 14 },
  chipTextSelected: { color: colors.bgPrimary, fontFamily: fonts.serifMedium },
  list: { gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(10, 32, 56, 0.5)',
  },
  rowSelected: { borderColor: colors.gold, backgroundColor: 'rgba(200,160,70,0.12)' },
  rowText: { flex: 1, fontFamily: fonts.serif, color: colors.textPrimary, fontSize: 15 },
  rowDetail: { fontFamily: fonts.heading, color: colors.gold, fontSize: 13 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: colors.gold },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.gold },
  banner: {
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: 'rgba(229, 138, 123, 0.12)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  bannerText: { fontFamily: fonts.serif, color: colors.textLight, fontSize: 14, lineHeight: 20 },
  success: { alignItems: 'center', paddingVertical: 30 },
  successIco: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  successIcoText: { color: colors.gold, fontSize: 26 },
  successTitle: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 22, marginBottom: 10 },
  successBody: {
    fontFamily: fonts.serif,
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginBottom: 20,
  },
});
