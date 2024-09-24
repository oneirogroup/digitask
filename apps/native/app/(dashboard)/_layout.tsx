import { Tabs } from "expo-router";

import { Icon } from "@oneiro/ui-kit";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Icon name="home" state={focused && "active"} variables={{ fillPath: color }} />
          )
        }}
      />
      <Tabs.Screen
        name="performance"
        options={{
          title: "Performance",
          tabBarIcon: ({ focused, color }) => (
            <Icon name="monitor" state={focused && "active"} variables={{ fillPath: color }} />
          )
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          title: "Task",
          tabBarIcon: ({ focused, color }) => (
            <Icon name="task" state={focused && "active"} variables={{ fillPath: color }} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <Icon name="profile" state={focused && "active"} variables={{ fillPath: color }} />
          )
        }}
      />
    </Tabs>
  );
}
