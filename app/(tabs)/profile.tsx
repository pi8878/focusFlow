import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useShields } from "@/context/ShieldsContext";
import { useStreak } from "@/hooks/useStreak";
import { clearShields } from "@/store/shields";
import { saveStreakData } from "@/store/streak";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Placeholder user data — will be replaced with Clerk user data later
const PLACEHOLDER_USER = {
  name: "FocusFlow User",
  email: "user@focusflow.app",
  avatarInitials: "FF",
};

const APP_VERSION = "1.0.0";

export default function ProfileScreen() {
  const { shields, activeCount, reload } = useShields();
  const hasActiveShields = shields.some((s) => s.isActive);
  const { streakData } = useStreak(hasActiveShields);

  const totalShields = shields.length;
  const inactiveCount = totalShields - activeCount;

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all your shields, streak history and settings. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Everything",
          style: "destructive",
          onPress: async () => {
            await clearShields();
            await saveStreakData({
              currentStreak: 0,
              longestStreak: 0,
              lastActiveDate: null,
              history: [],
            });
            await AsyncStorage.removeItem("focusflow_unlock_settings");
            await reload();
            Alert.alert(
              "Data Cleared",
              "All your data has been reset successfully.",
              [{ text: "OK" }]
            );
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all associated data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: () => {
            // Will be wired to Clerk account deletion in the EAS build stage
            Alert.alert(
              "Coming Soon",
              "Account deletion will be available after authentication is fully set up.",
              [{ text: "OK" }]
            );
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          // Will be wired to Clerk sign out in the EAS build stage
          Alert.alert(
            "Coming Soon",
            "Sign out will be available after authentication is fully set up.",
            [{ text: "OK" }]
          );
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-gray-100"
      edges={["top", "left", "right"]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-3xl font-bold text-gray-900">Profile</Text>
          <Text className="text-sm text-gray-400 mt-0.5">
            Your account and stats
          </Text>
        </View>

        {/* Avatar + Name + Email */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 items-center">
          {/* Avatar circle */}
          <View className="w-20 h-20 rounded-full bg-green-500 items-center justify-center mb-4">
            <Text className="text-white text-2xl font-bold">
              {PLACEHOLDER_USER.avatarInitials}
            </Text>
          </View>

          <Text className="text-xl font-bold text-gray-900">
            {PLACEHOLDER_USER.name}
          </Text>
          <Text className="text-gray-400 text-sm mt-1">
            {PLACEHOLDER_USER.email}
          </Text>

          {/* Edit profile — placeholder for now */}
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "Profile editing will be available after authentication is set up."
              )
            }
            className="mt-4 flex-row items-center gap-1 bg-gray-100 px-4 py-2 rounded-full"
          >
            <Ionicons name="pencil-outline" size={14} color="#6b7280" />
            <Text className="text-gray-500 text-sm ml-1">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Summary */}
        <Text className="text-xs font-semibold text-gray-400 tracking-widest px-4 mt-6 mb-3">
          YOUR STATS
        </Text>
        <View className="bg-white mx-4 rounded-2xl overflow-hidden">

          {/* Row 1 — Active shields */}
          <View className="flex-row items-center px-4 py-4 border-b border-gray-50">
            <View className="w-9 h-9 rounded-full bg-green-100 items-center justify-center mr-3">
              <Ionicons name="shield" size={18} color="#16a34a" />
            </View>
            <Text className="flex-1 text-gray-700 font-medium">
              Active Shields
            </Text>
            <Text className="text-gray-900 font-bold text-base">
              {activeCount}
            </Text>
          </View>

          {/* Row 2 — Total shields */}
          <View className="flex-row items-center px-4 py-4 border-b border-gray-50">
            <View className="w-9 h-9 rounded-full bg-blue-100 items-center justify-center mr-3">
              <Ionicons name="layers-outline" size={18} color="#3b82f6" />
            </View>
            <Text className="flex-1 text-gray-700 font-medium">
              Total Shields
            </Text>
            <Text className="text-gray-900 font-bold text-base">
              {totalShields}
            </Text>
          </View>

          {/* Row 3 — Current streak */}
          <View className="flex-row items-center px-4 py-4 border-b border-gray-50">
            <View className="w-9 h-9 rounded-full bg-orange-100 items-center justify-center mr-3">
              <Ionicons name="flame" size={18} color="#f97316" />
            </View>
            <Text className="flex-1 text-gray-700 font-medium">
              Current Streak
            </Text>
            <Text className="text-gray-900 font-bold text-base">
              {streakData.currentStreak}{" "}
              <Text className="text-gray-400 font-normal text-sm">
                {streakData.currentStreak === 1 ? "day" : "days"}
              </Text>
            </Text>
          </View>

          {/* Row 4 — Longest streak */}
          <View className="flex-row items-center px-4 py-4">
            <View className="w-9 h-9 rounded-full bg-yellow-100 items-center justify-center mr-3">
              <Ionicons name="trophy-outline" size={18} color="#f59e0b" />
            </View>
            <Text className="flex-1 text-gray-700 font-medium">
              Longest Streak
            </Text>
            <Text className="text-gray-900 font-bold text-base">
              {streakData.longestStreak}{" "}
              <Text className="text-gray-400 font-normal text-sm">
                {streakData.longestStreak === 1 ? "day" : "days"}
              </Text>
            </Text>
          </View>
        </View>

        {/* App Info */}
        <Text className="text-xs font-semibold text-gray-400 tracking-widest px-4 mt-6 mb-3">
          APP INFO
        </Text>
        <View className="bg-white mx-4 rounded-2xl overflow-hidden">
          <View className="flex-row items-center px-4 py-4 border-b border-gray-50">
            <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center mr-3">
              <Ionicons name="information-circle-outline" size={18} color="#6b7280" />
            </View>
            <Text className="flex-1 text-gray-700 font-medium">Version</Text>
            <Text className="text-gray-400 text-sm">{APP_VERSION}</Text>
          </View>

          <View className="flex-row items-center px-4 py-4 border-b border-gray-50">
            <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center mr-3">
              <Ionicons name="document-text-outline" size={18} color="#6b7280" />
            </View>
            <TouchableOpacity
              className="flex-1"
              onPress={() =>
                Alert.alert("Coming Soon", "Privacy policy coming soon.")
              }
            >
              <Text className="text-gray-700 font-medium">Privacy Policy</Text>
            </TouchableOpacity>
            <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
          </View>

          <View className="flex-row items-center px-4 py-4">
            <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center mr-3">
              <Ionicons name="shield-checkmark-outline" size={18} color="#6b7280" />
            </View>
            <TouchableOpacity
              className="flex-1"
              onPress={() =>
                Alert.alert("Coming Soon", "Terms of service coming soon.")
              }
            >
              <Text className="text-gray-700 font-medium">
                Terms of Service
              </Text>
            </TouchableOpacity>
            <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
          </View>
        </View>

        {/* Sign Out */}
        <View className="bg-white mx-4 mt-6 rounded-2xl overflow-hidden">
          <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row items-center px-4 py-4"
          >
            <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center mr-3">
              <Ionicons name="log-out-outline" size={18} color="#6b7280" />
            </View>
            <Text className="flex-1 text-gray-700 font-medium">Sign Out</Text>
            <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <Text className="text-xs font-semibold text-red-400 tracking-widest px-4 mt-6 mb-3">
          DANGER ZONE
        </Text>
        <View className="bg-white mx-4 rounded-2xl overflow-hidden">
          <TouchableOpacity
            onPress={handleClearData}
            className="flex-row items-center px-4 py-4 border-b border-gray-50"
          >
            <View className="w-9 h-9 rounded-full bg-red-100 items-center justify-center mr-3">
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </View>
            <View className="flex-1">
              <Text className="text-red-500 font-medium">Clear All Data</Text>
              <Text className="text-gray-400 text-xs mt-0.5">
                Deletes all shields, streaks and settings
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#fca5a5" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDeleteAccount}
            className="flex-row items-center px-4 py-4"
          >
            <View className="w-9 h-9 rounded-full bg-red-100 items-center justify-center mr-3">
              <Ionicons name="person-remove-outline" size={18} color="#ef4444" />
            </View>
            <View className="flex-1">
              <Text className="text-red-500 font-medium">Delete Account</Text>
              <Text className="text-gray-400 text-xs mt-0.5">
                Permanently removes your account
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#fca5a5" />
          </TouchableOpacity>
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}