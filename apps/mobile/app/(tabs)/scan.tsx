/**
 * Scan tab — receipt capture via camera or photo library.
 *
 * Flow:
 *   1. User taps shutter (camera) or Library (image picker)
 *   2. We run OCR on the captured image
 *   3. We parse the OCR blocks into structured receipt data
 *   4. Navigate to the review screen with the parsed data
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { Screen, HeaderBar, Button } from '@/components/ui';
import { Colors, TypeScale, Spacing, Radii } from '@/constants/theme';
import { parseReceipt } from '@/src/features/receipts/parseReceipt';

// Lazy-import the OCR module — it may not be available if the native
// module hasn't been compiled into the dev client yet.
let recognizeText: ((uri: string) => Promise<any[]>) | null = null;
try {
  const ocr = require('@receipto/ocr');
  recognizeText = ocr.recognizeText;
} catch (e) {
  console.warn('OCR module not available:', e);
}

export default function ScanScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [processing, setProcessing] = useState(false);
  const [torch, setTorch] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  // Only mount camera when tab is focused (prevents background camera issues)
  const [isFocused, setIsFocused] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
        setTorch(false);
      };
    }, []),
  );

  // ── Camera capture ──

  const handleCapture = async () => {
    if (!cameraRef.current || !cameraReady) return;

    setProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: Platform.OS === 'android',
      });

      if (!photo?.uri) {
        Alert.alert('Error', 'Failed to capture photo.');
        return;
      }

      await processImage(photo.uri);
    } catch (err) {
      console.error('Capture error:', err);
      Alert.alert('Error', 'Something went wrong capturing the photo.');
    } finally {
      setProcessing(false);
    }
  };

  // ── Library pick ──

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return;

    setProcessing(true);
    try {
      await processImage(result.assets[0].uri);
    } catch (err) {
      console.error('Library error:', err);
      Alert.alert('Error', 'Something went wrong processing the image.');
    } finally {
      setProcessing(false);
    }
  };

  // ── OCR + parse + navigate ──

  const processImage = async (imageUri: string) => {
    if (!recognizeText) {
      Alert.alert(
        'OCR not available',
        'The OCR module is not compiled into this build. Rebuild the app with `npx expo prebuild --platform ios --clean` then `npx expo run:ios --device`.',
      );
      return;
    }

    const blocks = await recognizeText(imageUri);

    if (blocks.length === 0) {
      Alert.alert(
        'No text found',
        "We couldn't detect any text in that image. Try taking the photo again with better lighting.",
      );
      return;
    }

    const parsed = parseReceipt(blocks);

    if (parsed.items.length === 0) {
      Alert.alert(
        'No items found',
        "We detected text but couldn't find any receipt items. Make sure the full receipt is visible.",
      );
      return;
    }

    // Navigate to review screen with parsed data
    router.push({
      pathname: '/review',
      params: {
        data: JSON.stringify(parsed),
        imageUri,
      },
    });
  };

  // ── Permission not yet granted ──

  if (!permission) {
    return (
      <Screen scroll={false}>
        <HeaderBar title="Scan Receipt" showAvatar={false} />
        <View style={styles.centred}>
          <ActivityIndicator size="large" color={Colors.green[300]} />
        </View>
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen scroll={false}>
        <HeaderBar title="Scan Receipt" showAvatar={false} />
        <View style={styles.centred}>
          <View style={styles.permissionIcon}>
            <Text style={{ fontSize: 48 }}>📷</Text>
          </View>
          <Text style={styles.permissionTitle}>Camera access needed</Text>
          <Text style={styles.permissionBody}>
            Receipto needs camera access to photograph your receipts. You can
            also import from your photo library instead.
          </Text>
          <View style={styles.permissionButtons}>
            <Button title="Allow Camera" onPress={requestPermission} />
            <Button
              title="Pick from Library"
              variant="secondary"
              onPress={handlePickImage}
            />
          </View>
        </View>
      </Screen>
    );
  }

  // ── Camera view ──

  return (
    <Screen scroll={false} horizontalPadding={0}>
      {/* Processing overlay */}
      {processing && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            <ActivityIndicator size="large" color={Colors.green[300]} />
            <Text style={styles.overlayText}>Reading receipt…</Text>
          </View>
        </View>
      )}

      {/* Camera preview — only mount when tab is focused */}
      {isFocused ? (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          enableTorch={torch}
          onCameraReady={() => setCameraReady(true)}
        >
          {/* Viewfinder guide */}
          <View style={styles.viewfinder}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>

          <Text style={styles.hint}>
            Position the receipt within the frame
          </Text>
        </CameraView>
      ) : (
        <View style={[styles.camera, styles.cameraPlaceholder]}>
          <ActivityIndicator size="large" color={Colors.green[300]} />
        </View>
      )}

      {/* Bottom controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={handlePickImage}
          disabled={processing}
        >
          <Text style={styles.actionIcon}>🖼️</Text>
          <Text style={styles.actionLabel}>Library</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shutterButton, processing && styles.shutterDisabled]}
          activeOpacity={0.7}
          onPress={handleCapture}
          disabled={processing || !cameraReady}
        >
          <View style={styles.shutterInner} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, torch && styles.actionActive]}
          activeOpacity={0.7}
          onPress={() => setTorch((t) => !t)}
          disabled={processing}
        >
          <Text style={styles.actionIcon}>🔦</Text>
          <Text style={styles.actionLabel}>
            {torch ? 'Torch On' : 'Torch'}
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

// ── Styles ──

const CORNER_SIZE = 24;
const CORNER_WIDTH = 3;

const styles = StyleSheet.create({
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  permissionIcon: {
    marginBottom: Spacing.xl,
  },
  permissionTitle: {
    ...TypeScale.subheading,
    color: Colors.green[600],
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  permissionBody: {
    ...TypeScale.bodySmall,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  permissionButtons: {
    gap: Spacing.md,
    width: '100%',
  },

  // Camera
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cameraPlaceholder: {
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  viewfinder: {
    position: 'absolute',
    top: '15%',
    left: '8%',
    right: '8%',
    bottom: '25%',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderColor: Colors.green[300],
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderColor: Colors.green[300],
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderColor: Colors.green[300],
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderColor: Colors.green[300],
    borderBottomRightRadius: 4,
  },
  hint: {
    ...TypeScale.bodySmall,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Processing overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayCard: {
    backgroundColor: Colors.bg.primary,
    borderRadius: Radii.lg,
    padding: Spacing.xxl,
    alignItems: 'center',
    gap: Spacing.lg,
  },
  overlayText: {
    ...TypeScale.body,
    color: Colors.text.primary,
  },

  // Bottom controls
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    backgroundColor: Colors.bg.primary,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: Colors.green[50],
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.green[200],
  },
  actionActive: {
    backgroundColor: Colors.green[200],
    borderColor: Colors.green[300],
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  actionLabel: {
    ...TypeScale.label,
    color: Colors.green[500],
  },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.green[300],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.green[200],
  },
  shutterDisabled: {
    opacity: 0.5,
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.green[400],
  },
});
