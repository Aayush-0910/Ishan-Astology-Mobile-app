import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { Card, Icon, ListGroup, ListRow, Screen } from '../../components/ui';
import { EMAIL, PHONES, SOCIAL, WHATSAPP_LINK } from '../../config/contact';
import { useAppStore } from '../../state/AppStore';
import { colors, fonts } from '../../theme';

const SOCIAL_ICONS = { YouTube: 'logo-youtube', Facebook: 'logo-facebook', Instagram: 'logo-instagram' };

const prettyDate = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return '';
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function ProfileScreen() {
  const { profile, bookings } = useAppStore();
  const name = profile?.name?.trim();

  return (
    <Screen>
      <Card onPress={() => router.push('/profile-edit')} style={styles.me} accessibilityLabel="Edit my birth details">
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name ? name[0].toUpperCase() : 'ॐ'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{name || 'Add your birth details'}</Text>
          <Text style={styles.sub} numberOfLines={2}>
            {name && profile?.dob
              ? [prettyDate(profile.dob), profile.tob, profile.pob].filter(Boolean).join(' · ')
              : 'Saved on this phone to fill in bookings for you'}
          </Text>
        </View>
        <Icon name="create-outline" size={20} />
      </Card>

      <ListGroup title="Consultations">
        <ListRow
          icon="calendar-outline"
          title="My consultations"
          value={bookings.length ? String(bookings.length) : undefined}
          onPress={() => router.navigate('/bookings')}
        />
        <ListRow icon="add-circle-outline" title="Book a reading" onPress={() => router.push('/book')} />
      </ListGroup>

      <ListGroup title="Get in touch">
        <ListRow icon="logo-whatsapp" iconColor={colors.whatsapp} title="WhatsApp" subtitle="Fastest way to reach us" href={WHATSAPP_LINK} />
        {PHONES.map((p) => (
          <ListRow key={p.href} icon="call-outline" title={p.label} href={p.href} />
        ))}
        <ListRow icon="mail-outline" title={EMAIL} href={`mailto:${EMAIL}`} />
      </ListGroup>

      <ListGroup title="Your voice">
        <ListRow icon="star-outline" title="Leave a review" onPress={() => router.push('/reviews')} />
        <ListRow icon="chatbox-ellipses-outline" title="Send private feedback" onPress={() => router.push('/reviews?tab=feedback')} />
      </ListGroup>

      <ListGroup title="About">
        <ListRow icon="information-circle-outline" title="About Ishan" onPress={() => router.push('/about')} />
        <ListRow icon="help-circle-outline" title="Help & FAQ" onPress={() => router.push('/faq')} />
        {SOCIAL.map((s) => (
          <ListRow key={s.href} icon={SOCIAL_ICONS[s.label] || 'globe-outline'} title={s.label} href={s.href} />
        ))}
      </ListGroup>

      <Text style={styles.foot}>
        <Text style={{ fontFamily: fonts.sanskrit, color: colors.gold }}>ॐ</Text> Be blessed by the Divine
      </Text>
      <Text style={styles.version}>
        All readings are for guidance purposes · v{Constants.expoConfig?.version ?? '1.0.0'}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  me: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgDeep,
  },
  avatarText: { fontFamily: fonts.sanskrit, color: colors.gold, fontSize: 24 },
  name: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 17 },
  sub: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 13, marginTop: 3 },
  foot: {
    fontFamily: fonts.headingRegular,
    color: colors.lightGold,
    fontSize: 12,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 32,
    textTransform: 'uppercase',
  },
  version: { fontFamily: fonts.serif, color: colors.textMuted, fontSize: 11.5, textAlign: 'center', marginTop: 6 },
});
