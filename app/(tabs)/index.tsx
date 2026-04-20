import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Shield } from "@/types";
import InsightCard from "@/components/InsightCard";
import EmptyState from "@/components/EmptyState";
import ShieldCard from "@/components/ShieldCard";
import ActiveShieldsBadge from "@/components/ActiveShieldsBadge";
import NewShieldModal from "@/components/NewShieldModal";
import { useShields } from "@/hooks/useShields";
import { useState } from "react";

export default function HomeScreen() {
  const {
    shields,
    loading,
    activeCount,
    addShield,
    toggleShield,
    deleteShield,
  } = useShields();

  const [modalVisible, setModalVisible] = useState(false);

  const handleCreateShield = async (newShield: Shield) => {
    await addShield(newShield);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Shield",
      "Are you sure you want to delete this shield?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteShield(id),
        },
      ]
    );
  };

  return (
    <SafeAreaView
      className="flex-1 bg-gray-100"
      edges={["top", "left", "right"]}
    >
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
          <Text className="text-xl font-bold text-gray-900">
            Your Schedules
          </Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="w-9 h-9 bg-white rounded-full items-center justify-center shadow-sm"
          >
            <Ionicons name="add" size={22} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Loading state */}
        {loading ? (
          <View className="mt-16 items-center">
            <ActivityIndicator size="large" color="#22c55e" />
          </View>
        ) : shields.length === 0 ? (
          <EmptyState />
        ) : (
          shields.map((shield) => (
            <ShieldCard
              key={shield.id}
              shield={shield}
              onToggle={toggleShield}
              onDelete={handleDelete}
            />
          ))
        )}

        <View className="h-8" />
      </ScrollView>

      <NewShieldModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreateShield={handleCreateShield}
      />
    </SafeAreaView>
  );
}