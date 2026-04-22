import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AppName, UnlockSettings } from "@/types";
import { getUnlockSettings, DEFAULT_UNLOCK_SETTINGS } from "@/store/shields";
import { useEmergencyUnlock } from "@/context/EmergencyUnlockContext";

interface EmergencyUnlockModalProps {
  visible: boolean;
  appName: AppName;
  shieldId: string;
  onClose: () => void;
  onUnlocked: (shieldId: string, durationMinutes: number) => void;
}

type Phase = "reason" | "countdown";

export default function EmergencyUnlockModal({
  visible,
  appName,
  shieldId,
  onClose,
  onUnlocked,
}: EmergencyUnlockModalProps) {
  const { startSession } = useEmergencyUnlock();

  const [phase, setPhase] = useState<Phase>("reason");
  const [reason, setReason] = useState("");
  const [settings, setSettings] = useState<UnlockSettings>(
    DEFAULT_UNLOCK_SETTINGS
  );
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (visible) {
      loadSettings();
      setPhase("reason");
      setReason("");
    }
    return () => clearTimer();
  }, [visible]);

  const loadSettings = async () => {
    const s = await getUnlockSettings();
    setSettings(s);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startCountdown = () => {
    if (!reason.trim()) {
      Alert.alert(
        "Reason required",
        "Please explain why you need emergency access."
      );
      return;
    }
    setPhase("countdown");
    setCountdown(settings.cooldownSeconds);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearTimer();
          // Cooldown done — hand off to global session (floating bubble)
          setTimeout(() => {
            onUnlocked(shieldId, settings.durationMinutes);
            startSession(
              shieldId,
              appName,
              settings.durationMinutes,
              reason
            );
            onClose();
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleClose = () => {
    clearTimer();
    setPhase("reason");
    setReason("");
    setTimeout(() => onClose(), 0);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <BlurView
        intensity={60}
        tint="dark"
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        <View className="bg-white rounded-3xl w-full px-6 pt-6 pb-8">

          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center gap-2">
              <Ionicons name="shield-outline" size={20} color="#ef4444" />
              <Text className="text-xl font-bold text-gray-900">
                Emergency Unlock
              </Text>
            </View>
            {phase === "reason" && (
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name="close" size={22} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>

          {/* Phase 1: Reason */}
          {phase === "reason" && (
            <View>
              <View className="bg-red-50 rounded-2xl p-4 mb-5 flex-row items-start gap-3">
                <Ionicons name="warning-outline" size={18} color="#ef4444" />
                <Text className="flex-1 text-red-600 text-sm leading-5">
                  You are about to temporarily unlock{" "}
                  <Text className="font-bold">{appName}</Text>. You will need
                  to wait {settings.cooldownSeconds} seconds before access is
                  granted.
                </Text>
              </View>

              <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-2">
                WHY DO YOU NEED ACCESS?
              </Text>
              <TextInput
                value={reason}
                onChangeText={setReason}
                placeholder="e.g. Need to check an important message..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800 text-sm mb-6"
                style={{ textAlignVertical: "top", minHeight: 80 }}
              />

              <TouchableOpacity
                onPress={startCountdown}
                className="bg-red-500 rounded-2xl py-4 items-center mb-3"
              >
                <Text className="text-white font-bold text-base">
                  Start {settings.cooldownSeconds}s Cooldown
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleClose}
                className="py-2 items-center"
              >
                <Text className="text-gray-400 text-sm">
                  Cancel — stay focused
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Phase 2: Countdown */}
          {phase === "countdown" && (
            <View className="items-center py-4">
              <Text className="text-gray-500 text-sm mb-8 text-center">
                Take a breath. Think about whether you really need this.
              </Text>

              <View className="w-36 h-36 rounded-full border-4 border-red-500 items-center justify-center mb-8">
                <Text className="text-5xl font-bold text-red-500">
                  {countdown}
                </Text>
                <Text className="text-gray-400 text-xs mt-1">seconds</Text>
              </View>

              <Text className="text-gray-400 text-sm text-center mb-8">
                Unlocking{" "}
                <Text className="font-semibold text-gray-700">{appName}</Text>{" "}
                for {settings.durationMinutes} minutes
              </Text>

              <TouchableOpacity
                onPress={handleClose}
                className="py-2 items-center"
              >
                <Text className="text-gray-400 text-sm">
                  Cancel — I changed my mind
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </BlurView>
    </Modal>
  );
}