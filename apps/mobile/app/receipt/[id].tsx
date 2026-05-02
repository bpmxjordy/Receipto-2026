/**
 * Receipt detail screen — shows a single receipt's items with
 * category and CO₂ info (when available).
 *
 * Route: /receipt/[id]
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { Screen, HeaderBar, Card } from '@/components/ui';
import { Colors, TypeScale, Spacing, Radii } from '@/constants/theme';
import {
  useReceiptDetail,
  type ReceiptItem,
} from '@/src/features/receipts/useReceiptDetail';

export default function ReceiptDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: receipt, isLoading, error } = useReceiptDetail(id);

  // ── Helpers ──

  const formatPrice = (pence: number) => `£${(pence / 100).toFixed(2)}`;

  const formatDate = (date: Date | null) => {
    if (!date) return 'Unknown date';
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'categorised':
        return 'Categorised';
      case 'pending_categorisation':
        return 'Pending categorisation';
      default:
        return status;
    }
  };

  const co2Label = (grams: number | null) => {
    if (grams == null) return null;
    if (grams >= 1000) return `${(grams / 1000).toFixed(1)} kg CO₂`;
    return `${Math.round(grams)} g CO₂`;
  };

  // ── Item row ──

  const renderItem = ({ item }: { item: ReceiptItem }) => (
    <View style={styles.itemRow}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.rawName}
        </Text>
        <View style={styles.itemMeta}>
          {item.qty > 1 && (
            <Text style={styles.metaText}>
              {item.qty}{item.unit !== 'each' ? ` ${item.unit}` : 'x'}
            </Text>
          )}
          {item.categoryId && (
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{item.categoryId}</Text>
            </View>
          )}
          {item.co2Grams != null && (
            <Text
              style={[
                styles.co2Text,
                {
                  color:
                    item.co2Grams < 500
                      ? Colors.co2.low
                      : item.co2Grams < 2000
                        ? Colors.co2.medium
                        : Colors.co2.high,
                },
              ]}
            >
              {co2Label(item.co2Grams)}
            </Text>
          )}
        </View>
      </View>
      <Text style={styles.itemPrice}>{formatPrice(item.pricePence)}</Text>
    </View>
  );

  // ── Loading / error ──

  if (isLoading) {
    return (
      <Screen scroll={false}>
        <HeaderBar title="Receipt" showAvatar={false} showBack />
        <View style={styles.centred}>
          <ActivityIndicator size="large" color={Colors.green[300]} />
        </View>
      </Screen>
    );
  }

  if (error || !receipt) {
    return (
      <Screen scroll={false}>
        <HeaderBar title="Receipt" showAvatar={false} showBack />
        <View style={styles.centred}>
          <Text style={styles.errorText}>
            {error?.message ?? 'Receipt not found.'}
          </Text>
        </View>
      </Screen>
    );
  }

  // ── Main render ──

  return (
    <Screen scroll={false}>
      <HeaderBar title="Receipt" showAvatar={false} showBack />

      {/* Header card */}
      <Card style={styles.headerCard}>
        <View style={styles.headerRow}>
          {receipt.imageUrl ? (
            <Image
              source={{ uri: receipt.imageUrl }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
              <Text style={{ fontSize: 28 }}>🧾</Text>
            </View>
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.retailer}>
              {receipt.retailerName ?? 'Unknown shop'}
            </Text>
            <Text style={styles.date}>{formatDate(receipt.purchasedAt)}</Text>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      receipt.status === 'categorised'
                        ? Colors.success
                        : Colors.warning,
                  },
                ]}
              />
              <Text style={styles.statusText}>
                {statusLabel(receipt.status)}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Items list */}
      <View style={styles.itemsHeader}>
        <Text style={styles.itemsTitle}>
          {receipt.items.length} item{receipt.items.length !== 1 ? 's' : ''}
        </Text>
        {receipt.totalPence != null && (
          <Text style={styles.totalText}>
            Total: {formatPrice(receipt.totalPence)}
          </Text>
        )}
      </View>

      <FlatList
        data={receipt.items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

// ── Styles ──

const styles = StyleSheet.create({
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...TypeScale.body,
    color: Colors.error,
    textAlign: 'center',
  },

  headerCard: {
    marginBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  thumbnail: {
    width: 64,
    height: 84,
    borderRadius: Radii.sm,
  },
  thumbnailPlaceholder: {
    backgroundColor: Colors.green[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  retailer: {
    ...TypeScale.subheading,
    color: Colors.text.primary,
  },
  date: {
    ...TypeScale.bodySmall,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    ...TypeScale.caption,
    color: Colors.text.secondary,
  },

  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
  },
  itemsTitle: {
    ...TypeScale.body,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  totalText: {
    ...TypeScale.body,
    fontWeight: '700',
    color: Colors.green[600],
  },

  listContent: {
    paddingBottom: Spacing.xxl,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border.light,
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  itemLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  itemName: {
    ...TypeScale.body,
    color: Colors.text.primary,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 2,
  },
  metaText: {
    ...TypeScale.caption,
    color: Colors.text.secondary,
  },
  categoryTag: {
    backgroundColor: Colors.green[100],
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radii.sm,
  },
  categoryText: {
    ...TypeScale.caption,
    color: Colors.green[600],
  },
  co2Text: {
    ...TypeScale.caption,
    fontWeight: '600',
  },
  itemPrice: {
    ...TypeScale.body,
    fontWeight: '600',
    color: Colors.green[600],
  },
});
