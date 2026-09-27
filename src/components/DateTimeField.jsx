import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { colors, fonts } from '../theme';

const pad = (n) => String(n).padStart(2, '0');

/** Date → 'YYYY-MM-DD' or 'HH:MM', the same strings the website's inputs produced. */
const toValue = (date, mode) =>
  mode === 'date'
    ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    : `${pad(date.getHours())}:${pad(date.getMinutes())}`;

/** 'YYYY-MM-DD' / 'HH:MM' → Date, falling back to a sensible starting point. */
const fromValue = (value, mode) => {
  const d = new Date();
  if (mode === 'date') {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return new Date(1990, 0, 1);
  }
  const m = /^(\d{2}):(\d{2})/.exec(value || '');
  d.setHours(m ? Number(m[1]) : 12, m ? Number(m[2]) : 0, 0, 0);
  return d;
};

const display = (value, mode) => {
  if (!value) return null;
  const d = fromValue(value, mode);
  return mode === 'date'
    ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

/**
 * Tappable field that opens the platform date or time picker.
 * Android uses the system dialog; iOS shows an inline spinner with a Done button.
 *
 * @param {'date'|'time'} mode
 * @param {string} value     'YYYY-MM-DD' for dates, 'HH:MM' (24h) for times
 * @param {(v: string) => void} onChange
 */
export default function DateTimeField({ mode, value, onChange, placeholder }) {
  const [iosOpen, setIosOpen] = useState(false);
  const current = fromValue(value, mode);

  const open = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: current,
        mode,
        is24Hour: false,
        maximumDate: mode === 'date' ? new Date() : undefined,
        onValueChange: (_e, date) => date && onChange(toValue(date, mode)),
      });
    } else {
      // Committing the shown value on open means "Done" without scrolling keeps it.
      if (!value) onChange(toValue(current, mode));
      setIosOpen((o) => !o);
    }
  };

  const shown = display(value, mode);

  return (
    <View>
      <Pressable
        onPress={open}
        style={[styles.field, iosOpen && styles.fieldOpen]}
        accessibilityRole="button"
        accessibilityLabel={shown ? `${placeholder}: ${shown}` : placeholder}
      >
        <Text style={[styles.text, !shown && styles.placeholder]}>{shown || placeholder}</Text>
        <Text style={styles.icon}>{mode === 'date' ? '📅' : '🕰'}</Text>
      </Pressable>

      {Platform.OS === 'ios' && iosOpen ? (
        <View style={styles.iosPanel}>
          <DateTimePicker
            value={current}
            mode={mode}
            display="spinner"
            themeVariant="dark"
            textColor={colors.textLight}
            maximumDate={mode === 'date' ? new Date() : undefined}
            onValueChange={(_e, date) => date && onChange(toValue(date, mode))}
          />
          <Pressable onPress={() => setIosOpen(false)} style={styles.done} accessibilityRole="button">
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 10,
    backgroundColor: 'rgba(10, 32, 56, 0.65)',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldOpen: { borderColor: colors.gold },
  text: { fontFamily: fonts.serif, color: colors.textLight, fontSize: 15.5 },
  placeholder: { color: 'rgba(233, 228, 214, 0.4)' },
  icon: { fontSize: 16 },
  iosPanel: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 12,
    backgroundColor: colors.bgDeep,
    overflow: 'hidden',
  },
  done: { alignItems: 'center', paddingVertical: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.borderGold },
  doneText: { fontFamily: fonts.heading, color: colors.gold, fontSize: 14, letterSpacing: 1 },
});
