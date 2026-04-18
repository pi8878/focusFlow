import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Suggestion } from "@/types";

interface SuggestionCardProps {
  suggestion: Suggestion;
}

export default function SuggestionCard({ suggestion }: SuggestionCardProps) {
  return (
    <View className="flex-row items-start bg-white mx-4 mb-3 rounded-2xl p-4 gap-3">
      <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mt-0.5">
        <Ionicons name="flash" size={14} color="#16a34a" />
      </View>
      <Text className="flex-1 text-gray-700 text-sm leading-5">
        {suggestion.text}
      </Text>
    </View>
  );
}