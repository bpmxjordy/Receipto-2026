import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen, HeaderBar, EmptyState } from '@/components/ui';
import { Colors, TypeScale, Spacing } from '@/constants/theme';
import { useAuthStore } from '@/src/stores/authStore';

/**
 * History tab — list of past receipts.
 * Matches iPhone 14 - 34.png from the design deck.
 * Phase 6 will populate with real receipt data.
 */
export default function HistoryScreen() {
  const { user } = useAuthStore();

  return (
    <Screen>
      <HeaderBar title="Receipts" userName={user?.displayName ?? 'User'} showAvatar />

      <Text style={styles.sectionLabel}>Latest Receipt</Text>

      {/* Phase 6: Replace EmptyState with actual receipt list */}
      <EmptyState
        title="No receipts yet"
        body="Tap the Scan tab to capture your first receipt and start tracking your spending."
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    ...TypeScale.label,
    color: Colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.lg,
  },
});
