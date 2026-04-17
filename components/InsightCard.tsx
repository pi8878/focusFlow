import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FOCUS_QUOTES } from "@/constants";

export default function InsightCard() {
  // We'll later replace this with a live AI-generated quote
  // For now we pick the first quote from our constants
  const quote = FOCUS_QUOTES[0];

  return (
    <View className="bg-gray-900 rounded-2xl p-5 mx-4 mt-4">
      <Text className="text-white text-base italic leading-6 font-serif">
        "{quote.text}" — {quote.author}
      </Text>

      <View className="flex-row items-center mt-3 gap-1">
        <Ionicons name="globe-outline" size={13} color="#6b7280" />
        <Text className="text-gray-500 text-xs ml-1">AI-Generated Insight</Text>
      </View>
    </View>
  );
}