import { View, Text, Switch, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Shield, DayOfWeek } from "@/types";
import { APP_OPTIONS } from "@/constants";
import { isShieldCooling, getCoolingSecondsLeft } from "@/store/shields";
import { useEffect, useState } from "react";

interface ShieldCardProps {
  shield: Shield;
  onToggle: (id: string, value: boolean) => void;
  onDelete: (id: string) => void;
  onEmergencyUnlock: (shield: Shield) => void;
}

const ALL_DAYS: DayOfWeek[] = [
  "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",
];

const formatCoolingTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m remaining`;
  if (m > 0) return `${m}m ${s}s remaining`;
  return `${s}s remaining`;
};

export default function ShieldCard({
  shield,
  onToggle,
  onDelete,
  onEmergencyUnlock,
}: ShieldCardProps) {
  const appOption = APP_OPTIONS.find((a) => a.name === shield.appName);
  const cooling = isShieldCooling(shield);

  // Live countdown for cooling period
  const [coolingSeconds, setCoolingSeconds] = useState(
    getCoolingSecondsLeft(shield)
  );

  useEffect(() => {
    if (!cooling) return;

    const interval = setInterval(() => {
      const left = getCoolingSecondsLeft(shield);
      setCoolingSeconds(left);
      if (left <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [cooling, shield.coolingUntil]);

  return (
    <TouchableOpacity
      onLongPress={() => onDelete(shield.id)}
      activeOpacity={0.95}
      className={`mx-4 mt-3 rounded-2xl p-4 shadow-sm ${
        cooling ? "bg-orange-50 border border-orange-200" : "bg-white"
      }`}
    >
      {/* Cooling banner */}
      {cooling && (
        <View className="flex-row items-center gap-2 mb-3 bg-orange-100 rounded-xl px-3 py-2">
          <Ionicons name="hourglass-outline" size={14} color="#ea580c" />
          <Text className="text-orange-600 text-xs font-semibold flex-1">
            Cooling period — {formatCoolingTime(coolingSeconds)}
          </Text>
        </View>
      )}

      {/* Top row */}
      <View className="flex-row items-center justify-between">
        <View
          className="w-11 h-11 rounded-xl items-center justify-center mr-3"
          style={{
            backgroundColor: cooling
              ? "#fdba74"
              : appOption?.color ?? "#6b7280",
          }}
        >
          <Ionicons
            name={cooling ? "hourglass" : "lock-closed"}
            size={20}
            color={cooling ? "#ffffff" : appOption?.iconColor ?? "#fff"}
          />
        </View>

        <View className="flex-1">
          <Text className="text-gray-900 font-semibold text-base">
            {shield.appName}
          </Text>
          <View className="flex-row items-center mt-0.5">
            <Ionicons name="time-outline" size={12} color="#9ca3af" />
            <Text className="text-gray-400 text-xs ml-1">
              {shield.startTime} - {shield.endTime}
            </Text>
          </View>
        </View>

        {/* Toggle — disabled during cooling */}
        <Switch
          value={shield.isActive}
          onValueChange={(value) => onToggle(shield.id, value)}
          trackColor={{ false: "#e5e7eb", true: cooling ? "#fb923c" : "#22c55e" }}
          thumbColor="#ffffff"
          disabled={cooling}
        />
      </View>

      {/* Day pills */}
      <View className="flex-row mt-3 gap-1">
        {ALL_DAYS.map((day) => {
          const isActive = shield.days.includes(day);
          return (
            <Text
              key={day}
              className={`text-xs px-1.5 py-0.5 rounded ${
                isActive ? "text-gray-800 font-medium" : "text-gray-300"
              }`}
            >
              {day}
            </Text>
          );
        })}
      </View>

      {/* Bottom row */}
      <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <Text className="text-gray-300 text-xs">
          {cooling ? "Cannot delete during cooling" : "Hold to delete"}
        </Text>

        {shield.isActive && !cooling && (
          <TouchableOpacity
            onPress={() => onEmergencyUnlock(shield)}
            className="flex-row items-center gap-1 bg-red-50 px-3 py-1.5 rounded-full"
          >
            <Ionicons name="lock-open-outline" size={12} color="#ef4444" />
            <Text className="text-red-500 text-xs font-medium ml-1">
              Emergency Unlock
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}