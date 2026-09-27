import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Button, Icon } from '../../components/ui';
import { MandalaMark } from '../../components/Illustrations';
import { WHATSAPP_LINK } from '../../config/contact';
import { packageBySlug } from '../../data/services';
import { useAppStore } from '../../state/AppStore';
import { openLink } from '../../utils/openLink';
import { tap } from '../../utils/haptics';
import { colors, fonts, radius } from '../../theme';

const INITIAL_REPLIES = [
  'Career & Business',
  'Marriage & Timing',
  'Birth Time Rectification',
  'One quick question',
  'Baby / business name',
];

const GREETING =
  "Namaste! Welcome to **Ishan Astrology**.\n\nI'm Ishan's consultation assistant. I can point you to the right reading — **KP Astrology**, **Bhrigu Nadi (BNN)**, **Numerology** or **Horary** — and collect your details for Ishan ji.\n\nWhat brings you here today?";

const has = (t, words) => words.some((w) => t.includes(w));

/** Which consultation fits the concern, and why. */
function recommend(text) {
  const t = text.toLowerCase();
  if (has(t, ['quick', 'one question', 'horary', 'prashna', 'yes or no', 'yes/no', 'lost', 'missing'])) {
    return { slug: 'horary', why: 'For a single, time-bound question, Ishan casts an instant **KP Horary (Prashna)** chart — no birth details needed, answer in 24–48 hours.' };
  }
  if (has(t, ['name', 'spelling', 'numerology', 'baby'])) {
    return { slug: 'numerology', why: 'For baby names or business/name spelling, we combine **Name Numerology** with your KP natal chart signature.' };
  }
  if (has(t, ['yantra', 'remedy', 'remedies', 'oil'])) {
    return { slug: 'yantra', why: 'Remedies are prescribed from your chart: a **Yantra & Ritual Oils** package is matched to your current dasha periods.' };
  }
  if (has(t, ['marry', 'marriage', 'love', 'relationship'])) {
    return { slug: 'kp', why: 'For marriage timing and compatibility, Ishan uses **KP Astrology** to pinpoint timeframes down to planetary sub-lords, cross-verified with **Bhrigu Nadi (BNN)**.' };
  }
  if (has(t, ['job', 'career', 'promotion', 'work', 'business'])) {
    return { slug: 'kp', why: 'For career shifts, promotions and business timing, Ishan analyzes your active Dasha periods and house sub-lords using the flagship **KP Astrology** system.' };
  }
  if (has(t, ['birth time', 'rectif', 'unknown'])) {
    return { slug: 'kp', why: 'If your birth time is uncertain, Ishan performs **Birth Time Rectification** with **Bhrigu Nadi (BNN)**, matching past life events to planetary transits.' };
  }
  return { slug: 'kp', why: 'A **Full KP Consultation** integrates **KP Astrology**, **Bhrigu Nadi (BNN)** and **Numerology** for precise life guidance.' };
}

const EMPTY_INTAKE = { step: 0, slug: 'kp', name: '', dob: '', time: '', place: '', concern: '', contact: '' };

/**
 * Advance the scripted intake by one answer. With a saved profile the birth
 * questions are skipped. Returns the updated intake and the assistant's reply.
 */
function nextTurn(intake, answer, profile) {
  const s = { ...intake };
  switch (s.step) {
    case 0: {
      const rec = recommend(answer);
      s.concern = answer;
      s.slug = rec.slug;
      if (profile?.name && profile?.dob) {
        Object.assign(s, { name: profile.name, dob: profile.dob, time: profile.tob, place: profile.pob, step: 5 });
        return [s, `${rec.why}\n\nI have your saved details, **${profile.name}**. Lastly, how would you like to be contacted (**WhatsApp or Phone**), and what is your country/timezone?`];
      }
      s.step = 1;
      return [s, `${rec.why}\n\nTo prepare your consultation, may I have your **Full Name**?`];
    }
    case 1:
      s.name = answer;
      s.step = 2;
      return [s, `Thank you, **${s.name}**. What is your **Date of Birth** (e.g., 15 Aug 1992)?`];
    case 2:
      s.dob = answer;
      s.step = 3;
      return [s, 'Got it! What is your **Exact Time of Birth**? (Type "unknown" if you are not sure — it can be rectified.)'];
    case 3:
      s.time = answer;
      s.step = 4;
      return [s, 'Thank you. What is your **Place of Birth** (City, State, Country)?'];
    case 4:
      s.place = answer;
      s.step = 5;
      return [s, 'Understood. Lastly, how would you like to be contacted (**WhatsApp or Phone**), and what is your country/timezone?'];
    case 5: {
      s.contact = answer;
      s.step = 6;
      const pkg = packageBySlug(s.slug);
      return [
        s,
        'Wonderful! Here is what I have:\n\n' +
          `• **Name:** ${s.name}\n` +
          `• **DOB:** ${s.dob}\n` +
          `• **Time:** ${s.time}\n` +
          `• **Place:** ${s.place}\n` +
          `• **Concern:** ${s.concern}\n\n` +
          `Recommended: **${pkg.title}** (${pkg.priceLabel}). Book it right here, or continue on WhatsApp to talk it over with Ishan ji.`,
      ];
    }
    default:
      return [s, 'Anything else? You can book below, or tap "Start over" to ask about something new.'];
  }
}

const intakeMessage = (s) =>
  'Namaste Ishan Astrology,\n\nI would like to book a consultation. My details:\n' +
  `• Name: ${s.name}\n` +
  `• Date of Birth: ${s.dob}\n` +
  `• Time of Birth: ${s.time}\n` +
  `• Place of Birth: ${s.place}\n` +
  `• Concern: ${s.concern}\n` +
  `• Contact preference: ${s.contact}`;

/** Renders **bold** segments from the scripted replies. */
function Formatted({ text, style }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <Text style={style}>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <Text key={i} style={styles.bold}>
            {part.slice(2, -2)}
          </Text>
        ) : (
          part
        )
      )}
    </Text>
  );
}

function TypingDots() {
  return (
    <View style={[styles.msg, styles.assistant, styles.typing]} accessibilityLabel="Assistant is typing">
      <View style={styles.dot} />
      <View style={[styles.dot, { opacity: 0.7 }]} />
      <View style={[styles.dot, { opacity: 0.4 }]} />
    </View>
  );
}

export default function ChatScreen() {
  const { profile } = useAppStore();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(true);
  const [inputVal, setInputVal] = useState('');
  const [quickReplies, setQuickReplies] = useState(INITIAL_REPLIES);
  const [done, setDone] = useState(false);
  const [slug, setSlug] = useState('kp');
  const intake = useRef(EMPTY_INTAKE);
  const timers = useRef([]);
  const scrollRef = useRef(null);

  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const greet = () =>
    later(() => {
      setIsTyping(false);
      setMessages([{ role: 'assistant', text: GREETING }]);
    }, 700);

  const start = () => {
    intake.current = EMPTY_INTAKE;
    setMessages([]);
    setDone(false);
    setQuickReplies(INITIAL_REPLIES);
    setIsTyping(true);
    greet();
  };

  useEffect(() => {
    greet();
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = (textToSend) => {
    const query = (textToSend ?? inputVal).trim();
    if (!query || isTyping) return;
    tap();

    setMessages((m) => [...m, { role: 'user', text: query }]);
    setInputVal('');
    setQuickReplies([]);
    setIsTyping(true);

    const [next, reply] = nextTurn(intake.current, query, profile);
    intake.current = next;
    later(() => {
      setIsTyping(false);
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
      if (next.step >= 6) {
        setSlug(next.slug);
        setDone(true);
      }
    }, 800);
  };

  const pkg = packageBySlug(slug);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={styles.messages}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.intro}>
          <MandalaMark size={34} strong />
          <Text style={styles.introText}>Replies come from Ishan&apos;s assistant, not Ishan ji himself.</Text>
        </View>
        {messages.map((m, idx) => (
          <View key={idx} style={[styles.msg, m.role === 'user' ? styles.user : styles.assistant]}>
            <Formatted text={m.text} style={m.role === 'user' ? styles.userText : styles.assistantText} />
          </View>
        ))}
        {isTyping ? <TypingDots /> : null}

        {done && !isTyping ? (
          <View style={styles.doneActions}>
            <Button
              title={`Book ${pkg.title}`}
              icon="calendar"
              onPress={() => router.push(`/book?service=${pkg.slug}`)}
            />
            <Button
              title="Continue on WhatsApp"
              icon="logo-whatsapp"
              variant="whatsapp"
              onPress={() => openLink(`${WHATSAPP_LINK}?text=${encodeURIComponent(intakeMessage(intake.current))}`)}
            />
            <Button title="Start over" icon="refresh" variant="ghost" onPress={start} />
          </View>
        ) : null}
      </ScrollView>

      {quickReplies.length > 0 && !isTyping ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          keyboardShouldPersistTaps="handled"
          style={{ flexGrow: 0 }}
        >
          {quickReplies.map((reply) => (
            <Pressable key={reply} onPress={() => send(reply)} style={styles.chip} accessibilityRole="button">
              <Text style={styles.chipText}>{reply}</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Message"
          placeholderTextColor="rgba(233, 228, 214, 0.45)"
          value={inputVal}
          onChangeText={setInputVal}
          onSubmitEditing={() => send()}
          returnKeyType="send"
          selectionColor={colors.gold}
        />
        <Pressable
          onPress={() => send()}
          disabled={!inputVal.trim()}
          style={({ pressed }) => [styles.send, !inputVal.trim() && { opacity: 0.4 }, pressed && { opacity: 0.8 }]}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          <Icon name="arrow-up" size={22} color={colors.bgPrimary} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgPrimary },
  messages: { padding: 16, gap: 10 },
  intro: { alignItems: 'center', gap: 8, marginBottom: 8 },
  introText: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 12, textAlign: 'center' },
  msg: { maxWidth: '85%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  assistant: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderBottomLeftRadius: 5 },
  user: { alignSelf: 'flex-end', backgroundColor: colors.gold, borderBottomRightRadius: 5 },
  assistantText: { fontFamily: fonts.serif, color: colors.textPrimary, fontSize: 15, lineHeight: 22 },
  userText: { fontFamily: fonts.serif, color: colors.bgPrimary, fontSize: 15, lineHeight: 22 },
  bold: { fontFamily: fonts.serifMedium, color: colors.lightGold },
  typing: { flexDirection: 'row', gap: 5, paddingVertical: 14 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.gold },
  doneActions: { gap: 10, marginTop: 8 },
  chips: { gap: 8, paddingHorizontal: 16, paddingBottom: 10 },
  chip: {
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: { fontFamily: fonts.serif, color: colors.lightGold, fontSize: 13.5 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderGold,
    backgroundColor: colors.bgDeep,
  },
  input: {
    flex: 1,
    minHeight: 42,
    borderRadius: 21,
    paddingHorizontal: 16,
    color: colors.textLight,
    fontFamily: fonts.serif,
    fontSize: 15,
    backgroundColor: colors.surface,
  },
  send: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
