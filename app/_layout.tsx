// import { Stack } from "expo-router";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { useEffect, useState } from "react";
// import { router } from "expo-router";
// import { getOnboardingComplete, resetOnboarding } from "@/store/shields";
// import "../global.css";

// export default function RootLayout() {
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     const checkOnboarding = async () => {
//       await resetOnboarding(); // ← remove after testing
//       const complete = await getOnboardingComplete();
//       if (!complete) {
//         router.replace("/onboarding");
//       }
//       setChecking(false);
//     };

//     checkOnboarding();
//   }, []);

//   return (
//     <SafeAreaProvider>
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="onboarding" />
//         <Stack.Screen name="(tabs)" />
//         <Stack.Screen name="(auth)" />
//       </Stack>
//     </SafeAreaProvider>
//   );
// }

// import { Stack } from "expo-router";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { ShieldsProvider } from "@/context/ShieldsContext";
// import { EmergencyUnlockProvider } from "@/context/EmergencyUnlockContext";
// import FloatingUnlockBubble from "@/components/FloatingUnlockBubble";
// import "../global.css";

// export default function RootLayout() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <SafeAreaProvider>
//         <ShieldsProvider>
//           <EmergencyUnlockProvider>
//             <Stack screenOptions={{ headerShown: false }}>
//               <Stack.Screen name="onboarding" />
//               <Stack.Screen name="(tabs)" />
//               <Stack.Screen name="(auth)" />
//             </Stack>
//             {/* Global floating bubble — renders above everything */}
//             <FloatingUnlockBubble />
//           </EmergencyUnlockProvider>
//         </ShieldsProvider>
//       </SafeAreaProvider>
//     </GestureHandlerRootView>
//   );
// }


import { Stack, router } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ShieldsProvider } from "@/context/ShieldsContext";
import { EmergencyUnlockProvider } from "@/context/EmergencyUnlockContext";
import FloatingUnlockBubble from "@/components/FloatingUnlockBubble";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { getOnboardingComplete } from "@/store/shields";
import "../global.css";

// Safely try to use Clerk
let ClerkProvider: any = null;
let ClerkLoaded: any = null;
let tokenCache: any = null;

try {
  const clerk = require("@clerk/clerk-expo");
  const cache = require("@/lib/tokenCache");
  ClerkProvider = clerk.ClerkProvider;
  ClerkLoaded = clerk.ClerkLoaded;
  tokenCache = cache.tokenCache;
} catch {
  ClerkProvider = null;
  ClerkLoaded = null;
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

function AppShell() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const init = async () => {
      const complete = await getOnboardingComplete();
      if (!complete) {
        router.replace("/onboarding");
      }
      setChecking(false);
    };
    init();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <ActivityIndicator
          size="large"
          color="#22c55e"
          style={{ flex: 1 }}
        />
      </View>
    );
  }

  return (
    <ShieldsProvider>
      <EmergencyUnlockProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
        <FloatingUnlockBubble />
      </EmergencyUnlockProvider>
    </ShieldsProvider>
  );
}

export default function RootLayout() {
  if (ClerkProvider && ClerkLoaded && publishableKey) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ClerkProvider
            publishableKey={publishableKey}
            tokenCache={tokenCache}
          >
            <ClerkLoaded>
              <AppShell />
            </ClerkLoaded>
          </ClerkProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppShell />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}