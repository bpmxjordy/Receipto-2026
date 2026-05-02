/**
 * <Screen> — safe-area wrapper with optional scroll.
 *
 * Every tab/screen should wrap its content in this component.
 * Handles SafeAreaView, background colour, and optional ScrollView.
 */

import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  type ViewStyle,
  type StyleProp,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  /** Wrap content in a ScrollView (default: true) */
  scroll?: boolean;
  /** Pull-to-refresh handler */
  onRefresh?: () => void;
  /** Whether a refresh is in progress */
  refreshing?: boolean;
  /** Extra padding on the sides (default: Spacing.xl = 24) */
  horizontalPadding?: number;
  /** Override the background colour */
  backgroundColor?: string;
  /** Extra style applied to the inner content container */
  style?: StyleProp<ViewStyle>;
}

export function Screen({
  children,
  scroll = true,
  onRefresh,
  refreshing = false,
  horizontalPadding = Spacing.xl,
  backgroundColor = Colors.bg.primary,
  style,
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const contentStyle: ViewStyle = {
    paddingHorizontal: horizontalPadding,
    paddingTop: insets.top + Spacing.md,
    paddingBottom: insets.bottom + Spacing.xxl,
    flexGrow: 1,
  };

  if (scroll) {
    return (
      <View style={[styles.root, { backgroundColor }]}>
        <ScrollView
          contentContainerStyle={[contentStyle, style]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.green[300]}
                colors={[Colors.green[300]]}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor }]}>
      <View style={[contentStyle, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
