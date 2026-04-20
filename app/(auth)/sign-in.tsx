import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter, type Href } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.replace("/(tabs)" as Href);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pt-12 pb-8">

            {/* Logo / Title */}
            <View className="mb-10">
              <Text className="text-4xl font-bold text-gray-900">FocusFlow</Text>
              <Text className="text-gray-400 text-sm mt-1">
                Master your digital environment.
              </Text>
            </View>

            {/* Heading */}
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              Welcome back
            </Text>
            <Text className="text-gray-400 text-sm mb-8">
              Sign in to your account to continue
            </Text>

            {/* Email input */}
            <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-2">
              EMAIL
            </Text>
            <View className="bg-white rounded-xl px-4 py-3 mb-4 flex-row items-center">
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="flex-1 text-gray-800 text-base"
              />
            </View>

            {/* Password input */}
            <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-2">
              PASSWORD
            </Text>
            <View className="bg-white rounded-xl px-4 py-3 mb-6 flex-row items-center">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="flex-1 text-gray-800 text-base"
              />
              <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>

            {/* Sign in button */}
            <TouchableOpacity
              onPress={handleSignIn}
              disabled={loading}
              className="bg-green-500 rounded-2xl py-4 items-center mb-4"
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-bold text-base">Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Sign up link */}
            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-400 text-sm">
                Don't have an account?{" "}
              </Text>
              <Link href={"/(auth)/sign-up" as Href} asChild>
                <TouchableOpacity>
                  <Text className="text-green-500 font-semibold text-sm">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
