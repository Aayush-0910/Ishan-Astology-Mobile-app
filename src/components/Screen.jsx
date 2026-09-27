import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import Starfield from './Starfield';
import Footer from './Footer';

/**
 * Standard scrolling screen: midnight background, star specks, and the site
 * footer at the end of the content.
 *
 * @param {object}  [scrollRef]      ref forwarded to the ScrollView (for section scrolling)
 * @param {boolean} [footer=true]    render the footer after the content
 * @param {boolean} [keyboard=false] wrap in a KeyboardAvoidingView for form screens
 */
export default function Screen({ children, scrollRef, footer = true, keyboard = false }) {
  const scroll = (
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
      {footer ? <Footer /> : null}
    </ScrollView>
  );

  return (
    <View style={styles.root}>
      <Starfield />
      {keyboard ? (
        <KeyboardAvoidingView
          style={styles.scroll}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          {scroll}
        </KeyboardAvoidingView>
      ) : (
        scroll
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { flex: 1 },
  content: { paddingBottom: 96 }, // clears the floating chat launcher
});
