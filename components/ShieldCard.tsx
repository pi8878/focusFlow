import { View, Text, Switch, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Shield, DayOfWeek } from "@/types";
import { APP_OPTIONS } from "@/constants";

interface ShieldCardProps {
  shield: Shield;
  onToggle: (id: string, value: boolean) => void;
  onDelete: (id: string) => void;
}

const ALL_DAYS: DayOfWeek[] = [
  "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",
];

export default function ShieldCard({
  shield,
  onToggle,
  onDelete,
}: ShieldCardProps) {
  const appOption = APP_OPTIONS.find((a) => a.name === shield.appName);

  return (
    <TouchableOpacity
      onLongPress={() => onDelete(shield.id)}
      activeOpacity={0.95}
      className="bg-white mx-4 mt-3 rounded-2xl p-4 shadow-sm"
    >
      {/* Top row */}
      <View className="flex-row items-center justify-between">
        <View
          className="w-11 h-11 rounded-xl items-center justify-center mr-3"
          style={{ backgroundColor: appOption?.color ?? "#6b7280" }}
        >
          <Ionicons
            name="lock-closed"
            size={20}
            color={appOption?.iconColor ?? "#fff"}
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
                isActive ? "text-gray-800 font-medium" : "text-gray-300"
              }`}
            >
              {day}
            </Text>
          );
        })}
      </View>

      {/* Long press hint */}
      <Text className="text-gray-300 text-xs mt-2">
        Hold to delete
      </Text>
    </TouchableOpacity>
  );
}