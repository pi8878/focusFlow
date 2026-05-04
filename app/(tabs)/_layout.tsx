// import { Tabs } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarStyle: {
//           backgroundColor: "#ffffff",
//           borderTopWidth: 0,
//           elevation: 0,
//           shadowOpacity: 0,
//           height: 70,
//           paddingBottom: 12,
//         },
//         tabBarActiveTintColor: "#22c55e",
//         tabBarInactiveTintColor: "#9ca3af",
//         tabBarShowLabel: false,
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="shield" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="stats"
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="bar-chart" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="settings"
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="settings-outline" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="person-outline" size={size} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

// import { Tabs } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { Platform } from "react-native";

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarStyle: {
//           backgroundColor: "#ffffff",
//           borderTopWidth: 0,
//           elevation: 0,
//           shadowOpacity: 0,
//           height: Platform.OS === "ios" ? 84 : 70,
//           paddingBottom: Platform.OS === "ios" ? 24 : 12,
//         },
//         tabBarActiveTintColor: "#22c55e",
//         tabBarInactiveTintColor: "#9ca3af",
//         tabBarShowLabel: false,
//         // Smooth fade between screens
//         animation: "fade",
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           tabBarIcon: ({ color, size, focused }) => (
//             <Ionicons
//               name={focused ? "shield" : "shield-outline"}
//               size={size}
//               color={color}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="stats"
//         options={{
//           tabBarIcon: ({ color, size, focused }) => (
//             <Ionicons
//               name={focused ? "bar-chart" : "bar-chart-outline"}
//               size={size}
//               color={color}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="settings"
//         options={{
//           tabBarIcon: ({ color, size, focused }) => (
//             <Ionicons
//               name={focused ? "settings" : "settings-outline"}
//               size={size}
//               color={color}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           tabBarIcon: ({ color, size, focused }) => (
//             <Ionicons
//               name={focused ? "person" : "person-outline"}
//               size={size}
//               color={color}
//             />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }


import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === "ios" ? 84 : 70,
          paddingBottom: Platform.OS === "ios" ? 24 : 12,
        },
        tabBarActiveTintColor: "#22c55e",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarShowLabel: false,
        animation: "fade",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "shield" : "shield-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "bar-chart" : "bar-chart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}