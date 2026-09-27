import React, { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';
import { Icon, ListGroup, ListRow, Screen } from '../components/ui';
import { FAQS } from '../data/content';
import { WHATSAPP_LINK } from '../config/contact';
import { tap } from '../utils/haptics';
import { colors, fonts, radius } from '../theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function Faq({ q, a }) {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    tap();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => !o);
  };
  return (
    <View style={styles.item}>
      <Pressable onPress={toggle} style={styles.q} accessibilityRole="button" accessibilityState={{ expanded: open }}>
        <Text style={styles.qText}>{q}</Text>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
      </Pressable>
      {open ? <Text style={styles.a}>{a}</Text> : null}
    </View>
  );
}

export default function FaqScreen() {
  return (
    <Screen>
      <View style={{ gap: 10 }}>
        {FAQS.map((f) => (
          <Faq key={f.q} q={f.q} a={f.a} />
        ))}
      </View>

      <ListGroup title="Still have a question?">
        <ListRow icon="logo-whatsapp" iconColor={colors.whatsapp} title="Ask on WhatsApp" href={WHATSAPP_LINK} />
      </ListGroup>

      <Text style={styles.disclaimer}>
        Readings are for guidance purposes and are not a substitute for medical, legal or financial
        advice.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: { backgroundColor: colors.surface, borderRadius: radius.md, overflow: 'hidden' },
  q: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  qText: { flex: 1, fontFamily: fonts.serifMedium, color: colors.textLight, fontSize: 15, lineHeight: 21 },
  a: {
    fontFamily: fonts.serif,
    color: colors.textMuted,
    fontSize: 14.5,
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  disclaimer: {
    fontFamily: fonts.serif,
    color: colors.textMuted,
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 24,
  },
});
