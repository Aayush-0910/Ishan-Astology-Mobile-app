import { useCallback, useEffect, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

/**
 * In-page anchors for a scrolling screen — the app's replacement for the
 * website's "/#kp" style hash links.
 *
 * Navigate with `?section=<id>` (e.g. router.push('/?section=kp')) and the
 * screen scrolls to the view registered under that id. The param is cleared
 * afterwards so following the same link again scrolls again.
 *
 * Registered views must be direct children of the ScrollView's content, since
 * onLayout reports y relative to the parent.
 */
export function useSectionScroll() {
  const { section } = useLocalSearchParams();
  const scrollRef = useRef(null);
  const offsets = useRef({});
  const pending = useRef(null);

  const scrollTo = useCallback((id) => {
    const y = offsets.current[id];
    if (y == null) {
      // Not laid out yet — scroll as soon as it is.
      pending.current = id;
      return;
    }
    pending.current = null;
    scrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true });
  }, []);

  useEffect(() => {
    if (!section) return;
    scrollTo(String(section));
    router.setParams({ section: undefined });
  }, [section, scrollTo]);

  const register = useCallback(
    (id) => (e) => {
      offsets.current[id] = e.nativeEvent.layout.y;
      if (pending.current === id) scrollTo(id);
    },
    [scrollTo]
  );

  return { scrollRef, register, scrollTo };
}
