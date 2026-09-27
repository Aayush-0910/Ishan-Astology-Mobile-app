import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Bullets, Button, Card, Icon, P, Screen, SectionHeader } from '../components/ui';
import { ABOUT } from '../data/content';
import { colors, fonts, radius } from '../theme';

export default function AboutScreen() {
  return (
    <Screen footer={<Button title="Book a reading" icon="calendar" onPress={() => router.push('/book')} style={{ flex: 1 }} />}>
      <View style={styles.hero}>
        <Text style={styles.om}>ॐ</Text>
        <Text style={styles.name}>ईशान · Ishan</Text>
        <Text style={styles.meaning}>“{ABOUT.nameMeaning}”</Text>
      </View>

      <SectionHeader title="Our story" />
      {ABOUT.story.map((p) => (
        <P key={p.slice(0, 24)}>{p}</P>
      ))}

      <SectionHeader title="Our approach" />
      <Text style={styles.quote}>{ABOUT.approachQuote}</Text>
      {ABOUT.approach.map((p) => (
        <P key={p.slice(0, 24)}>{p}</P>
      ))}

      <SectionHeader title="What guides the work" />
      <View style={{ gap: 10 }}>
        {ABOUT.principles.map((pr) => (
          <Card key={pr.title} style={styles.principle}>
            <Icon name={pr.icon} size={22} />
            <View style={{ flex: 1 }}>
              <Text style={styles.prTitle}>{pr.title}</Text>
              <Text style={styles.prBody}>{pr.body}</Text>
            </View>
          </Card>
        ))}
      </View>

      <SectionHeader title="Plainly said" />
      <Card style={{ gap: 16 }}>
        <Bullets items={ABOUT.is} />
        <Bullets items={ABOUT.isNot} icon="close-circle" iconColor={colors.error} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: 26,
    paddingHorizontal: 18,
  },
  om: { fontFamily: fonts.sanskrit, color: colors.gold, fontSize: 56, lineHeight: 76 },
  name: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 20, marginTop: 4 },
  meaning: { fontFamily: fonts.italic, color: colors.lightGold, fontSize: 17, lineHeight: 24, textAlign: 'center', marginTop: 10 },
  quote: {
    fontFamily: fonts.italic,
    color: colors.textLight,
    fontSize: 21,
    lineHeight: 28,
    borderLeftWidth: 2,
    borderLeftColor: colors.gold,
    paddingLeft: 12,
    marginBottom: 14,
  },
  principle: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  prTitle: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 14.5, marginBottom: 4 },
  prBody: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 13.5, lineHeight: 20 },
});
