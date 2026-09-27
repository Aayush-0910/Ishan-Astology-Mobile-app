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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MandalaMark } from '../components/Illustrations';
import { WHATSAPP_LINK } from '../config/contact';
import { openLink } from '../utils/openLink';
import { colors, fonts } from '../theme';

const INITIAL_REPLIES = [
  'Career & Business',
  'Marriage & Timing',
  'Birth Time Rectification',
  'KP Horary Question',
];

const GREETING =
  "Namaste! Welcome to **Ishan Astrology**.\n\nI am Ishan's AI Consultation Assistant. I can help guide you through our **KP Astrology**, **Bhrigu Nadi (BNN)**, and **Numerology** services or collect your details for a direct reading.\n\nWhat brings you here today?";

function systemInfoFor(text) {
  const t = text.toLowerCase();
  if (['marry', 'marriage', 'love', 'relationship'].some((k) => t.includes(k))) {
    return 'For marriage timing and relationship compatibility, Ishan uses **KP Astrology** to pinpoint precise timeframes down to planetary sub-lords, cross-verified with **Bhrigu Nadi (BNN)**.';
  }
  if (['job', 'career', 'promotion', 'work', 'business'].some((k) => t.includes(k))) {
    return 'For career shifts, job promotions, and business timing, Ishan analyzes your active Dasha periods and house sub-lords using our flagship **KP Astrology System**.';
  }
  if (['birth time', 'rectify', 'unknown'].some((k) => t.includes(k))) {
    return 'If your birth time is uncertain, Ishan performs **Birth Time Rectification** using **Bhrigu Nadi (BNN)** by matching past life events to planetary transits.';
  }
  if (['name', 'spelling', 'numerology'].some((k) => t.includes(k))) {
    return 'For baby names or optimizing business/name spelling frequencies, we combine **Name Numerology** with your KP natal chart signature.';
  }
  if (['horary', 'prashna'].some((k) => t.includes(k))) {
    return 'For direct, single questions without birth details, Ishan casts an instant **KP Horary (Prashna)** chart.';
  }
  return 'Ishan offers comprehensive consultations integrating **KP Astrology**, **Bhrigu Nadi (BNN)**, and **Numerology** for precise life guidance.';
}

/**
 * Advance the scripted intake by one answer.
 * Returns the updated intake record and the assistant's reply.
 */
function nextTurn(intake, answer) {
  const s = { ...intake };
  switch (s.step) {
    case 0:
      s.concern = answer;
      s.step = 1;
      return [s, `${systemInfoFor(answer)}\n\nTo prepare your consultation details for Ishan, may I please have your **Full Name**?`];
    case 1:
      s.name = answer;
      s.step = 2;
      return [s, `Thank you, **${s.name}**. What is your **Date of Birth** (e.g., 15 Aug 1992)?`];
    case 2:
      s.dob = answer;
      s.step = 3;
      return [s, 'Got it! Next, what is your **Exact Time of Birth**? (If you don\'t know it, type "unknown" for Birth Time Rectification).'];
    case 3:
      s.time = answer;
      s.step = 4;
      return [s, 'Thank you. What is your **Place of Birth** (City, State, Country)?'];
    case 4:
      s.place = answer;
      s.step = 5;
      return [s, 'Understood. Lastly, what is your preferred contact method (**WhatsApp or Phone**) and your country/timezone?'];
    case 5:
      s.contact = answer;
      s.step = 6;
      return [
        s,
        'Wonderful! I have recorded your intake details:\n\n' +
          `• **Name:** ${s.name}\n` +
          `• **DOB:** ${s.dob}\n` +
          `• **Time:** ${s.time}\n` +
          `• **Place:** ${s.place}\n` +
          `• **Concern:** ${s.concern}\n\n` +
          'Ishan will personally review your chart. Tap below to continue on WhatsApp to schedule your session!',
      ];
    default:
      return [s, 'How else can I assist you with your consultation today?'];
  }
}

/** Collected intake as a WhatsApp message, so nothing has to be typed twice. */
const intakeMessage = (s) =>
  'Namaste Ishan Astrology,\n\nI would like to book a consultation. My details:\n' +
  `• Name: ${s.name}\n` +
  `• Date of Birth: ${s.dob}\n` +
  `• Time of Birth: ${s.time}\n` +
  `• Place of Birth: ${s.place}\n` +
  `• Concern: ${s.concern}\n` +
  `• Contact preference: ${s.contact}`;

/** Renders **bold** segments and line breaks from the scripted replies. */
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
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(true);
  const [inputVal, setInputVal] = useState('');
  const [quickReplies, setQuickReplies] = useState(INITIAL_REPLIES);
  const [done, setDone] = useState(false); // intake complete, offer WhatsApp
  const intake = useRef({ step: 0, name: '', dob: '', time: '', place: '', concern: '', contact: '' });
  const timers = useRef([]);
  const scrollRef = useRef(null);

  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  };

  useEffect(() => {
    later(() => {
      setIsTyping(false);
      setMessages([{ role: 'assistant', text: GREETING }]);
    }, 800);
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const send = (textToSend) => {
    const query = (textToSend ?? inputVal).trim();
    if (!query || isTyping) return;

    setMessages((m) => [...m, { role: 'user', text: query }]);
    setInputVal('');
    setQuickReplies([]);
    setIsTyping(true);

    const [next, reply] = nextTurn(intake.current, query);
    intake.current = next;
    later(() => {
      setIsTyping(false);
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
      if (next.step >= 6) setDone(true);
    }, 850);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 18 : insets.top + 12 }]}>
        <View style={styles.brandRow}>
          <MandalaMark size={26} strong />
          <Text style={styles.brandTitle}>ISHAN ASTROLOGY</Text>
        </View>
        <Text style={styles.brandTag}>Be Blessed by the Divine</Text>
        <Pressable
          onPress={() => router.back()}
          style={[styles.close, { top: Platform.OS === 'ios' ? 14 : insets.top + 8 }]}
          accessibilityRole="button"
          accessibilityLabel="Close chat"
          hitSlop={10}
        >
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((m, idx) => (
          <View key={idx} style={[styles.msg, m.role === 'user' ? styles.user : styles.assistant]}>
            <Formatted
              text={m.text}
              style={m.role === 'user' ? styles.userText : styles.assistantText}
            />
          </View>
        ))}
        {isTyping ? <TypingDots /> : null}
      </ScrollView>

      {quickReplies.length > 0 && !isTyping && !done ? (
        <View style={styles.chips}>
          {quickReplies.map((reply) => (
            <Pressable key={reply} onPress={() => send(reply)} style={styles.chip} accessibilityRole="button">
              <Text style={styles.chipText}>{reply}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {done ? (
        <View style={styles.chips}>
          <Pressable
            onPress={() => openLink(`${WHATSAPP_LINK}?text=${encodeURIComponent(intakeMessage(intake.current))}`)}
            style={[styles.chip, styles.whatsapp]}
            accessibilityRole="link"
          >
            <Text style={[styles.chipText, { color: '#fff', fontFamily: fonts.serifMedium }]}>
              Continue on WhatsApp →
            </Text>
          </Pressable>
        </View>
      ) : null}

      <View style={[styles.inputRow, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TextInput
          style={styles.input}
          placeholder="Type your question…"
          placeholderTextColor="rgba(233, 228, 214, 0.45)"
          value={inputVal}
          onChangeText={setInputVal}
          onSubmitEditing={() => send()}
          returnKeyType="send"
          selectionColor={colors.gold}
        />
        <Pressable
          onPress={() => send()}
          style={({ pressed }) => [styles.send, pressed && { opacity: 0.8 }]}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          <Text style={styles.sendText}>➤</Text>
        </Pressable>
      </View>
      <Text style={[styles.footerNote, { marginBottom: insets.bottom ? 0 : 6 }]}>
        KP Astrology · BNN · Numerology
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    backgroundColor: colors.teal,
    paddingHorizontal: 20,
    paddingBottom: 14,
    alignItems: 'center',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandTitle: { fontFamily: fonts.heading, color: '#fff', fontSize: 16, letterSpacing: 2.5 },
  brandTag: { fontFamily: fonts.italic, color: colors.lightGold, fontSize: 15, marginTop: 4 },
  close: { position: 'absolute', right: 16 },
  closeText: { color: '#fff', fontSize: 20 },
  messages: { flex: 1 },
  messagesContent: { padding: 16, gap: 10 },
  msg: { maxWidth: '85%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  assistant: {
    alignSelf: 'flex-start',
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderBottomLeftRadius: 4,
  },
  user: { alignSelf: 'flex-end', backgroundColor: colors.gold, borderBottomRightRadius: 4 },
  assistantText: { fontFamily: fonts.serif, color: colors.textPrimary, fontSize: 15, lineHeight: 22 },
  userText: { fontFamily: fonts.serif, color: colors.bgPrimary, fontSize: 15, lineHeight: 22 },
  bold: { fontFamily: fonts.serifMedium, color: colors.lightGold },
  typing: { flexDirection: 'row', gap: 5, paddingVertical: 14 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.gold },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingBottom: 10 },
  chip: {
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: { fontFamily: fonts.serif, color: colors.lightGold, fontSize: 13.5 },
  whatsapp: { backgroundColor: '#1a6b64', borderColor: '#1a6b64' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderGold,
    backgroundColor: colors.bgDeep,
  },
  input: {
    flex: 1,
    minHeight: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.borderGold,
    paddingHorizontal: 16,
    color: colors.textLight,
    fontFamily: fonts.serif,
    fontSize: 15,
    backgroundColor: colors.bgPrimary,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: { color: colors.bgPrimary, fontSize: 18 },
  footerNote: {
    fontFamily: fonts.headingRegular,
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 1.5,
    textAlign: 'center',
    backgroundColor: colors.bgDeep,
    paddingBottom: 6,
  },
});
