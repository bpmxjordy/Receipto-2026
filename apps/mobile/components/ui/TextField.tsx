/**
 * <TextField> — styled text input matching the deck's login screen.
 *
 * Wraps TextInput with a label, error message, and Receipto styling.
 * Compatible with react-hook-form via `value` / `onChangeText`.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  type TextInputProps,
  type ViewStyle,
  type StyleProp,
} from 'react-native';

import { Colors, TypeScale, Spacing, Radii } from '@/constants/theme';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  /** Label shown above the input */
  label?: string;
  /** Error message shown below the input */
  error?: string;
  /** Show a toggle for password visibility */
  isPassword?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function TextField({
  label,
  error,
  isPassword = false,
  style,
  ...rest
}: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          focused && styles.inputFocused,
          error ? styles.inputError : null,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.text.muted}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.eyeButton}
            hitSlop={8}
          >
            <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...TypeScale.label,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.green[50],
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.green[200],
    paddingHorizontal: Spacing.lg,
  },
  inputFocused: {
    borderColor: Colors.green[300],
    borderWidth: 2,
  },
  inputError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    ...TypeScale.body,
    color: Colors.text.primary,
    paddingVertical: Spacing.md + 2,
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  eyeIcon: {
    fontSize: 18,
  },
  error: {
    ...TypeScale.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});
