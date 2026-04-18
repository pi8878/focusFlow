import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_SUGGESTIONS, MOCK_WEEKLY_PROGRESS } from "@/constants";
import InsightCard from "@/components/InsightCard";
import SuggestionCard from "@/components/SuggestionCard";
import WeeklyProgressBar from "@/components/WeeklyProgressBar";

export default function StatsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-3xl font-bold text-gray-900">FocusFlow</Text>
          <Text className="text-sm text-gray-400 mt-0.5">
            Master your digital environment.
          </Text>
        </View>

        {/* AI Insight Card */}
        <InsightCard />

        {/* AI Suggestions */}
        <Text className="text-xl font-bold text-gray-900 px-4 mt-6 mb-3">
          AI Focus Suggestions
        </Text>

        {MOCK_SUGGESTIONS.map((suggestion) => (
          <SuggestionCard key={suggestion.id} suggestion={suggestion} />
        ))}

        {/* Weekly Progress */}
        <WeeklyProgressBar data={MOCK_WEEKLY_PROGRESS} />

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}