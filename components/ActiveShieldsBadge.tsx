import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ActiveShieldsBadgeProps {
  count: number;
}

export default function ActiveShieldsBadge({ count }: ActiveShieldsBadgeProps) {
  return (
    <View className="flex-row items-center bg-green-100 px-3 py-1.5 rounded-full gap-1">
      <Ionicons name="flash" size={13} color="#16a34a" />
      <Text className="text-green-700 text-xs font-medium ml-0.5">
        {count} Active Shield{count !== 1 ? "s" : ""}
      </Text>
    </View>
  );
}