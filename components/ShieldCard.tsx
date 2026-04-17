// This is the card that shows each individual shield — app name, time range, active days, and the toggle switch.
import { View, Text, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Shield, DayOfWeek } from "@/types";
import { APP_OPTIONS } from "@/constants";

interface ShieldCardProps {
  shield: Shield;
  onToggle: (id: string, value: boolean) => void;
}

const ALL_DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ShieldCard({ shield, onToggle }: ShieldCardProps) {
  // Find the matching app config for colors
  const appOption = APP_OPTIONS.find((a) => a.name === shield.appName);

  const formatTime = (time: string) => {
    // Converts "09:00" to "09:00" — we'll expand this to AM/PM later
    return time;
  };

  return (
    <View className="bg-white mx-4 mt-3 rounded-2xl p-4 shadow-sm">
      {/* Top row — app icon, name/time, toggle */}
      <View className="flex-row items-center justify-between">
        {/* App icon circle */}
        <View
          className="w-11 h-11 rounded-xl items-center justify-center mr-3"
          style={{ backgroundColor: appOption?.color ?? "#6b7280" }}
        >
          <Ionicons name="lock-closed" size={20} color={appOption?.iconColor ?? "#fff"} />
        </View>

        {/* App name + time */}
        <View className="flex-1">
          <Text className="text-gray-900 font-semibold text-base">
            {shield.appName}
          </Text>
          <View className="flex-row items-center mt-0.5 gap-1">
            <Ionicons name="time-outline" size={12} color="#9ca3af" />
            <Text className="text-gray-400 text-xs ml-1">
              {formatTime(shield.startTime)} - {formatTime(shield.endTime)}
            </Text>
          </View>
        </View>

        {/* Toggle */}
        <Switch
          value={shield.isActive}
          onValueChange={(value) => onToggle(shield.id, value)}
          trackColor={{ false: "#e5e7eb", true: "#22c55e" }}
          thumbColor="#ffffff"
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
                isActive
                  ? "text-gray-800 font-medium"
                  : "text-gray-300"
              }`}
            >
              {day}
            </Text>
          );
        })}
      </View>
    </View>
  );
}