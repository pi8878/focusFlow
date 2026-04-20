import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import InsightCard from "@/components/InsightCard";
import SettingsRow from "@/components/SettingsRow";
import HabitPredictorModal from "@/components/HabitPredictorModal";
import UnlockSettingsModal from "@/components/UnlockSettingsModal";
// import { useShields } from "@/hooks/useShields";
import { useShields } from "@/context/ShieldsContext";

export default function SettingsScreen() {
  const { addShield } = useShields();
  const [habitModalVisible, setHabitModalVisible] = useState(false);
  const [unlockModalVisible, setUnlockModalVisible] = useState(false);

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

        {/* Settings List */}
        <View className="bg-white mx-4 mt-6 rounded-2xl overflow-hidden">
          <SettingsRow
            icon="git-network-outline"
            iconBgColor="#dcfce7"
            iconColor="#16a34a"
            title="AI Habit Predictor"
            subtitle="Let AI suggest focus windows"
            onPress={() => setHabitModalVisible(true)}
          />
          <SettingsRow
            icon="time-outline"
            iconBgColor="#f3f4f6"
            iconColor="#374151"
            title="Emergency Unlock Settings"
            subtitle="Configure cooldown and duration"
            onPress={() => setUnlockModalVisible(true)}
            isLast={true}
          />
        </View>

        <View className="h-8" />
      </ScrollView>

      {/* Modals */}
      <HabitPredictorModal
        visible={habitModalVisible}
        onClose={() => setHabitModalVisible(false)}
        onAddShield={addShield}
      />
      <UnlockSettingsModal
        visible={unlockModalVisible}
        onClose={() => setUnlockModalVisible(false)}
      />
    </SafeAreaView>
  );
}