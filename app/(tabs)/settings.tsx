import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InsightCard from "@/components/InsightCard";
import SettingsRow from "@/components/SettingsRow";

export default function SettingsScreen() {
  const handleHabitPredictor = () => {
    Alert.alert(
      "AI Habit Predictor",
      "This feature will suggest optimal focus windows based on your usage patterns. Coming soon!",
      [{ text: "OK" }]
    );
  };

  const handleEmergencyUnlock = () => {
    Alert.alert(
      "Emergency Unlock",
      "Configure how long you must wait before unlocking a blocked app early. Coming soon!",
      [{ text: "OK" }]
    );
  };

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

        {/* Settings List */}
        <View className="bg-white mx-4 mt-6 rounded-2xl overflow-hidden">
          <SettingsRow
            icon="git-network-outline"
            iconBgColor="#dcfce7"
            iconColor="#16a34a"
            title="AI Habit Predictor"
            subtitle="Let AI suggest focus windows"
            onPress={handleHabitPredictor}
          />
          <SettingsRow
            icon="time-outline"
            iconBgColor="#f3f4f6"
            iconColor="#374151"
            title="Emergency Unlock Settings"
            subtitle="Configure cooldown and duration"
            onPress={handleEmergencyUnlock}
            isLast={true}
          />
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}