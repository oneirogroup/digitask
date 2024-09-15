import { Tabs } from "expo-router";

import { Icon } from "@oneiro/ui-kit";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <Icon name="home" state={focused && "active"} />
        }}
      />
      <Tabs.Screen
        name="performance"
        options={{
          title: "Performance",
          tabBarIcon: ({ focused }) => <Icon name="monitor" state={focused && "active"} />
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          title: "Task",
          tabBarIcon: ({ focused }) => <Icon name="task" state={focused && "active"} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <Icon name="profile" state={focused && "active"} />
        }}
      />
    </Tabs>
  );
}
