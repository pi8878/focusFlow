import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import Slider from "@react-native-community/slider";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { UnlockSettings } from "@/types";
import {
  getUnlockSettings,
  saveUnlockSettings,
  DEFAULT_UNLOCK_SETTINGS,
} from "@/store/shields";

interface UnlockSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function UnlockSettingsModal({
  visible,
  onClose,
}: UnlockSettingsModalProps) {
  const [cooldown, setCooldown] = useState(
    DEFAULT_UNLOCK_SETTINGS.cooldownSeconds
  );
  const [duration, setDuration] = useState(
    DEFAULT_UNLOCK_SETTINGS.durationMinutes
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) loadSettings();
  }, [visible]);

  const loadSettings = async () => {
    setLoading(true);
    const settings = await getUnlockSettings();
    setCooldown(settings.cooldownSeconds);
    setDuration(settings.durationMinutes);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await saveUnlockSettings({
      cooldownSeconds: cooldown,
      durationMinutes: duration,
    });
    setSaving(false);
    Alert.alert("Saved", "Your unlock settings have been saved.", [
      { text: "OK", onPress: onClose },
    ]);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <BlurView
        intensity={60}
        tint="dark"
        style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}
      >
        <View className="bg-white rounded-3xl w-full px-6 pt-6 pb-6">

          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-900">
              Unlock Settings
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color="#22c55e" size="large" />
          ) : (
            <>
              {/* Cooldown slider */}
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-xs font-semibold text-gray-400 tracking-widest">
                    COOLDOWN (SECONDS)
                  </Text>
                  <Text className="text-green-500 font-bold text-base">
                    {cooldown}s
                  </Text>
                </View>
                <Slider
                  minimumValue={10}
                  maximumValue={120}
                  step={5}
                  value={cooldown}
                  onValueChange={(val) => setCooldown(Math.round(val))}
                  minimumTrackTintColor="#22c55e"
                  maximumTrackTintColor="#e5e7eb"
                  thumbTintColor="#22c55e"
                />
                <Text className="text-gray-400 text-xs italic mt-2">
                  The time you must wait after requesting an unlock.
                </Text>
              </View>

              {/* Duration slider */}
              <View className="mb-8">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-xs font-semibold text-gray-400 tracking-widest">
                    DURATION (MINUTES)
                  </Text>
                  <Text className="text-green-500 font-bold text-base">
                    {duration}m
                  </Text>
                </View>
                <Slider
                  minimumValue={5}
                  maximumValue={60}
                  step={1}
                  value={duration}
                  onValueChange={(val) => setDuration(Math.round(val))}
                  minimumTrackTintColor="#22c55e"
                  maximumTrackTintColor="#e5e7eb"
                  thumbTintColor="#22c55e"
                />
                <Text className="text-gray-400 text-xs italic mt-2">
                  How long the apps remain unlocked after the cooldown.
                </Text>
              </View>

              {/* Save button */}
              <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                className="bg-gray-900 rounded-2xl py-4 items-center mb-3"
              >
                {saving ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    Save Settings
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose} className="py-2 items-center">
                <Text className="text-gray-400 text-sm font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </BlurView>
    </Modal>
  );
}