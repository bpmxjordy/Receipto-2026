import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Screen, TextField, Button } from '@/components/ui';
import { Colors, TypeScale, Spacing, Radii } from '@/constants/theme';
import { useAuthStore } from '@/src/stores/authStore';

const registerSchema = z
  .object({
    displayName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

/**
 * Register screen — create a new account.
 */
export default function RegisterScreen() {
  const router = useRouter();
  const { register: signUp, loading, error, clearError } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    clearError();
    await signUp(data.email, data.password, data.displayName);
  };

  return (
    <Screen backgroundColor={Colors.bg.primary}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoBg}>
            <Text style={styles.logoText}>R</Text>
          </View>
          <Text style={styles.heading}>Create your account</Text>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          <Controller
            control={control}
            name="displayName"
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Display Name"
                placeholder="Jordan"
                value={value}
                onChangeText={onChange}
                autoComplete="name"
                error={errors.displayName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Email"
                placeholder="jordan@example.com"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoComplete="email"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Password"
                placeholder="At least 6 characters"
                value={value}
                onChangeText={onChange}
                isPassword
                autoComplete="new-password"
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Confirm Password"
                placeholder="Repeat your password"
                value={value}
                onChangeText={onChange}
                isPassword
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
              />
            )}
          />

          {error && <Text style={styles.errorBanner}>{error}</Text>}

          <Button
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={{ marginTop: Spacing.md }}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoBg: {
    width: 100,
    height: 100,
    borderRadius: Radii.xl,
    backgroundColor: Colors.green[50],
    borderWidth: 2,
    borderColor: Colors.green[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.green[300],
  },
  heading: {
    ...TypeScale.subheading,
    color: Colors.green[600],
  },
  formSection: {
    paddingHorizontal: Spacing.sm,
  },
  errorBanner: {
    ...TypeScale.bodySmall,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    backgroundColor: '#FEE2E2',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.sm,
    overflow: 'hidden',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  loginText: {
    ...TypeScale.bodySmall,
    color: Colors.text.secondary,
  },
  loginLink: {
    ...TypeScale.bodySmall,
    color: Colors.text.link,
    fontWeight: '600',
  },
});
