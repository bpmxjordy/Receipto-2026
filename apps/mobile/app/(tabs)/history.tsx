/**
 * History tab — list of saved receipts from Firestore.
 *
 * Each card shows retailer, date, item count, and total.
 * Tap a card to open the receipt detail screen.
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Screen, HeaderBar, Card, EmptyState } from '@/components/ui';
import { Colors, TypeScale, Spacing, Radii } from '@/constants/theme';
import { useAuthStore } from '@/src/stores/authStore';
import {
  useReceipts,
  type ReceiptSummary,
} from '@/src/features/receipts/useReceipts';

export default function HistoryScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { data: receipts, isLoading, refetch, isRefetching } = useReceipts();

  const formatDate = (date: Date | null) => {
    if (!date) return 'Unknown date';
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const formatPrice = (pence: number | null) => {
    if (pence == null) return '—';
    return `£${(pence / 100).toFixed(2)}`;
  };

  const renderReceipt = ({ item }: { item: ReceiptSummary }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: '/receipt/[id]',
          params: { id: item.id },
        })
      }
    >
      <Card style={styles.receiptCard}>
        <View style={styles.receiptRow}>
          {/* Left: retailer icon placeholder */}
          <View style={styles.retailerIcon}>
            <Text style={styles.retailerInitial}>
              {item.retailerName ? item.retailerName.charAt(0) : '🧾'}
            </Text>
          </View>

          {/* Centre: details */}
          <View style={styles.receiptInfo}>
            <Text style={styles.retailerName} numberOfLines={1}>
              {item.retailerName ?? 'Unknown shop'}
            </Text>
            <Text style={styles.receiptMeta}>
              {formatDate(item.purchasedAt)} · {item.itemCount} item
              {item.itemCount !== 1 ? 's' : ''}
            </Text>
          </View>

          {/* Right: total */}
          <View style={styles.receiptRight}>
            <Text style={styles.receiptTotal}>
              {formatPrice(item.totalPence)}
            </Text>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    item.status === 'categorised'
                      ? Colors.success
                      : Colors.warning,
                },
              ]}
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <Screen scroll={false}>
      <HeaderBar
        title="Receipts"
        userName={user?.displayName ?? 'User'}
        showAvatar
      />

      <Text style={styles.sectionLabel}>Your Receipts</Text>

      {isLoading ? (
        <View style={styles.centred}>
          <ActivityIndicator size="large" color={Colors.green[300]} />
        </View>
      ) : !receipts || receipts.length === 0 ? (
        <EmptyState
          title="No receipts yet"
          body="Tap the Scan tab to capture your first receipt and start tracking your spending."
        />
      ) : (
        <FlatList
          data={receipts}
          keyExtractor={(r) => r.id}
          renderItem={renderReceipt}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isRefetching}
        />
      )}
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
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  separator: {
    height: Spacing.sm,
  },
  receiptCard: {
    padding: Spacing.lg,
  },
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  retailerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.green[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  retailerInitial: {
    ...TypeScale.body,
    fontWeight: '700',
    color: Colors.green[600],
  },
  receiptInfo: {
    flex: 1,
  },
  retailerName: {
    ...TypeScale.body,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  receiptMeta: {
    ...TypeScale.caption,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  receiptRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  receiptTotal: {
    ...TypeScale.body,
    fontWeight: '700',
    color: Colors.green[600],
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
