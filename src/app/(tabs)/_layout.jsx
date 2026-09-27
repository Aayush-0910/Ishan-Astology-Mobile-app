import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router/js-tabs';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../../theme';
import { MandalaMark } from '../../components/Illustrations';

function TabGlyph({ glyph, color, sanskrit = false }) {
  return (
    <Text style={[styles.glyph, sanskrit && styles.glyphSanskrit, { color }]} accessible={false}>
      {glyph}
    </Text>
  );
}

function HeaderLogo() {
  return (
    <View style={styles.logo}>
      <View style={styles.logoIcon}>
        <Text style={styles.logoOm}>ॐ</Text>
      </View>
      <Text style={styles.logoText}>Ishan Astrology</Text>
    </View>
  );
}

function HeaderBookButton() {
  return (
    <Pressable
      onPress={() => router.navigate('/booking')}
      style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.8 }]}
      accessibilityRole="button"
      accessibilityLabel="Book a consultation"
    >
      <Text style={styles.headerBtnText}>Book</Text>
    </Pressable>
  );
}

/** Floating mandala button that opens the consultation assistant. */
function ChatLauncher() {
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      onPress={() => router.push('/chat')}
      style={({ pressed }) => [
        styles.launcher,
        { bottom: 64 + Math.max(insets.bottom, 8) },
        pressed && { transform: [{ scale: 0.95 }] },
      ]}
      accessibilityRole="button"
      accessibilityLabel="Open astrology consultation assistant"
    >
      <MandalaMark size={40} />
    </Pressable>
  );
}

export default function TabsLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.bgPrimary,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.borderGold,
          },
          headerShadowVisible: false,
          headerTitle: () => <HeaderLogo />,
          headerTitleAlign: 'left',
          headerRight: () => <HeaderBookButton />,
          tabBarStyle: {
            backgroundColor: colors.bgDeep,
            borderTopColor: colors.borderGold,
          },
          tabBarActiveTintColor: colors.gold,
          tabBarInactiveTintColor: 'rgba(233, 228, 214, 0.55)',
          tabBarLabelStyle: { fontFamily: fonts.headingRegular, fontSize: 10 },
          sceneStyle: { backgroundColor: colors.bgPrimary },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Services',
            tabBarIcon: ({ color }) => <TabGlyph glyph="✦" color={color} />,
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: 'About',
            tabBarIcon: ({ color }) => <TabGlyph glyph="ॐ" color={color} sanskrit />,
          }}
        />
        <Tabs.Screen
          name="pricing"
          options={{
            title: 'Pricing',
            tabBarIcon: ({ color }) => <TabGlyph glyph="₹" color={color} />,
          }}
        />
        <Tabs.Screen
          name="booking"
          options={{
            title: 'Book',
            tabBarIcon: ({ color }) => <TabGlyph glyph="☉" color={color} />,
          }}
        />
        <Tabs.Screen
          name="reviews"
          options={{
            title: 'Reviews',
            tabBarIcon: ({ color }) => <TabGlyph glyph="★" color={color} />,
          }}
        />
      </Tabs>
      <ChatLauncher />
    </View>
  );
}

const styles = StyleSheet.create({
  glyph: { fontSize: 19, lineHeight: 24 },
  glyphSanskrit: { fontFamily: fonts.sanskrit, fontSize: 20 },
  logo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoOm: { fontFamily: fonts.sanskrit, color: colors.gold, fontSize: 18, lineHeight: 26 },
  logoText: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 16, letterSpacing: 1 },
  headerBtn: {
    marginRight: 16,
    backgroundColor: colors.gold,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  headerBtnText: { fontFamily: fonts.heading, color: colors.bgPrimary, fontSize: 12, letterSpacing: 1 },
  launcher: {
    position: 'absolute',
    right: 18,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.bgDeep,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
