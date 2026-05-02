/**
 * <Button> — primary / secondary / ghost variants matching the deck.
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  type ViewStyle,
  type StyleProp,
} from 'react-native';

import { Colors, TypeScale, Spacing, Radii } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  /** Full width (default: true) */
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const BG: Record<ButtonVariant, string> = {
  primary: Colors.green[300],
  secondary: Colors.green[50],
  ghost: 'transparent',
  danger: Colors.error,
};

const TEXT_COLOR: Record<ButtonVariant, string> = {
  primary: Colors.text.inverse,
  secondary: Colors.green[500],
  ghost: Colors.green[500],
  danger: Colors.text.inverse,
};

const BORDER: Record<ButtonVariant, string | undefined> = {
  primary: undefined,
  secondary: Colors.green[200],
  ghost: undefined,
  danger: undefined,
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        {
          backgroundColor: disabled ? Colors.border.light : BG[variant],
          borderColor: BORDER[variant] ?? 'transparent',
          borderWidth: BORDER[variant] ? 1 : 0,
          alignSelf: fullWidth ? 'stretch' : 'center',
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={TEXT_COLOR[variant]} size="small" />
      ) : (
        <Text
          style={[
            styles.label,
            {
              color: disabled ? Colors.text.muted : TEXT_COLOR[variant],
            },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  label: {
    ...TypeScale.body,
    fontWeight: '600',
  },
});
