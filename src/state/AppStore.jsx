import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * On-device state: the user's saved birth profile and their consultation
 * bookings. Nothing here leaves the phone except what the user sends on
 * WhatsApp or through the review/feedback forms.
 */

const PROFILE_KEY = 'ishan.profile.v1';
const BOOKINGS_KEY = 'ishan.bookings.v1';

const AppStoreContext = createContext(null);

async function readJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
}

export function AppStoreProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState(null); // { name, dob, tob, pob }
  const [bookings, setBookings] = useState([]); // newest first

  useEffect(() => {
    let alive = true;
    Promise.all([readJSON(PROFILE_KEY, null), readJSON(BOOKINGS_KEY, [])]).then(([p, b]) => {
      if (!alive) return;
      setProfile(p);
      setBookings(Array.isArray(b) ? b : []);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const saveProfile = useCallback((next) => {
    setProfile(next);
    writeJSON(PROFILE_KEY, next);
  }, []);

  const addBooking = useCallback((booking) => {
    setBookings((prev) => {
      const next = [booking, ...prev];
      writeJSON(BOOKINGS_KEY, next);
      return next;
    });
  }, []);

  const updateBooking = useCallback((id, patch) => {
    setBookings((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, ...patch } : b));
      writeJSON(BOOKINGS_KEY, next);
      return next;
    });
  }, []);

  const removeBooking = useCallback((id) => {
    setBookings((prev) => {
      const next = prev.filter((b) => b.id !== id);
      writeJSON(BOOKINGS_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ ready, profile, saveProfile, bookings, addBooking, updateBooking, removeBooking }),
    [ready, profile, saveProfile, bookings, addBooking, updateBooking, removeBooking]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error('useAppStore must be used inside <AppStoreProvider>');
  return ctx;
}

export const firstName = (profile) => (profile?.name || '').trim().split(/\s+/)[0] || '';
