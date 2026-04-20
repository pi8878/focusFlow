import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { MOCK_SUGGESTIONS, MOCK_WEEKLY_PROGRESS } from "@/constants";
import { Suggestion } from "@/types";
import { getFocusSuggestions } from "@/services/ai";
import { useShields } from "@/hooks/useShields";
import InsightCard from "@/components/InsightCard";
import SuggestionCard from "@/components/SuggestionCard";
import WeeklyProgressBar from "@/components/WeeklyProgressBar";

export default function StatsScreen() {
  const { shields } = useShields();
  const [suggestions, setSuggestions] = useState<Suggestion[]>(MOCK_SUGGESTIONS);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const loadSuggestions = async () => {
      // Only call AI if user has shields set up
      if (shields.length === 0) return;

      setLoadingSuggestions(true);

      const appNames = shields.map((s) => s.appName);
      const results = await getFocusSuggestions(appNames);

      if (results.length > 0) {
        // Convert string array to Suggestion objects
        const formatted: Suggestion[] = results.map((text, index) => ({
          id: index.toString(),
          text,
        }));
        setSuggestions(formatted);
      }
      // If AI returns nothing, mock suggestions stay as fallback

      setLoadingSuggestions(false);
    };

    loadSuggestions();
  }, [shields]);

  return (
    <SafeAreaView
      className="flex-1 bg-gray-100"
      edges={["top", "left", "right"]}
    >
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

        {loadingSuggestions ? (
          <View className="items-center py-6">
            <ActivityIndicator size="large" color="#22c55e" />
            <Text className="text-gray-400 text-sm mt-2">
              Generating suggestions...
            </Text>
          </View>
        ) : (
          suggestions.map((suggestion) => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))
        )}

        {/* Weekly Progress */}
        <WeeklyProgressBar data={MOCK_WEEKLY_PROGRESS} />

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}