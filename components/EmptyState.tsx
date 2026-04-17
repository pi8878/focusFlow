import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EmptyState() {
  return (
    <View className="mx-4 mt-3 border border-dashed border-gray-300 rounded-2xl py-12 items-center justify-center">
      <Ionicons name="alert-circle-outline" size={36} color="#d1d5db" />
      <Text className="text-gray-400 text-sm mt-3 text-center px-6">
        No schedules set yet. Add your first distraction shield!
      </Text>
    </View>
  );
}