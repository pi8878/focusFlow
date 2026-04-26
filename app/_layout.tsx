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


import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { ShieldsProvider } from "@/context/ShieldsContext";
import { EmergencyUnlockProvider } from "@/context/EmergencyUnlockContext";
import FloatingUnlockBubble from "@/components/FloatingUnlockBubble";
import { tokenCache } from "@/lib/tokenCache";
import "../global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
          <ClerkLoaded>
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
          </ClerkLoaded>
        </ClerkProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}