import { View, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StreakData } from "@/types";

interface StreakCardProps {
  streakData: StreakData;
  weekGrid: {
    date: string;
    dayLabel: string;
    wasActive: boolean;
    isToday: boolean;
  }[];
  loading: boolean;
}

export default function StreakCard({
  streakData,
  weekGrid,
  loading,
}: StreakCardProps) {
  if (loading) {
    return (
      <View className="bg-white mx-4 rounded-2xl p-5 mt-3 items-center py-8">
        <ActivityIndicator color="#22c55e" />
      </View>
    );
  }

  return (
    <View className="bg-white mx-4 rounded-2xl p-5 mt-3">

      {/* Title */}
      <View className="flex-row items-center gap-2 mb-4">
        <Ionicons name="flame" size={20} color="#f97316" />
        <Text className="text-base font-bold text-gray-900">
          Focus Streak
        </Text>
      </View>

      {/* Streak stats row */}
      <View className="flex-row justify-between mb-5">

        {/* Current streak */}
        <View className="flex-1 items-center bg-orange-50 rounded-2xl py-4 mr-2">
          <Text className="text-4xl font-bold text-orange-500">
            {streakData.currentStreak}
          </Text>
          <Text className="text-xs text-gray-400 mt-1">Current streak</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="flame" size={12} color="#f97316" />
            <Text className="text-xs text-orange-400 ml-0.5">
              {streakData.currentStreak === 1 ? "day" : "days"}
            </Text>
          </View>
        </View>

        {/* Longest streak */}
        <View className="flex-1 items-center bg-gray-50 rounded-2xl py-4 ml-2">
          <Text className="text-4xl font-bold text-gray-700">
            {streakData.longestStreak}
          </Text>
          <Text className="text-xs text-gray-400 mt-1">Longest streak</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="trophy-outline" size={12} color="#9ca3af" />
            <Text className="text-xs text-gray-400 ml-0.5">
              {streakData.longestStreak === 1 ? "day" : "days"} best
            </Text>
          </View>
        </View>
      </View>

      {/* 7 day grid */}
      <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-3">
        THIS WEEK
      </Text>
      <View className="flex-row justify-between">
        {weekGrid.map((day) => (
          <View key={day.date} className="items-center flex-1">
            <Text className="text-xs text-gray-400 mb-2">{day.dayLabel}</Text>
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                day.wasActive
                  ? "bg-green-500"
                  : day.isToday
                  ? "bg-gray-200 border-2 border-green-300"
                  : "bg-gray-100"
              }`}
            >
              {day.wasActive ? (
                <Ionicons name="checkmark" size={14} color="#ffffff" />
              ) : day.isToday ? (
                <Ionicons name="ellipse-outline" size={10} color="#86efac" />
              ) : (
                <Text className="text-gray-300 text-xs">·</Text>
              )}
            </View>
            {day.isToday && (
              <Text className="text-green-500 text-xs mt-1">Today</Text>
            )}
          </View>
        ))}
      </View>

      {/* Motivational message */}
      <View className="mt-4 pt-4 border-t border-gray-50">
        {streakData.currentStreak === 0 ? (
          <Text className="text-gray-400 text-xs text-center">
            Activate a shield today to start your streak 🔥
          </Text>
        ) : streakData.currentStreak < 3 ? (
          <Text className="text-gray-400 text-xs text-center">
            Great start! Keep it going 💪
          </Text>
        ) : streakData.currentStreak < 7 ? (
          <Text className="text-gray-400 text-xs text-center">
            You're on a roll! {7 - streakData.currentStreak} days to your first week streak 🎯
          </Text>
        ) : (
          <Text className="text-gray-400 text-xs text-center">
            Incredible focus! {streakData.currentStreak} days strong 🏆
          </Text>
        )}
      </View>
    </View>
  );
}