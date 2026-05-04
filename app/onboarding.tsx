import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { setOnboardingComplete } from "@/store/shields";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const SLIDES = [
  {
    id: 1,
    icon: "shield" as const,
    iconColor: "#22c55e",
    iconBg: "#dcfce7",
    title: "Welcome to FocusFlow",
    subtitle: "Master your digital environment.",
    description:
      "Take back control of your time. FocusFlow helps you block distracting apps on your own schedule so you can focus on what actually matters.",
  },
  {
    id: 2,
    icon: "time" as const,
    iconColor: "#3b82f6",
    iconBg: "#dbeafe",
    title: "Set Your Shields",
    subtitle: "Block apps on your schedule.",
    description:
      "Choose which apps to block, set the times and days that work for you, and let FocusFlow enforce your boundaries automatically.",
  },
  {
    id: 3,
    icon: "trending-up" as const,
    iconColor: "#f97316",
    iconBg: "#ffedd5",
    title: "Build Better Habits",
    subtitle: "Track your focus streaks.",
    description:
      "Watch your focus streak grow every day. Get AI-powered suggestions based on your patterns and see how much time you reclaim each week.",
  },
];

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({
        x: SCREEN_WIDTH * (activeIndex + 1),
        animated: true,
      });
    }
  };

  // const handleGetStarted = async () => {
  //   await setOnboardingComplete();
  //   router.replace("/(tabs)");
  // };

  // const handleSkip = async () => {
  //   await setOnboardingComplete();
  //   router.replace("/(tabs)");
  // };

  const handleGetStarted = async () => {
    await setOnboardingComplete();
    // Small delay to ensure storage write completes before navigation
    setTimeout(() => {
      router.replace("/(tabs)");
    }, 100);
  };

  const handleSkip = async () => {
    await setOnboardingComplete();
    setTimeout(() => {
      router.replace("/(tabs)");
    }, 100);
  };

  const isLastSlide = activeIndex === SLIDES.length - 1;

  // Slide content height — leaves room for dots and button at bottom
  const SLIDE_HEIGHT = SCREEN_HEIGHT * 0.72;

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["top", "left", "right", "bottom"]}
    >
      {/* Skip button */}
      <View className="flex-row justify-end px-6 pt-2 pb-2">
        {!isLastSlide && (
          <TouchableOpacity onPress={handleSkip}>
            <Text className="text-gray-400 text-sm font-medium">Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Slides — explicit height instead of flex: 1 */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={{ height: SLIDE_HEIGHT }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {SLIDES.map((slide) => (
          <View
            key={slide.id}
            style={{ width: SCREEN_WIDTH, height: SLIDE_HEIGHT }}
            className="items-center justify-center px-8"
          >
            {/* Icon circle */}
            <View
              className="w-32 h-32 rounded-full items-center justify-center mb-8"
              style={{ backgroundColor: slide.iconBg }}
            >
              <Ionicons
                name={slide.icon}
                size={56}
                color={slide.iconColor}
              />
            </View>

            {/* Title */}
            <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
              {slide.title}
            </Text>

            {/* Subtitle */}
            <Text className="text-green-500 text-sm font-medium text-center mb-5">
              {slide.subtitle}
            </Text>

            {/* Description */}
            <Text className="text-gray-400 text-base text-center leading-7 px-2">
              {slide.description}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom section — dots + button */}
      <View className="px-6 pb-6 pt-4">

        {/* Dot indicators */}
        <View className="flex-row justify-center items-center gap-2 mb-6">
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={{
                height: 8,
                width: index === activeIndex ? 24 : 8,
                borderRadius: 4,
                backgroundColor: index === activeIndex ? "#22c55e" : "#e5e7eb",
              }}
            />
          ))}
        </View>

        {/* CTA button */}
        {isLastSlide ? (
          <TouchableOpacity
            onPress={handleGetStarted}
            className="bg-green-500 rounded-2xl py-4 items-center"
          >
            <Text className="text-white font-bold text-base">
              Get Started
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleNext}
            className="bg-gray-900 rounded-2xl py-4 items-center flex-row justify-center gap-2"
          >
            <Text className="text-white font-bold text-base mr-2">Next</Text>
            <Ionicons name="arrow-forward" size={18} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}