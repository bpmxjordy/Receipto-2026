import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen, Card, HeaderBar, Divider } from '@/components/ui';
import { Colors, TypeScale, Spacing } from '@/constants/theme';
import { useAuthStore } from '@/src/stores/authStore';

/**
 * Home tab — weekly summary card + quick navigation.
 * Matches iPhone 14 - 64.png from the design deck.
 * Phase 7 will wire real data; this is the layout.
 */
export default function HomeScreen() {
  const { user } = useAuthStore();
  const displayName = user?.displayName ?? 'User';

  return (
    <Screen>
      <HeaderBar title="Social" userName={displayName} showAvatar />

      {/* Receipts banner */}
      <Card style={styles.receiptsBanner}>
        <Text style={styles.receiptsBannerText}>Receipts</Text>
      </Card>

      {/* Referral strip */}
      <View style={styles.referralRow}>
        <Text style={styles.referralText}>Refer a friend, get £5 each</Text>
        <View style={styles.shareButton}>
          <Text style={styles.shareButtonText}>Share</Text>
        </View>
      </View>

      {/* Your Week card */}
      <Card style={styles.weekCard}>
        <View style={styles.weekHeader}>
          <Text style={styles.weekTitle}>Your week</Text>
        </View>

        <View style={styles.weekStat}>
          <Text style={styles.weekStatLabel}>Your CO₂ usage</Text>
          <Text style={styles.weekStatValue}>—</Text>
        </View>

        <View style={[styles.weekStat, styles.weekStatHighlight]}>
          <Text style={styles.weekStatLabelHighlight}>Average CO₂ Usage</Text>
          <Text style={styles.weekStatValue}>—</Text>
        </View>

        <Divider spacing={Spacing.md} color={Colors.green[200]} />

        <View style={styles.statsRow}>
          <StatBox label="Receipts" value="—" icon="🧾" />
          <StatBox label="Money" value="—" icon="💷" />
          <StatBox label="Eco points" value="—" icon="🌱" />
        </View>
      </Card>

      {/* Analytics preview — Phase 7 */}
      <Card style={styles.analyticsPreview}>
        <Text style={styles.analyticsTitle}>Analytics</Text>
        <Text style={styles.analyticsBody}>
          Capture receipts to see your spending breakdown by category.
        </Text>
      </Card>
    </Screen>
  );
}

function StatBox({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  receiptsBanner: {
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptsBannerText: {
    ...TypeScale.subheading,
    color: Colors.green[600],
    fontWeight: '700',
  },
  referralRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bg.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.green[200],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  referralText: {
    ...TypeScale.bodySmall,
    color: Colors.text.primary,
    flex: 1,
  },
  shareButton: {
    backgroundColor: Colors.green[300],
    borderRadius: 8,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  shareButtonText: {
    ...TypeScale.label,
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  weekCard: {
    marginBottom: Spacing.lg,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  weekTitle: {
    ...TypeScale.subheading,
    color: Colors.green[600],
    fontWeight: '700',
  },
  weekStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  weekStatHighlight: {
    backgroundColor: Colors.green[100],
  },
  weekStatLabel: {
    ...TypeScale.bodySmall,
    color: Colors.text.primary,
  },
  weekStatLabelHighlight: {
    ...TypeScale.bodySmall,
    color: Colors.green[600],
    fontWeight: '600',
  },
  weekStatValue: {
    ...TypeScale.body,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    minWidth: 80,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: Spacing.xs,
  },
  statValue: {
    ...TypeScale.subheading,
    color: Colors.green[400],
  },
  statLabel: {
    ...TypeScale.caption,
    color: Colors.text.muted,
    marginTop: 2,
  },
  analyticsPreview: {
    marginBottom: Spacing.lg,
  },
  analyticsTitle: {
    ...TypeScale.subheading,
    color: Colors.green[600],
    marginBottom: Spacing.sm,
  },
  analyticsBody: {
    ...TypeScale.bodySmall,
    color: Colors.text.secondary,
  },
});
