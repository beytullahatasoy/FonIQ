import { Tabs } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Keşfet",
          tabBarIcon: () => (
            <FontAwesome6 name="searchengin" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          title: "Karşılaştır",
          tabBarIcon: () => (
            <FontAwesome6 name="code-compare" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: "AI",
          tabBarIcon: () => (
            <FontAwesome6 name="message" size={24} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}
