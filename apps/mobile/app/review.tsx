/**
 * Review screen — shown after OCR + parse to let the user
 * confirm, edit, or remove items before saving to Firestore.
 *
 * Receives parsed data + imageUri as route params (JSON-encoded).
 */

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Screen, HeaderBar, Button, Card } from '@/components/ui';
import { Colors, TypeScale, Spacing, Radii } from '@/constants/theme';
import { useAuthStore } from '@/src/stores/authStore';
import type { ParsedReceipt, ParsedItem } from '@/src/features/receipts/parseReceipt';
import { saveReceipt } from '@/src/features/receipts/saveReceipt';

// ── Editable item type ──

interface EditableItem extends ParsedItem {
  removed: boolean;
}

export default function ReviewScreen() {
  const router = useRouter();
  const { data, imageUri } = useLocalSearchParams<{
    data: string;
    imageUri: string;
  }>();

  const user = useAuthStore((s) => s.user);

  const parsed: ParsedReceipt = useMemo(() => {
    try {
      return JSON.parse(data ?? '{}');
    } catch {
      return { retailerName: null, purchasedAt: null, totalPence: null, items: [], rawText: '' };
    }
  }, [data]);

  const [items, setItems] = useState<EditableItem[]>(() =>
    parsed.items.map((item) => ({ ...item, removed: false })),
  );
  const [retailer, setRetailer] = useState(parsed.retailerName ?? '');
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // ── Computed ──

  const activeItems = items.filter((i) => !i.removed);
  const computedTotal = activeItems.reduce((sum, i) => sum + i.pricePence, 0);

  // ── Handlers ──

  const toggleRemove = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, removed: !item.removed } : item,
      ),
    );
  };

  const updateItemName = (index: number, name: string) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, rawName: name } : item,
      ),
    );
  };

  const updateItemPrice = (index: number, priceStr: string) => {
    const pence = Math.round(parseFloat(priceStr || '0') * 100);
    if (isNaN(pence)) return;
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, pricePence: pence } : item,
      ),
    );
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be signed in to save receipts.');
      return;
    }

    if (activeItems.length === 0) {
      Alert.alert('No items', 'Add at least one item before saving.');
      return;
    }

    setSaving(true);
    try {
      const receipt: ParsedReceipt = {
        ...parsed,
        retailerName: retailer || null,
      };

      // Re-index positions for the active items
      const finalItems = activeItems.map((item, i) => ({
        rawName: item.rawName,
        qty: item.qty,
        unit: item.unit,
        pricePence: item.pricePence,
        position: i,
      }));

      await saveReceipt({
        uid: user.uid,
        receipt,
        items: finalItems,
        imageUri: imageUri ?? '',
      });

      Alert.alert('Saved!', 'Your receipt has been saved.', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)/history'),
        },
      ]);
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('Error', 'Failed to save receipt. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Render helpers ──

  const formatPrice = (pence: number) => {
    const pounds = (pence / 100).toFixed(2);
    return `£${pounds}`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Unknown date';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Unknown date';
    }
  };

  const renderItem = ({ item, index }: { item: EditableItem; index: number }) => {
    const isEditing = editingIndex === index;

    return (
      <TouchableOpacity
        style={[styles.itemRow, item.removed && styles.itemRemoved]}
        activeOpacity={0.7}
        onPress={() => setEditingIndex(isEditing ? null : index)}
        onLongPress={() => toggleRemove(index)}
      >
        <View style={styles.itemLeft}>
          {isEditing ? (
            <TextInput
              style={styles.itemNameInput}
              value={item.rawName}
              onChangeText={(text) => updateItemName(index, text)}
              autoFocus
              selectTextOnFocus
            />
          ) : (
            <Text
              style={[
                styles.itemName,
                item.removed && styles.itemTextStruck,
              ]}
              numberOfLines={1}
            >
              {item.rawName}
            </Text>
          )}
          <Text style={styles.itemMeta}>
            {item.qty > 1 ? `${item.qty} × ` : ''}
            {item.unit !== 'each' ? `${item.unit}` : ''}
          </Text>
        </View>

        <View style={styles.itemRight}>
          {isEditing ? (
            <TextInput
              style={styles.itemPriceInput}
              value={(item.pricePence / 100).toFixed(2)}
              onChangeText={(text) => updateItemPrice(index, text)}
              keyboardType="decimal-pad"
              selectTextOnFocus
            />
          ) : (
            <Text
              style={[
                styles.itemPrice,
                item.removed && styles.itemTextStruck,
              ]}
            >
              {formatPrice(item.pricePence)}
            </Text>
          )}

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => toggleRemove(index)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.removeIcon}>
              {item.removed ? '↩️' : '✕'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // ── Main render ──

  return (
    <Screen scroll={false} horizontalPadding={0}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <HeaderBar
            title="Review Receipt"
            showAvatar={false}
            showBack
          />
        </View>

        {/* Receipt image thumbnail + retailer */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            ) : null}
            <View style={styles.summaryInfo}>
              <TextInput
                style={styles.retailerInput}
                value={retailer}
                onChangeText={setRetailer}
                placeholder="Retailer name"
                placeholderTextColor={Colors.text.muted}
              />
              <Text style={styles.summaryDate}>
                {formatDate(parsed.purchasedAt as unknown as string)}
              </Text>
              <Text style={styles.summaryItemCount}>
                {activeItems.length} item{activeItems.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </Card>

        {/* Items list */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Items</Text>
          <Text style={styles.listHint}>Tap to edit · Long press to remove</Text>
        </View>

        <FlatList
          data={items}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

        {/* Footer with total + save */}
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(computedTotal)}</Text>
            {parsed.totalPence != null && parsed.totalPence !== computedTotal && (
              <Text style={styles.totalMismatch}>
                (receipt says {formatPrice(parsed.totalPence)})
              </Text>
            )}
          </View>
          <Button
            title={saving ? 'Saving…' : 'Save Receipt'}
            onPress={handleSave}
            loading={saving}
            disabled={activeItems.length === 0}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

// ── Styles ──

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
  },
  summaryCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  thumbnail: {
    width: 60,
    height: 80,
    borderRadius: Radii.sm,
    backgroundColor: Colors.green[100],
  },
  summaryInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  retailerInput: {
    ...TypeScale.subheading,
    color: Colors.text.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.green[200],
    paddingBottom: 2,
    marginBottom: Spacing.xs,
  },
  summaryDate: {
    ...TypeScale.bodySmall,
    color: Colors.text.secondary,
  },
  summaryItemCount: {
    ...TypeScale.label,
    color: Colors.green[500],
    marginTop: 2,
  },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  listTitle: {
    ...TypeScale.body,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  listHint: {
    ...TypeScale.caption,
    color: Colors.text.muted,
  },

  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
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
  itemRemoved: {
    opacity: 0.4,
  },
  itemLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  itemName: {
    ...TypeScale.body,
    color: Colors.text.primary,
  },
  itemNameInput: {
    ...TypeScale.body,
    color: Colors.text.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.green[300],
    paddingBottom: 2,
  },
  itemTextStruck: {
    textDecorationLine: 'line-through',
    color: Colors.text.muted,
  },
  itemMeta: {
    ...TypeScale.caption,
    color: Colors.text.secondary,
    marginTop: 2,
  },

  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  itemPrice: {
    ...TypeScale.body,
    fontWeight: '600',
    color: Colors.green[600],
  },
  itemPriceInput: {
    ...TypeScale.body,
    fontWeight: '600',
    color: Colors.green[600],
    borderBottomWidth: 1,
    borderBottomColor: Colors.green[300],
    paddingBottom: 2,
    minWidth: 60,
    textAlign: 'right',
  },
  removeButton: {
    padding: Spacing.xs,
  },
  removeIcon: {
    fontSize: 16,
    color: Colors.text.muted,
  },

  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    backgroundColor: Colors.bg.primary,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  totalLabel: {
    ...TypeScale.body,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  totalValue: {
    ...TypeScale.subheading,
    color: Colors.green[600],
  },
  totalMismatch: {
    ...TypeScale.caption,
    color: Colors.warning,
  },
});
