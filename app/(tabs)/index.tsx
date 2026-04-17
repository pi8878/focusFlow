import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MOCK_SHIELDS } from "@/constants";
import { Shield } from "@/types";
import InsightCard from "@/components/InsightCard";
import EmptyState from "@/components/EmptyState";
import ShieldCard from "@/components/ShieldCard";
import ActiveShieldsBadge from "@/components/ActiveShieldsBadge";

export default function HomeScreen() {
  const [shields, setShields] = useState<Shield[]>(MOCK_SHIELDS);

  const activeCount = shields.filter((s) => s.isActive).length;

  const handleToggle = (id: string, value: boolean) => {
    setShields((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: value } : s))
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
          <View>
            <Text className="text-3xl font-bold text-gray-900">FocusFlow</Text>
            <Text className="text-sm text-gray-400 mt-0.5">
              Master your digital environment.
            </Text>
          </View>
          <ActiveShieldsBadge count={activeCount} />
        </View>

        {/* AI Insight Card */}
        <InsightCard />

        {/* Schedules Section */}
        <View className="flex-row items-center justify-between px-4 mt-6 mb-1">
          <Text className="text-xl font-bold text-gray-900">Your Schedules</Text>
          <TouchableOpacity className="w-9 h-9 bg-white rounded-full items-center justify-center shadow-sm">
            <Ionicons name="add" size={22} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Shield list or empty state */}
        {shields.length === 0 ? (
          <EmptyState />
        ) : (
          shields.map((shield) => (
            <ShieldCard
              key={shield.id}
              shield={shield}
              onToggle={handleToggle}
            />
          ))
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}