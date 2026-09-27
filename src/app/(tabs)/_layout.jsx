import React from 'react';
import { StyleSheet } from 'react-native';
import { Tabs } from 'expo-router/js-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, fonts } from '../../theme';
import { tap } from '../../utils/haptics';

function TabIcon({ name, color, focused, size }) {
  return <Ionicons name={focused ? name : `${name}-outline`} size={size ?? 24} color={color} />;
}

const tabIcon = (name) => {
  const render = (props) => <TabIcon name={name} {...props} />;
  render.displayName = `TabIcon(${name})`;
  return render;
};

export default function TabsLayout() {
  return (
    <Tabs
      screenListeners={{ tabPress: () => tap() }}
      screenOptions={{
        headerStyle: { backgroundColor: colors.bgPrimary },
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        headerTitleStyle: { fontFamily: fonts.heading, color: colors.textLight, fontSize: 22 },
        tabBarStyle: {
          backgroundColor: colors.bgDeep,
          borderTopColor: colors.borderGold,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: 'rgba(233, 228, 214, 0.5)',
        tabBarLabelStyle: { fontFamily: fonts.serifMedium, fontSize: 11 },
        sceneStyle: { backgroundColor: colors.bgPrimary },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false, tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen name="services" options={{ title: 'Services', tabBarIcon: tabIcon('sparkles') }} />
      <Tabs.Screen name="chat" options={{ title: 'Ask', headerTitle: 'Ask the Assistant', tabBarIcon: tabIcon('chatbubbles') }} />
      <Tabs.Screen name="bookings" options={{ title: 'Bookings', headerTitle: 'My Consultations', tabBarIcon: tabIcon('calendar') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon('person-circle') }} />
    </Tabs>
  );
}
