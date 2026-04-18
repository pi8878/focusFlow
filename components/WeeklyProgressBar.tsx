import { View, Text } from "react-native";
import { WeeklyProgress } from "@/types";

interface WeeklyProgressBarProps {
  data: WeeklyProgress[];
}

export default function WeeklyProgressBar({ data }: WeeklyProgressBarProps) {
  const maxMinutes = Math.max(...data.map((d) => d.minutesSaved));

  return (
    <View className="bg-white mx-4 rounded-2xl p-5 mt-3">
      <Text className="text-base font-bold text-gray-900 mb-1">
        Weekly Progress
      </Text>
      <Text className="text-xs text-gray-400 mb-5">
        Minutes saved from distractions
      </Text>

      {/* Bars */}
      <View className="flex-row items-end justify-between h-28">
        {data.map((item) => {
          const heightPercent = maxMinutes > 0
            ? (item.minutesSaved / maxMinutes) * 100
            : 0;

          return (
            <View key={item.day} className="items-center flex-1">
              {/* Minutes label above bar */}
              <Text className="text-xs text-gray-400 mb-1">
                {item.minutesSaved}
              </Text>

              {/* Bar */}
              <View className="w-6 bg-gray-100 rounded-full overflow-hidden"
                style={{ height: 80 }}
              >
                <View
                  className="w-full bg-green-500 rounded-full absolute bottom-0"
                  style={{ height: `${heightPercent}%` }}
                />
              </View>

              {/* Day label below bar */}
              <Text className="text-xs text-gray-400 mt-2">{item.day}</Text>
            </View>
          );
        })}
      </View>

      {/* Total summary */}
      <View className="border-t border-gray-100 mt-5 pt-4 flex-row justify-between">
        <View className="items-center">
          <Text className="text-lg font-bold text-gray-900">
            {data.reduce((sum, d) => sum + d.minutesSaved, 0)}
          </Text>
          <Text className="text-xs text-gray-400">mins saved</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-gray-900">
            {data.filter((d) => d.minutesSaved > 0).length}
          </Text>
          <Text className="text-xs text-gray-400">active days</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-green-500">
            {Math.round(
              data.reduce((sum, d) => sum + d.minutesSaved, 0) / 60
            )}h
          </Text>
          <Text className="text-xs text-gray-400">total hours</Text>
        </View>
      </View>
    </View>
  );
}