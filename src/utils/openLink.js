import { Alert, Linking } from 'react-native';
import { router } from 'expo-router';

/**
 * Follow a link the way the website's anchors did: in-app paths ("/pricing",
 * "/?section=kp") go through the router, everything else (https, tel, mailto,
 * upi) is handed to the operating system.
 */
export async function openLink(href) {
  if (!href) return;

  if (href.startsWith('/')) {
    router.push(href);
    return;
  }

  try {
    await Linking.openURL(href);
  } catch {
    Alert.alert('Could not open link', 'No app on this device can open that link.');
  }
}
