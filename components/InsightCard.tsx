import { View, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { getFocusQuote } from "@/services/ai";

interface Quote {
  text: string;
  author: string;
}

export default function InsightCard() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuote = async () => {
      setLoading(true);
      const result = await getFocusQuote();
      setQuote(result);
      setLoading(false);
    };

    loadQuote();
  }, []);

  return (
    <View className="bg-gray-900 rounded-2xl p-5 mx-4 mt-4 min-h-24 justify-center">
      {loading ? (
        <ActivityIndicator color="#6b7280" size="small" />
      ) : (
        <>
          <Text className="text-white text-base italic leading-6">
            "{quote?.text}" — {quote?.author}
          </Text>
          <View className="flex-row items-center mt-3">
            <Ionicons name="globe-outline" size={13} color="#6b7280" />
            <Text className="text-gray-500 text-xs ml-1">
              AI-Generated Insight
            </Text>
          </View>
        </>
      )}
    </View>
  );
}